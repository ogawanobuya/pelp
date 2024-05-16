import { FirebaseApp } from '@firebase/app';
import { DocumentSnapshot, DocumentData } from 'firebase/firestore';

import { AccountSortCriteria, AccountStatus, VendorUser } from '../../types';

import * as Edit from './edit';
import * as Fetch from './fetch';

interface FetchAccountsArgs {
  status: AccountStatus;
  orderBy?: AccountSortCriteria;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}

export const vendorAccountRepository = (app: FirebaseApp, user: VendorUser) => {
  const activateAccount = (accountId: string) =>
    Edit.activateAccount({ app, accountId, vendorId: user.vendorId });
  const confirmAccount = (accountId: string) =>
    Edit.confirmAccount({ app, accountId });
  const fetchAccountsByStatus = (
    args: FetchAccountsArgs
  ): Promise<Fetch.FetchAccountsRes> => {
    const { status, startAfter, limit } = args;
    return Fetch.fetchAccountsByStatus({
      app,
      user,
      status,
      startAfter,
      limit
    });
  };

  return {
    activateAccount,
    confirmAccount,
    fetchAccountsByStatus
  };
};