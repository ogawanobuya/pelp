import { FirebaseApp } from '@firebase/app';
import {
  DocumentData,
  DocumentSnapshot,
  limitToLast,
  QueryConstraint,
  startAfter as _startAfter,
  orderBy as _orderBy,
  where,
  QueryDocumentSnapshot
} from 'firebase/firestore';

import { fetchDocs } from '../../helpers/firestoreHelper';
import { accountsCollectionRef } from '../../refs';
import {
  Account,
  AccountSortCriteria,
  AccountStatus,
  castToAccount,
  VendorUser
} from '../../types';

interface FetchAccountsByStatusArgs {
  app: FirebaseApp;
  user: VendorUser;
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
      where('vendorEmail', 'in', user.vendorEmails),
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