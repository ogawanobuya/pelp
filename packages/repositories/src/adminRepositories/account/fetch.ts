import { FirebaseApp } from '@firebase/app';
import {
  DocumentData,
  DocumentSnapshot,
  limitToLast,
  QueryConstraint,
  QueryDocumentSnapshot,
  orderBy as _orderBy,
  startAfter as _startAfter,
  where
} from 'firebase/firestore';

import { fetchDocs } from '../../helpers/firestoreHelper';
import { accountsCollectionRef } from '../../refs';
import {
  Account,
  AccountSortCriteria,
  AccountStatus,
  castToAccount
} from '../../types';

interface FetchAccountsArgs {
  app: FirebaseApp;
  status: AccountStatus;
  orderBy?: AccountSortCriteria;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}
export interface FetchAccountsRes {
  limit: number;
  fetched: number;
  valid: number;
  invalid: number;
  accounts: Array<Account>;
  snapshots: Array<QueryDocumentSnapshot<DocumentData>>;
}
export const fetchAccounts = async (
  args: FetchAccountsArgs
): Promise<FetchAccountsRes> => {
  const { app, status, startAfter, orderBy = 'newPayDate', limit = 25 } = args;
  const querySnap = await fetchDocs(
    accountsCollectionRef(app),
    [
      where('status', '==', status),
      _orderBy(orderBy),
      startAfter ? _startAfter(startAfter) : null,
      limitToLast(limit)
    ].filter((c) => c) as Array<QueryConstraint> // remove falsy
  );
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