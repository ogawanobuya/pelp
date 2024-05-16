import { Timestamp } from 'firebase-admin/firestore';

import {
  enterpriseUserGroupDocPath,
  oneTimePasswordDocPath,
  AddEnterpriseEmailsArgs,
  castToOneTimePassword,
  OneTimePassword,
  castToEnterpriseUserGroup
} from '../../pelp-repositories';
import admin from '../../utils/firebase/admin';
import { functions128MB } from '../../utils/firebase/functions';

export const addEnterpriseEmails = functions128MB.https.onCall(
  async (data: AddEnterpriseEmailsArgs, context) => {
    const { auth } = context;
    if (!auth) throw Error('Not authenticated.');

    // enterprise admin のみから呼び出し可能
    const { enterpriseId, isEnterpriseAdmin } = auth.token;
    if (!enterpriseId || !isEnterpriseAdmin) throw Error('Permission denied.');

    const { newEmails } = data;
    const enterpriseUserGroupDocRef = admin
      .firestore()
      .doc(enterpriseUserGroupDocPath(enterpriseId));

    const oneTimePasswordDocRefs = newEmails.map((email) =>
      admin.firestore().doc(oneTimePasswordDocPath(email))
    );

    const oneTimePasswords = (
      await Promise.all(
        oneTimePasswordDocRefs.map(async (ref) =>
          castToOneTimePassword((await ref.get()).data())
        )
      )
    ).filter((item) => item) as Array<OneTimePassword>;
    const allVerified = oneTimePasswords.every((otp) => otp.verified);
    if (!allVerified) throw Error('Some of emails are not verified.');

    const before = castToEnterpriseUserGroup(
      (await enterpriseUserGroupDocRef.get()).data()
    );
    if (!before) throw Error('Failed to cast to EnterpriseUserGroup.');
    // 重複削除
    const emails = Array.from(new Set([...before.emails, ...newEmails]));
    await enterpriseUserGroupDocRef.update({
      emails,
      lastEditedAt: Timestamp.now()
    });
    await Promise.all(oneTimePasswordDocRefs.map((ref) => ref.delete()));

    // onUpdateEnterpriseUserGroup が呼び出される
  }
);