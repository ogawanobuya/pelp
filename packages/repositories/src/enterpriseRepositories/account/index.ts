import { FirebaseApp } from '@firebase/app';
import { DocumentSnapshot, DocumentData } from 'firebase/firestore';

import {
  AccountStatus,
  EnterpriseUser,
  AccountSortCriteria
} from '../../types';

import * as Edit from './edit';
import * as Fetch from './fetch';

interface FetchAccountsByStatusArgs {
  status: AccountStatus;
  orderBy?: AccountSortCriteria;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}
interface FetchAccountsToBePaidArgs {
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}
interface AddAccountsFromCsvArgs {
  user: EnterpriseUser;
  newAccountsCsvAsString: string;
  skipFirstRow?: boolean;
  dateFormat?: string;
}

export const enterpriseAccountRepository = (
  app: FirebaseApp,
  user: EnterpriseUser
) => {
  const addAccounts = (newAccounts: Array<Edit.NewAccount>) =>
    Edit.addAccounts({ app, user, newAccounts });
  const addAccountsFromCsv = (
    args: AddAccountsFromCsvArgs
  ): Promise<Edit.AddAccountsFromCsvRes> =>
    Edit.addAccountsFromCsv({ app, ...args });
  const editAccount = (accountId: string, editedAccount: Edit.NewAccount) =>
    Edit.editAccount({ app, user, accountId, editedAccount });
  const deleteAccount = (accountId: string) =>
    Edit.deleteAccount({ app, accountId });
  const adjustAccounts = (accountIds: Array<string>) =>
    Edit.adjustAccounts({ app, accountIds });
  const setAsPaidAccounts = (accountIds: Array<string>) =>
    Edit.setAsPaidAccounts({ app, accountIds });
  const fetchAccountsByStatus = (
    args: FetchAccountsByStatusArgs
  ): Promise<Fetch.FetchAccountsRes> =>
    Fetch.fetchAccountsByStatus({
      app,
      user,
      ...args
    });
  const fetchAccountsToBePaid = (args: FetchAccountsToBePaidArgs) =>
    Fetch.fetchAccountsToBePaid({
      app,
      user,
      ...args
    });

  return {
    addAccounts,
    addAccountsFromCsv,
    editAccount,
    deleteAccount,
    adjustAccounts,
    setAsPaidAccounts,
    fetchAccountsByStatus,
    fetchAccountsToBePaid
  };
};