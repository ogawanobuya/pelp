import { addDays, subDays } from 'date-fns';
import { Timestamp } from 'firebase-admin/firestore';
import { QueryDocumentSnapshot } from 'firebase-functions/v1/firestore';

import {
  Account,
  accountDocPath,
  accountsCollectionPath,
  AccountStatus,
  castToAccount,
  castToEnterpriseUserGroup,
  enterpriseUserGroupDocPath
} from '../../../pelp-repositories';
import { calculateDiscountRate } from '../../discountRate';
import { getPreviousBusinessDay } from '../../isBusinessDay';
import { sequentialExcution } from '../../sequentialExecution';
import { sliceIntoBatchSize } from '../../sliceIntoBatchSize';
import { generateAccountStatusNumber } from '../../statusNumber';
import admin from '../admin';

// TODO: #131 list クエリにlimitを設定して処理を時間分散する
export const fetchAccountsToConfirmAutomatically = async () => {
  const snapshot = await admin
    .firestore()
    .collection(accountsCollectionPath)
    // 7日前のものはconfirmする
    .where('newPayDate', '<=', Timestamp.fromDate(subDays(new Date(), 7)))
    .where('status', '==', 'paid')
    .orderBy('newPayDate')
    .get();
  const accounts = snapshot.docs
    .map((doc) => castToAccount(doc.data()))
    .filter((account) => account) as Array<Account>;
  return accounts;
};

// TODO: #131 list クエリにlimitを設定して処理を時間分散する
export const fetchInactiveAccountsToExpire = async () => {
  const snapshot = await admin
    .firestore()
    .collection(accountsCollectionPath)
    // 2営業日前またはそれ以前
    .where(
      'newPayDate',
      '<=',
      Timestamp.fromDate(getPreviousBusinessDay(new Date(), 2))
    )
    .where('status', '==', 'inactive')
    .orderBy('newPayDate')
    .get();

  const accounts = snapshot.docs
    .map((doc) => castToAccount(doc.data()))
    .filter((account) => account) as Array<Account>;
  return accounts;
};

// TODO: #131 list クエリにlimitを設定して処理を時間分散する
export const fetchActiveAccountsToExpire = async () => {
  const snapshot = await admin
    .firestore()
    .collection(accountsCollectionPath)
    // 早払い日当日またはそれ以前
    .where('newPayDate', '<=', Timestamp.now())
    .where('status', '==', 'active')
    .orderBy('newPayDate')
    .get();

  const accounts = snapshot.docs
    .map((doc) => castToAccount(doc.data()))
    .filter((account) => account) as Array<Account>;
  return accounts;
};

// TODO: #131 list クエリにlimitを設定して処理を時間分散する
export const fetchAccountsToMarkedAsOutdated = async (
  status: AccountStatus
) => {
  const snapshot = await admin
    .firestore()
    .collection(accountsCollectionPath)
    // 支払日当日またはそれ以前
    .where('originalDueDate', '<=', Timestamp.fromDate(subDays(new Date(), 10)))
    .where('status', '==', status)
    .orderBy('originalDueDate')
    .get();
  const accounts = snapshot.docs
    .map((doc) => castToAccount(doc.data()))
    .filter((account) => account) as Array<Account>;
  return accounts;
};

export const updateNewPayDateBatch = (target: Array<Account>) =>
  sequentialExcution(
    sliceIntoBatchSize(target),
    async (accounts) => {
      const batch = admin.firestore().batch();
      accounts.forEach((account) => {
        const { newPayDate } = account;
        batch.update(admin.firestore().doc(accountDocPath(account.id)), {
          status: 'inactive',
          statusNumber: generateAccountStatusNumber('inactive'),
          // newPayDateを7日後に変更
          newPayDate: Timestamp.fromDate(addDays(newPayDate.toDate(), 7)),
          lastEditedAt: Timestamp.now()
        });
      });
      await batch.commit();
    },
    2000 // 逐次実行間で2s待つ
  );

export const updateStatus = (target: Array<Account>, status: AccountStatus) =>
  sequentialExcution(
    sliceIntoBatchSize(target),
    async (accounts) => {
      const batch = admin.firestore().batch();
      accounts.forEach((account) =>
        batch.update(admin.firestore().doc(accountDocPath(account.id)), {
          status,
          statusNumber: generateAccountStatusNumber(status),
          lastEditedAt: Timestamp.now()
        })
      );
      await batch.commit();
    },
    2000 // 逐次実行間で2s待つ
  );

export const updateDiscountRate = async (snapshot: QueryDocumentSnapshot) => {
  const account = castToAccount(snapshot.data());
  if (!account) throw Error('Account data is invalid.');

  const { enterpriseId } = account;
  const enterpriseUserGroupSnap = await admin
    .firestore()
    .doc(enterpriseUserGroupDocPath(enterpriseId))
    .get();
  const enterpriseUserGroup = castToEnterpriseUserGroup(
    enterpriseUserGroupSnap.data()
  );
  if (!enterpriseUserGroup) throw Error('Account data is invalid.');

  const discountInfo = calculateDiscountRate(
    enterpriseUserGroup.wacc,
    account.amount,
    account.originalDueDate.toDate(),
    account.newPayDate.toDate()
  );
  snapshot.ref.update({
    ...discountInfo,
    lastEditedAt: Timestamp.now()
  });

  return discountInfo;
};

export const updateNewPayDate = async (
  account: Account,
  newPayDate: Timestamp
) => {
  await admin.firestore().doc(accountDocPath(account.id)).update({
    newPayDate,
    lastEditedAt: Timestamp.now()
  });
};

export const updatePayDate = async (accountId: string, payDate: Timestamp) => {
  await admin.firestore().doc(accountDocPath(accountId)).update({
    payDate,
    lastEditedAt: Timestamp.now()
  });
};