import { Timestamp } from 'firebase/firestore';
import { Account } from 'pelp-repositories/src';
import {
  atomFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { accountRepositoryState } from 'src/globalStates/repositories';

const keyName = (id: string) => `AccountEditModal_${id}_enterprise`;

const originalDueDateState = atomFamily<Date, string>({
  key: keyName('originalDueDate'),
  default: new Date()
});
export const useOriginalDueDateState = (accountId: string) =>
  useRecoilState(originalDueDateState(accountId));

const newPayDateState = atomFamily<Date, string>({
  key: keyName('newPayDate'),
  default: new Date()
});
export const useNewPayDateState = (accountId: string) =>
  useRecoilState(newPayDateState(accountId));

const loadingState = atomFamily<boolean, string>({
  key: keyName('loading'),
  default: false
});
export const useLoadingValue = (accountId: string) =>
  useRecoilValue(loadingState(accountId));

const initializedState = atomFamily<boolean, string>({
  key: keyName('initialized'),
  default: false
});
export const useInitializedState = (accountId: string) =>
  useRecoilState(initializedState(accountId));

export const useInitialize = () =>
  useRecoilCallback(({ snapshot, set }) => async (account: Account) => {
    const initialized = await snapshot.getPromise(initializedState(account.id));
    if (initialized) return;

    set(originalDueDateState(account.id), account.originalDueDate.toDate());
    set(newPayDateState(account.id), account.newPayDate.toDate());
    set(initializedState(account.id), true);
  });

interface EditAccountArgs {
  account: Account;
  callback: () => void;
}
export const useEditAccount = () =>
  useRecoilCallback(({ snapshot, set }) => async (args: EditAccountArgs) => {
    const { account, callback } = args;

    const loading = await snapshot.getPromise(loadingState(account.id));
    if (loading) return;

    const accountRepository = await snapshot.getPromise(accountRepositoryState);

    const originalDueDate = await snapshot.getPromise(
      originalDueDateState(account.id)
    );
    const newPayDate = await snapshot.getPromise(newPayDateState(account.id));

    set(loadingState(account.id), true);
    try {
      await accountRepository.editAccount(account.id, {
        vendorName: account.vendorName,
        vendorEmail: account.vendorEmail,
        amount: account.amount,
        currency: account.currency,
        originalDueDate: Timestamp.fromDate(originalDueDate),
        newPayDate: Timestamp.fromDate(newPayDate),
        userConfiguredId: account.userConfiguredId
      });
    } catch (e) {
      console.error(e);
      set(loadingState(account.id), false);
      return;
    }
    set(loadingState(account.id), false);

    callback();
  });