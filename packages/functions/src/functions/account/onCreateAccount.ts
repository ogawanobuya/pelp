import { castToAccount } from '../../pelp-repositories';
import { convertToAccountTemplateData } from '../../utils/email/accountTemplateData';
import { asmGroupId, sendEmail, templateId } from '../../utils/email/sendgrid';
import { VENDOR_SIGN_IN_URL } from '../../utils/env';
import { generateSignInWithEmailLink } from '../../utils/firebase/auth';
import { updateDiscountRate } from '../../utils/firebase/firestore/account';
import { functions128MB } from '../../utils/firebase/functions';

export const onCreateAccount = functions128MB.firestore
  .document('/accounts/{accountId}')
  .onCreate(async (snapshot) => {
    const updateData = await updateDiscountRate(snapshot);

    const account = castToAccount(snapshot.data());
    if (!account) throw Error('Failed to cast to Account');

    const url = VENDOR_SIGN_IN_URL;
    if (!url) throw Error('url is not defined');
    const signInWithEmailLink = await generateSignInWithEmailLink({
      url,
      email: account.vendorEmail
    });

    // ベータ版では100万円以上の取引だけを扱うことになっている
    // それ未満の場合には通知を飛ばさない
    // TODO: β版終了時に100万円未満でも通知が飛ぶようにする
    if (account.currency !== 'jpy' || account.amount < 1000000) return;

    await sendEmail({
      to: account.vendorEmail,
      templateId: templateId.newAccount,
      dynamicTemplateData: {
        signInWithEmailLink,
        account: convertToAccountTemplateData({ ...account, ...updateData })
      },
      groupId: asmGroupId.vendorNotification,
      groupsToDisplay: [asmGroupId.vendorNotification]
    });
  });