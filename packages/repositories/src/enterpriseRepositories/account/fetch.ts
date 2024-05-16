import { FirebaseApp } from '@firebase/app';
import { subDays } from 'date-fns';
import {
  DocumentData,
  DocumentSnapshot,
  limitToLast,
  QueryConstraint,
  startAfter as _startAfter,
  orderBy as _orderBy,
  where,
  QueryDocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';

import { fetchDocs } from '../../helpers/firestoreHelper';
import { accountsCollectionRef } from '../../refs';
import {
  Account,
  AccountSortCriteria,
  AccountStatus,
  castToAccount,
  EnterpriseUser
} from '../../types';

export interface FetchAccountsRes {
  limit: number;
  fetched: number;
  valid: number;
  invalid: number;
  accounts: Array<Account>;
  snapshots: Array<QueryDocumentSnapshot<DocumentData>>;
}

const convertQuerySnapshotToRes = (
  querySnap: QuerySnapshot<DocumentData>,
  limit: number
): FetchAccountsRes => {
  const { docs } = querySnap;
  const accounts = docs
    .map((doc) => castToAccount(doc.data()))
    .filter((account) => account) as Array<Account>; // remove falsy
  return {
    limit,
    fetched: docs.length,
    valid: accounts.length,
    invalid: docs.length - accounts.length,
    accounts,
    snapshots: JSON.parse(JSON.stringify(docs))
  };
};

interface FetchAccountsByStatusArgs {
  app: FirebaseApp;
  user: EnterpriseUser;
  status: AccountStatus;
  orderBy?: AccountSortCriteria;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}
export const fetchAccountsByStatus = async (
  args: FetchAccountsByStatusArgs
): Promise<FetchAccountsRes> => {
  const {
    app,
    user,
    status,
    startAfter,
    orderBy = 'newPayDate',
    limit = 25
  } = args;
  const querySnap = await fetchDocs(
    accountsCollectionRef(app),
    [
      where('enterpriseId', '==', user.enterpriseId),
      where('status', '==', status),
      _orderBy(orderBy),
      startAfter ? _startAfter(startAfter) : null,
      limitToLast(limit)
    ].filter((c) => c) as Array<QueryConstraint> // remove falsy
  );
  return convertQuerySnapshotToRes(querySnap, limit);
};

interface FetchAccountsByPayDateArgs {
  app: FirebaseApp;
  user: EnterpriseUser;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}
export const fetchAccountsToBePaid = async (
  args: FetchAccountsByPayDateArgs
): Promise<FetchAccountsRes> => {
  const { app, user, startAfter, limit = 25 } = args;
  const querySnap = await fetchDocs(
    accountsCollectionRef(app),
    [
      where('enterpriseId', '==', user.enterpriseId),
      // payDate が前日より後（当日以降）
      where('payDate', '>=', subDays(new Date(), 1)),
      _orderBy('payDate'),
      startAfter ? _startAfter(startAfter) : null,
      limitToLast(limit)
    ].filter((c) => c) as Array<QueryConstraint> // remove falsy
  );
  return convertQuerySnapshotToRes(querySnap, limit);
};