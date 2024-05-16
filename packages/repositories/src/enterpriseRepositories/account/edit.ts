import { FirebaseApp } from '@firebase/app';
import { Timestamp } from 'firebase/firestore';

import {
  runTransaction,
  setBatch,
  SetBatchItem,
  updateBatch
} from '../../helpers/firestoreHelper';
import { accountDocRef, accountindexDocRef } from '../../refs';
import { AccountIndex } from '../../types';
import { Account, AccountCurrency, castToAccount } from '../../types/account';
import { getAccountsFromCsvString } from '../../types/account/fromCsvString';
import { EnterpriseUser } from '../../types/enterpriseUser';
import { generateAccountIndex } from '../../utils/accountIndex';
import { generateBiGramObject } from '../../utils/biGram';
import { randomString } from '../../utils/randomString';
import { generateAccountStatusNumber } from '../../utils/statusNumber';

export interface NewAccount {
  vendorName: string;
  vendorEmail: string;
  amount: number;
  currency: AccountCurrency;
  originalDueDate: Timestamp;
  newPayDate: Timestamp;
  userConfiguredId?: string;
}
interface AddAccountsArgs {
  app: FirebaseApp;
  user: EnterpriseUser;
  newAccounts: Array<NewAccount>;
}
export const addAccounts = async (args: AddAccountsArgs) => {
  const { app, user, newAccounts } = args;

  const accounts = newAccounts
    .map((newAccount) => {
      const id = randomString();
      const index = generateAccountIndex({
        enterpriseId: user.enterpriseId,
        vendorEmail: newAccount.vendorEmail,
        amount: newAccount.amount,
        originalDueDate: newAccount.originalDueDate,
        userConfiguredId: newAccount.userConfiguredId
      });
      const account: Account = {
        id,
        enterpriseId: user.enterpriseId,
        enterpriseName: user.enterpriseName,
        enterpriseEmails: user.enterpriseEmails,
        vendorEmail: newAccount.vendorEmail,
        amount: newAccount.amount,
        originalDueDate: newAccount.originalDueDate,
        newPayDate: newAccount.newPayDate,
        payDate: newAccount.originalDueDate,
        userConfiguredId: newAccount.userConfiguredId,
        status: 'inactive',
        statusNumber: generateAccountStatusNumber('inactive'),
        searchMap: generateBiGramObject(
          [
            user.enterpriseName,
            ...user.enterpriseEmails,
            newAccount.vendorName,
            newAccount.vendorEmail
          ],
          [
            newAccount.amount.toString(),
            id,
            user.enterpriseId,
            newAccount.userConfiguredId ?? ''
          ]
        ),
        index,
        createdAt: Timestamp.now(),
        lastEditedAt: Timestamp.now(),
        vendorName: newAccount.vendorName,
        currency: newAccount.currency
      };
      return account;
    })
    .filter((item) => item != null) as Array<Account>;

  await Promise.all(
    accounts.map<Promise<void>>((account) => setAccount(app, account, user))
  );
};

interface AddAccountsFromCsvArgs {
  app: FirebaseApp;
  user: EnterpriseUser;
  newAccountsCsvAsString: string;
  skipFirstRow?: boolean;
  dateFormat?: string;
}
export interface AddAccountsFromCsvRes {
  errorMessages: Array<string>;
  warningMessages: Array<string>;
  result: boolean;
}
export const addAccountsFromCsv = async (
  args: AddAccountsFromCsvArgs
): Promise<AddAccountsFromCsvRes> => {
  const { app, user, newAccountsCsvAsString, skipFirstRow, dateFormat } = args;
  const r = await getAccountsFromCsvString({
    app,
    csvStr: newAccountsCsvAsString,
    user,
    skipFirstRow,
    dateFormat
  });

  await Promise.all(
    r.accounts.map<Promise<void>>((account) => setAccount(app, account, user))
  );

  return {
    errorMessages: r.errorMessages,
    warningMessages: r.warningMessages,
    result: true
  };
};

const setAccount = async (
  app: FirebaseApp,
  account: Account,
  user: EnterpriseUser
) => {
  const accountBatchItem: SetBatchItem<Account> = {
    doc: accountDocRef(app, account.id),
    data: account
  };
  const accountIndexBatchItem: SetBatchItem<AccountIndex> = {
    doc: accountindexDocRef(app, user.enterpriseId, account.index),
    data: {
      id: account.index,
      accountId: account.id,
      enterpriseId: user.enterpriseId,
      createdAt: account.createdAt,
      lastEditedAt: account.lastEditedAt
    }
  };
  await setBatch<Account | AccountIndex>(app, [
    accountBatchItem,
    accountIndexBatchItem
  ]);
};

interface EditAccountArgs {
  app: FirebaseApp;
  user: EnterpriseUser;
  accountId: string;
  editedAccount: NewAccount;
}
export const editAccount = async (args: EditAccountArgs) => {
  const { app, user, accountId, editedAccount } = args;
  await deleteAccount({ app, accountId });
  await addAccounts({ app, user, newAccounts: [editedAccount] });
};

interface DeleteAccountArgs {
  app: FirebaseApp;
  accountId: string;
}
export const deleteAccount = async (args: DeleteAccountArgs) => {
  const { app, accountId } = args;
  await runTransaction(app, async (transaction) => {
    const accountDoc = accountDocRef(app, accountId);
    const accountDocSnap = await transaction.get(accountDoc);
    if (!accountDocSnap.exists())
      throw Error('Account document does not exist.');
    const account = castToAccount(accountDocSnap.data());
    if (account == null) throw Error('Account data is invalid.');
    transaction.delete(accountDoc);
    const accountIndexDoc = accountindexDocRef(
      app,
      account.enterpriseId,
      account.index
    );
    transaction.delete(accountIndexDoc);
  });
};

interface AdjustAccountsArgs {
  app: FirebaseApp;
  accountIds: Array<string>;
}
export const adjustAccounts = async (args: AdjustAccountsArgs) => {
  const { app, accountIds } = args;
  const batchItems = accountIds.map((accountId) => {
    return {
      doc: accountDocRef(app, accountId),
      data: {
        status: 'adjusted',
        adjustedAt: Timestamp.now(),
        lastEditedAt: Timestamp.now()
      }
    };
  });
  await updateBatch(app, batchItems);
};

interface SetAsPaidAccountsArgs {
  app: FirebaseApp;
  accountIds: Array<string>;
}
export const setAsPaidAccounts = async (args: SetAsPaidAccountsArgs) => {
  const { app, accountIds } = args;
  const batchItems = accountIds.map((accountId) => {
    return {
      doc: accountDocRef(app, accountId),
      data: {
        status: 'paid',
        paidAt: Timestamp.now(),
        lastEditedAt: Timestamp.now()
      }
    };
  });
  await updateBatch(app, batchItems);
};