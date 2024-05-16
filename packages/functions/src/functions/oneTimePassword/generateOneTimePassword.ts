import { Timestamp } from 'firebase-admin/firestore';
import { customAlphabet } from 'nanoid/non-secure';

import { oneTimePasswordDocPath } from '../../pelp-repositories/paths/oneTimePassword';
import { GenerateOneTimePasswordArgs } from '../../pelp-repositories/types/functions/generateOneTimePassword';
import { OneTimePassword } from '../../pelp-repositories/types/oneTimePassword';
import { sendEmail, templateId } from '../../utils/email/sendgrid';
import admin from '../../utils/firebase/admin';
import { functions128MB } from '../../utils/firebase/functions';

export const generateOneTimePassword = functions128MB.https.onCall(
  async (data: GenerateOneTimePasswordArgs) => {
    const { email } = data;

    // O抜きアルファベット大文字と数字
    const oneTimePassword = customAlphabet(
      'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789',
      6
    )();

    const docData: OneTimePassword = {
      email,
      oneTimePassword,
      verified: false,
      createdAt: Timestamp.now(),
      lastEditedAt: Timestamp.now()
    };

    const ref = admin.firestore().doc(oneTimePasswordDocPath(email));
    // 前のものを消す
    if ((await ref.get()).exists) await ref.delete();
    await ref.create(docData);

    await sendEmail({
      to: email,
      templateId: templateId.oneTimePassword,
      dynamicTemplateData: { oneTimePassword }
    });
  }
);