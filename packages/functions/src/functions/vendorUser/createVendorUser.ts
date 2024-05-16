import { Timestamp } from 'firebase-admin/firestore';

import {
  vendorUserDocPath,
  CreateVendorUserArgs,
  VendorUser
} from '../../pelp-repositories';
import { sendEmail, templateId } from '../../utils/email/sendgrid';
import { VENDOR_SIGN_IN_URL } from '../../utils/env';
import admin from '../../utils/firebase/admin';
import {
  createUser,
  generatePasswordResetLink,
  updateCustomClaims
} from '../../utils/firebase/auth';
import { fetchVendorUserGroup } from '../../utils/firebase/firestore/vendorUser';
import { functions128MB } from '../../utils/firebase/functions';
import { randomString } from '../../utils/randomString';

export const createVendorUser = functions128MB.https.onCall(
  async (data: CreateVendorUserArgs, context) => {
    const { auth } = context;
    if (!auth) throw Error('Not authenticated.');

    // vendor admin のみから呼び出し可能
    const { vendorId, isVendorAdmin } = auth.token;
    if (!vendorId || !isVendorAdmin) throw Error('Permission denied.');

    const vendorUserGroup = await fetchVendorUserGroup(vendorId);
    if (!vendorUserGroup) throw Error('Failed to fetch vendorUserGroup.');

    const { email, isGroupAdmin } = data;
    const now = Timestamp.now();

    try {
      // getUserByEmailはユーザーが存在しなければErrorを投げる
      // これを利用してユーザーが存在するかを検証している
      // see: https://firebase.google.com/docs/auth/admin/manage-users#retrieve_user_data
      const userRecord = await admin.auth().getUserByEmail(email);
      // ユーザーが存在する場合
      const { uid, customClaims } = userRecord;
      // 既に他のバイヤーグループに所属している場合
      // TODO: #126 他のバイヤーグループに所属している場合のメッセージ
      if (typeof customClaims?.vendorId === 'string') return;

      const vendorUser: VendorUser = {
        id: uid,
        email,
        vendorId,
        vendorName: vendorUserGroup.name,
        vendorEmails: vendorUserGroup.emails,
        isGroupAdmin,
        role: [] as Array<string>,
        createdAt: now,
        lastEditedAt: now
      };
      await createVendorUserDoc(vendorUser);

      await updateCustomClaims(uid, {
        vendorId,
        isVendorAdmin: isGroupAdmin,
        vendorEmails: vendorUserGroup.emails,
        vendorRole: []
      });
    } catch (e) {
      // ユーザーが存在しない場合（通常はこちら）
      const uid = randomString();

      const vendorUser: VendorUser = {
        id: uid,
        email,
        vendorId,
        vendorName: vendorUserGroup.name,
        vendorEmails: vendorUserGroup.emails,
        isGroupAdmin,
        role: [] as Array<string>,
        createdAt: Timestamp.now(),
        lastEditedAt: Timestamp.now()
      };
      await createVendorUserDoc(vendorUser);
      await createUser({
        uid,
        email,
        customClaims: {
          vendorId,
          isVendorAdmin: isGroupAdmin,
          vendorEmails: vendorUserGroup.emails,
          vendorRole: []
        }
      });

      sendPasswordResetEmail(uid, email);
    }
  }
);

const createVendorUserDoc = async (vendorUser: VendorUser) => {
  const docRef = admin
    .firestore()
    .doc(vendorUserDocPath(vendorUser.vendorId, vendorUser.id));
  await docRef.create(vendorUser);
};

const sendPasswordResetEmail = async (uid: string, email: string) => {
  const url = VENDOR_SIGN_IN_URL;
  if (!url) throw Error('url is not defined');
  const passwordResetLink = await generatePasswordResetLink({
    url,
    email
  });
  await sendEmail({
    to: email,
    templateId: templateId.passwordReset,
    dynamicTemplateData: { passwordResetLink }
  });
};