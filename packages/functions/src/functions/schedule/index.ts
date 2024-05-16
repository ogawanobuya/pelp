import { addDays, format, subDays } from 'date-fns';

import { oneTimePasswordsCollectionPath } from '../../pelp-repositories';
import { asmGroupId, sendEmail, templateId } from '../../utils/email/sendgrid';
import { ENTERPRISE_SIGN_IN_URL } from '../../utils/env';
import admin from '../../utils/firebase/admin';
import { generateSignInWithEmailLink } from '../../utils/firebase/auth';
import {
  fetchAccountsToConfirmAutomatically,
  fetchInactiveAccountsToExpire,
  fetchActiveAccountsToExpire,
  fetchAccountsToMarkedAsOutdated,
  updateStatus,
  updateNewPayDateBatch
} from '../../utils/firebase/firestore/account';
import { functions4GB } from '../../utils/firebase/functions';

export * from './backup';

export const schedule = functions4GB.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    confirmAccounts();
    // confirm した後に expire する
    // 同時に条件を満たす場合がある
    await markAsOutdatedAccounts();
    await expireAccounts();
    deleteOneTimePassword();
  });

const confirmAccounts = async () => {
  updateStatus(await fetchAccountsToConfirmAutomatically(), 'confirmed');
};

// TODO: #130 Enterpriseごとに自動で早払い日を更新するかstatus:expiredにするかを設定する
const expireAccounts = async () => {
  const inactiveAccounts = await fetchInactiveAccountsToExpire();
  const activeAccounts = await fetchActiveAccountsToExpire();
  // statusの変更はないのでonUpdateAccountsではなくここでnewPayDateを更新する
  await updateNewPayDateBatch(inactiveAccounts);
  // onUpdateAccountsでnewPayDateを更新
  await updateStatus(activeAccounts, 'inactive');

  // Set にキャストして配列に戻すことで重複排除
  const enterpriseEmails = Array.from(
    new Set(
      [...inactiveAccounts, ...activeAccounts].flatMap(
        (account) => account.enterpriseEmails
      )
    )
  );
  const url = ENTERPRISE_SIGN_IN_URL;
  if (!url) throw Error('url is not defined');
  await Promise.all(
    enterpriseEmails.map(async (email) => {
      const signInWithEmailLink = await generateSignInWithEmailLink({
        url,
        email
      });
      await sendEmail({
        to: email,
        templateId: templateId.accountUpdated,
        dynamicTemplateData: {
          signInWithEmailLink,
          before: {
            newPayDate: `${format(
              subDays(new Date(), 3),
              'yyyy/MM/dd'
            )}, ${format(new Date(), 'yyyy/MM/dd')}`
          },
          after: {
            newPayDate: `${format(
              addDays(new Date(), 4),
              'yyyy/MM/dd'
            )}, ${format(addDays(new Date(), 7), 'yyyy/MM/dd')}`
          }
        },
        groupId: asmGroupId.enterpriseNotification,
        groupsToDisplay: [asmGroupId.enterpriseNotification]
      });
    })
  );
};

const markAsOutdatedAccounts = async () => {
  updateStatus(await fetchAccountsToMarkedAsOutdated('inactive'), 'outdated');
  updateStatus(await fetchAccountsToMarkedAsOutdated('active'), 'outdated');
  updateStatus(await fetchAccountsToMarkedAsOutdated('expired'), 'outdated');
};

const deleteOneTimePassword = async () => {
  const snapshot = await admin
    .firestore()
    .collection(oneTimePasswordsCollectionPath)
    .orderBy('createdAt')
    .get();
  snapshot.docs.forEach((doc) => doc.ref.delete());
};