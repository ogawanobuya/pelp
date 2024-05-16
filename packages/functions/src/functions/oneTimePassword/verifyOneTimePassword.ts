import { Timestamp } from 'firebase-admin/firestore';

import { oneTimePasswordDocPath } from '../../pelp-repositories/paths/oneTimePassword';
import { VerifyOneTimePasswordArgs } from '../../pelp-repositories/types/functions/verifyOneTimePassword';
import { castToOneTimePassword } from '../../pelp-repositories/types/oneTimePassword';
import admin from '../../utils/firebase/admin';
import { functions128MB } from '../../utils/firebase/functions';

export const verifyOneTimePassword = functions128MB.https.onCall(
  async (data: VerifyOneTimePasswordArgs) => {
    const { email, oneTimePassword } = data;

    const ref = admin.firestore().doc(oneTimePasswordDocPath(email));
    const snapshot = await ref.get();
    if (!snapshot.exists) throw Error('OTP has not been generated.');
    const docData = castToOneTimePassword(snapshot.data());
    if (!docData) throw Error('Failed to cast to OneTimePassword.');
    if (docData.verified) throw Error('Already verified.');
    if (docData.oneTimePassword !== oneTimePassword)
      throw Error('Wrong one time password.');

    await ref.update({ verified: true, lastEditedAt: Timestamp.now() });
  }
);