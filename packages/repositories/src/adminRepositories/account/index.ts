import { FirebaseApp } from '@firebase/app';
import { DocumentSnapshot, DocumentData } from 'firebase/firestore';

import { AccountStatus } from '../../types';

import * as Fetch from './fetch';

interface FetchAccountsArgs {
  status: AccountStatus;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}

export const adminAccountRepository = (app: FirebaseApp) => {
  const fetchAccounts = (
    args: FetchAccountsArgs
  ): Promise<Fetch.FetchAccountsRes> => {
    const { status, startAfter, limit } = args;
    return Fetch.fetchAccounts({ app, status, startAfter, limit });
  };

  return { fetchAccounts };
};