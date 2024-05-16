import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { userDataState } from 'src/globalStates/authState';
import { accountRepositoryState } from 'src/globalStates/repositories';

const keyName = (id: string) => `ImportCsv_${id}_enterprise`;

export const dateFormats = ['yyyy/MM/dd', 'yyyyMMdd', 'yyyy-MM-dd'] as const;
export type DateFormat = typeof dateFormats[number];

const skipFirstRowState = atom<boolean>({
  key: keyName('skipFirstRow'),
  default: false
});
export const useSkipFirstRowState = () => useRecoilState(skipFirstRowState);

const dateFormatState = atom<DateFormat>({
  key: keyName('dateFormat'),
  default: 'yyyy/MM/dd'
});
export const useDateFormatState = () => useRecoilState(dateFormatState);

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingValue = () => useRecoilValue(loadingState);

const errorMessagesState = atom<Array<string>>({
  key: keyName('errorMessages'),
  default: []
});
export const useErrorMessagesValue = () => useRecoilValue(errorMessagesState);

const warningMessagesState = atom<Array<string>>({
  key: keyName('warningMessages'),
  default: []
});
export const useWarningMessagesValue = () =>
  useRecoilValue(warningMessagesState);

const snackbarOpenState = atom<boolean>({
  key: keyName('snackbarOpen'),
  default: false
});
export const useSnackbarOpenState = () => useRecoilState(snackbarOpenState);

const snackbarContentState = atom<string>({
  key: keyName('snackbarContent'),
  default: ''
});
export const useSnackbarContentValue = () =>
  useRecoilValue(snackbarContentState);

export const useHandleCsv = () =>
  useRecoilCallback(({ snapshot, set }) => async (csvAsString: string) => {
    const userData = await snapshot.getPromise(userDataState);
    const { enterpriseUser } = userData;
    if (!enterpriseUser) return;

    const accountRepository = await snapshot.getPromise(accountRepositoryState);

    const skipFirstRow = await snapshot.getPromise(skipFirstRowState);
    const dateFormat = await snapshot.getPromise(dateFormatState);

    set(loadingState, true);
    try {
      const res = await accountRepository.addAccountsFromCsv({
        user: enterpriseUser,
        newAccountsCsvAsString: csvAsString,
        skipFirstRow,
        dateFormat
      });
      set(errorMessagesState, res.errorMessages);
      set(warningMessagesState, res.warningMessages);
      if (!res.result) {
        set(loadingState, false);
        set(snackbarOpenState, true);
        set(snackbarContentState, '請求書の登録に失敗しました');
        return;
      }
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
  });