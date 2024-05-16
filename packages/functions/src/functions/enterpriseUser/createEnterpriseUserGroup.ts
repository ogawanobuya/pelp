import { Timestamp } from 'firebase-admin/firestore';

import {
  CreateEnterpriseUserGroupArgs,
  EnterpriseUser,
  enterpriseUserDocPath,
  EnterpriseUserGroup,
  enterpriseUserGroupDocPath
} from '../../pelp-repositories';
import { sendEmail, templateId } from '../../utils/email/sendgrid';
import { ENTERPRISE_SIGN_IN_URL } from '../../utils/env';
import admin from '../../utils/firebase/admin';
import {
  createUser,
  generatePasswordResetLink,
  updateCustomClaims
} from '../../utils/firebase/auth';
import { functions128MB } from '../../utils/firebase/functions';
import { randomString } from '../../utils/randomString';

export const createEnterpriseUserGroup = functions128MB.https.onCall(
  async (data: CreateEnterpriseUserGroupArgs, context) => {
    const { auth } = context;
    if (!auth) throw Error('Not authenticated.');
    if (!auth.token.admin) throw Error('Permission denied.');

    const { emails, name, wacc, adminEmail } = data;
    const enterpriseId = randomString();
    const now = Timestamp.now();

    try {
      // getUserByEmailはユーザーが存在しなければErrorを投げる
      // これを利用してユーザーが存在するかを検証している
      // see: https://firebase.google.com/docs/auth/admin/manage-users#retrieve_user_data
      const userRecord = await admin.auth().getUserByEmail(adminEmail);
      // ユーザーが存在する場合
      const { uid, customClaims } = userRecord;
      const adminUserId = uid;
      // 既に他のバイヤーグループに所属している場合
      // TODO: #126 他のバイヤーグループに所属している場合のメッセージ
      if (typeof customClaims?.enterpriseId === 'string') return;

      const group: EnterpriseUserGroup = {
        id: enterpriseId,
        emails,
        name,
        wacc,
        createdAt: now,
        lastEditedAt: now
      };
      const adminUser: EnterpriseUser = {
        id: adminUserId,
        email: adminEmail,
        enterpriseId,
        enterpriseName: name,
        enterpriseEmails: emails,
        isGroupAdmin: true,
        role: [] as Array<string>,
        createdAt: now,
        lastEditedAt: now
      };
      await createDocs(group, adminUser);

      await updateCustomClaims(uid, {
        enterpriseId,
        isEnterpriseAdmin: true,
        enterpriseEmails: emails,
        enterpriseRole: []
      });
    } catch (e) {
      // ユーザーが存在しない場合（通常はこちら）
      const adminUserId = randomString();

      const group: EnterpriseUserGroup = {
        id: enterpriseId,
        emails,
        name,
        wacc,
        createdAt: now,
        lastEditedAt: now
      };
      const adminUser: EnterpriseUser = {
        id: adminUserId,
        email: adminEmail,
        enterpriseId,
        enterpriseName: name,
        enterpriseEmails: emails,
        isGroupAdmin: true,
        role: [] as Array<string>,
        createdAt: now,
        lastEditedAt: now
      };
      await createDocs(group, adminUser);

      await createUser({
        uid: adminUserId,
        email: adminEmail,
        customClaims: {
          enterpriseId,
          isEnterpriseAdmin: true,
          enterpriseEmails: emails,
          enterpriseRole: []
        }
      });
      await sendPasswordResetEmail(adminUserId, adminEmail);
    }
  }
);

const createDocs = async (
  group: EnterpriseUserGroup,
  adminUser: EnterpriseUser
) => {
  const groupDocRef = admin
    .firestore()
    .doc(enterpriseUserGroupDocPath(group.id));
  const adminUserDocRef = admin
    .firestore()
    .doc(enterpriseUserDocPath(group.id, adminUser.id));

  const batch = admin.firestore().batch();
  batch.create(groupDocRef, group);
  batch.create(adminUserDocRef, adminUser);
  await batch.commit();
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