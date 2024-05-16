import { Timestamp } from 'firebase-admin/firestore';

import {
  enterpriseUserDocPath,
  CreateEnterpriseUserArgs,
  EnterpriseUser
} from '../../pelp-repositories';
import { sendEmail, templateId } from '../../utils/email/sendgrid';
import { ENTERPRISE_SIGN_IN_URL } from '../../utils/env';
import admin from '../../utils/firebase/admin';
import {
  createUser,
  generatePasswordResetLink,
  updateCustomClaims
} from '../../utils/firebase/auth';
import { fetchEnterpriseUserGroup } from '../../utils/firebase/firestore/enterpriseUser';
import { functions128MB } from '../../utils/firebase/functions';
import { randomString } from '../../utils/randomString';

export const createEnterpriseUser = functions128MB.https.onCall(
  async (data: CreateEnterpriseUserArgs, context) => {
    const { auth } = context;
    if (!auth) throw Error('Not authenticated.');

    // enterprise admin のみから呼び出し可能
    const { enterpriseId, isEnterpriseAdmin } = auth.token;
    if (!enterpriseId || !isEnterpriseAdmin) throw Error('Permission denied.');

    const enterpriseUserGroup = await fetchEnterpriseUserGroup(enterpriseId);
    if (!enterpriseUserGroup)
      throw Error('Failed to fetch enterpriseUserGroup.');

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
      if (typeof customClaims?.enterpriseId === 'string') return;

      const enterpriseUser: EnterpriseUser = {
        id: uid,
        email,
        enterpriseId,
        enterpriseName: enterpriseUserGroup.name,
        enterpriseEmails: enterpriseUserGroup.emails,
        isGroupAdmin,
        role: [] as Array<string>,
        createdAt: now,
        lastEditedAt: now
      };
      await createEnterpriseUserDoc(enterpriseUser);
      await updateCustomClaims(uid, {
        enterpriseId,
        isEnterpriseAdmin: isGroupAdmin,
        enterpriseEmails: [...enterpriseUserGroup.emails],
        enterpriseRole: []
      });
    } catch (e) {
      // ユーザーが存在しない場合（通常はこちら）
      const uid = randomString();

      const enterpriseUser: EnterpriseUser = {
        id: uid,
        email,
        enterpriseId,
        enterpriseName: enterpriseUserGroup.name,
        enterpriseEmails: enterpriseUserGroup.emails,
        isGroupAdmin,
        role: [] as Array<string>,
        createdAt: now,
        lastEditedAt: now
      };
      await createEnterpriseUserDoc(enterpriseUser);
      await createUser({
        uid,
        email,
        customClaims: {
          enterpriseId,
          isEnterpriseAdmin: isGroupAdmin,
          enterpriseEmails: [...enterpriseUserGroup.emails],
          enterpriseRole: []
        }
      });
      await sendPasswordResetEmail(uid, email);
    }
  }
);

const createEnterpriseUserDoc = async (enterpriseUser: EnterpriseUser) => {
  const docRef = admin
    .firestore()
    .doc(enterpriseUserDocPath(enterpriseUser.enterpriseId, enterpriseUser.id));
  await docRef.create(enterpriseUser);
};

const sendPasswordResetEmail = async (uid: string, email: string) => {
  const url = ENTERPRISE_SIGN_IN_URL;
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