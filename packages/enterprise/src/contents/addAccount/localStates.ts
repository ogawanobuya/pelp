import { Timestamp } from 'firebase/firestore';
import { AccountCurrency, castToAccountCurrency } from 'pelp-repositories/src';
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { accountRepositoryState } from 'src/globalStates/repositories';

const keyName = (id: string) => `AddAccountContent_${id}_enterprise`;

export const currencies = ['jpy', 'usd', 'eur'];

const vendorNameState = atom<string>({
  key: keyName('vendorName'),
  default: ''
});
export const useVendorNameState = () => useRecoilState(vendorNameState);

const vendorEmailState = atom<string>({
  key: keyName('vendorEmail'),
  default: ''
});
export const useVendorEmailState = () => useRecoilState(vendorEmailState);

const emailPattern =
  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
const isValidVendorEmailState = selector<boolean>({
  key: keyName('isValidVendorEmail'),
  get: ({ get }) => {
    const email = get(vendorEmailState);
    if (email.length === 0) return true;
    return emailPattern.test(email);
  }
});
export const useIsValidVendorEmailValue = () =>
  useRecoilValue(isValidVendorEmailState);

const amountState = atom<number>({
  key: keyName('amount'),
  default: 10000
});
export const useAmountState = () => useRecoilState(amountState);

const currencyState = atom<AccountCurrency>({
  key: keyName('currency'),
  default: 'jpy'
});
export const useCurrencyValue = () => useRecoilValue(currencyState);

const originalDueDateState = atom<Date>({
  key: keyName('originalDueDate'),
  default: new Date()
});
export const useOriginalDueDateState = () =>
  useRecoilState(originalDueDateState);

const newPayDateState = atom<Date>({
  key: keyName('newPayDate'),
  default: new Date()
});
export const useNewPayDateState = () => useRecoilState(newPayDateState);

const userConfiguredIdState = atom<string>({
  key: keyName('userConfiguredId'),
  default: ''
});
export const useUserConfiguredIdState = () =>
  useRecoilState(userConfiguredIdState);

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingValue = () => useRecoilValue(loadingState);

const isValidState = selector<boolean>({
  key: keyName('isValid'),
  get: ({ get }) => {
    const vendorName = get(vendorNameState);
    const isValidVendorEmail = get(isValidVendorEmailState);
    const amount = get(amountState);
    const originalDueDate = get(originalDueDateState);
    const newPayDate = get(newPayDateState);

    return (
      // vendorNameを設定する
      vendorName.length !== 0 &&
      isValidVendorEmail &&
      // 価格が設定されている
      amount > 0 &&
      // 過去の請求書はactiveにしない
      originalDueDate > new Date() &&
      newPayDate > new Date() &&
      // 早払い日は元の支払日より前
      newPayDate < originalDueDate
    );
  }
});
export const useIsValidValue = () => useRecoilValue(isValidState);

const snackbarContentState = atom<string>({
  key: keyName('snackbarContent'),
  default: ''
});
export const useSnackbarContentValue = () =>
  useRecoilValue(snackbarContentState);

const snackbarOpenState = atom<boolean>({
  key: keyName('snackbarOpen'),
  default: false
});
export const useSnackbarOpenState = () => useRecoilState(snackbarOpenState);

export const useOnChangeCurrency = () =>
  useRecoilCallback(
    ({ set }) =>
      async (currency: string) => {
        const c = castToAccountCurrency(currency);
        if (!c) return;
        set(currencyState, c);
      },
    []
  );

export const useAddAccount = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const accountRepository = await snapshot.getPromise(accountRepositoryState);

    const vendorName = await snapshot.getPromise(vendorNameState);
    const vendorEmail = await snapshot.getPromise(vendorEmailState);
    const currency = await snapshot.getPromise(currencyState);
    const amount = await snapshot.getPromise(amountState);
    const originalDueDate = Timestamp.fromDate(
      await snapshot.getPromise(originalDueDateState)
    );
    const newPayDate = Timestamp.fromDate(
      await snapshot.getPromise(newPayDateState)
    );
    const userConfiguredId = await snapshot.getPromise(userConfiguredIdState);

    if (!(await snapshot.getPromise(isValidState))) return;

    set(loadingState, true);
    try {
      await accountRepository.addAccounts([
        {
          vendorName,
          vendorEmail,
          amount,
          currency,
          originalDueDate,
          newPayDate,
          userConfiguredId
        }
      ]);
    } catch (e) {
      console.log(e);
      set(loadingState, false);
      set(snackbarOpenState, true);
      set(snackbarContentState, '請求書の登録に失敗しました');
      return;
    }
    set(loadingState, false);
    set(snackbarOpenState, true);
    set(snackbarContentState, '請求書を登録しました');

    // フォームを初期化
    set(vendorNameState, '');
    set(vendorEmailState, '');
    set(currencyState, 'jpy');
    set(amountState, 10000);
    set(originalDueDateState, new Date());
    set(newPayDateState, new Date());
    set(userConfiguredIdState, '');
  });