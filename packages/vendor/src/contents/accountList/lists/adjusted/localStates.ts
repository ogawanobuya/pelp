import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { Account } from 'pelp-repositories/src';
import {
  atom,
  RecoilState,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { accountRepositoryState } from 'src/globalStates/repositories';

const keyName = (id: string) => `AdjustedAccountList_${id}_enterprise`;

export const rowsPerPage = 25;

// var
// account本体

const pageState = atom<number>({
  key: keyName('page'),
  default: 0
});
export const usePageState = () => useRecoilState(pageState);

const accountsState = atom<Array<Account>>({
  key: keyName('accounts'),
  default: []
});

const docSnapsState = atom<Array<DocumentSnapshot<DocumentData>>>({
  key: keyName('docSnaps'),
  default: []
});

const lastPageState = atom<number>({
  key: keyName('lastPage'),
  default: 0
});
export const useLastPageValue = () => useRecoilValue(lastPageState);

const allFetchedState = atom<boolean>({
  key: keyName('allFetched'),
  default: false
});

const initializedState = atom<boolean>({
  key: keyName('initialized'),
  default: false
});
export const useInitializedValue = () => useRecoilValue(initializedState);

// ui関連

const showedAccountsState = selector<Array<Account>>({
  key: keyName('showedAccounts'),
  get: ({ get }) => {
    const accounts = get(accountsState);
    const page = get(pageState);
    const end =
      accounts.length > page * (rowsPerPage + 1)
        ? accounts.length
        : page * (rowsPerPage + 1);
    return accounts.slice(page * rowsPerPage, end);
  }
});
export const useShowedAccountsValue = () => useRecoilValue(showedAccountsState);

const isOpenConfirmModalState = atom<boolean>({
  key: keyName('isOpenConfirmModal'),
  default: false
});
export const useIsOpenConfirmModalState = () =>
  useRecoilState(isOpenConfirmModalState);

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

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingState = () => useRecoilState(loadingState);

// method

export const useInitialize = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const initialized = await snapshot.getPromise(initializedState);
    if (initialized) return;

    set(initializedState, true);

    const accountRepository = await snapshot.getPromise(accountRepositoryState);

    try {
      // 1ページ目
      const res1 = await accountRepository.fetchAccountsByStatus({
        status: 'adjusted',
        limit: rowsPerPage
      });

      if (res1.fetched === 0) {
        set(allFetchedState, true);
        set(lastPageState, 0);
        return;
      }

      if (res1.fetched < rowsPerPage) {
        set(accountsState, res1.accounts);
        set(docSnapsState, res1.snapshots);
        set(allFetchedState, true);
        set(lastPageState, 0);
        return;
      }

      // 2ページ目
      const res2 = await accountRepository.fetchAccountsByStatus({
        status: 'adjusted',
        limit: rowsPerPage,
        startAfter: res1.snapshots[res1.snapshots.length - 1]
      });
      set(accountsState, [...res1.accounts, ...res2.accounts]);
      set(docSnapsState, [...res1.snapshots, ...res2.snapshots]);
      set(lastPageState, 1);

      if (res2.fetched < rowsPerPage) {
        set(allFetchedState, true);
        return;
      }
      set(allFetchedState, false);
    } catch (e) {
      console.log(e);
    }
  });

export const useFetchNextPage = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const allFetched = await snapshot.getPromise(allFetchedState);
    if (allFetched) return;

    const accountRepository = await snapshot.getPromise(accountRepositoryState);

    const accounts = await snapshot.getPromise(accountsState);
    const docSnaps = await snapshot.getPromise(docSnapsState);
    const lastPage = await snapshot.getPromise(lastPageState);
    try {
      const res = await accountRepository.fetchAccountsByStatus({
        status: 'adjusted',
        limit: rowsPerPage,
        startAfter: docSnaps[docSnaps.length - 1]
      });
      if (res.fetched === 0) {
        // 前のページが上限ピッタリの場合
        // lastPageStateも増やさない
        set(allFetchedState, true);
        return;
      }
      set(accountsState, [...accounts, ...res.accounts]);
      set(docSnapsState, [...docSnaps, ...res.snapshots]);
      set(lastPageState, lastPage + 1);
      if (res.fetched < rowsPerPage) {
        set(allFetchedState, true);
        return;
      }
      set(allFetchedState, false);
    } catch (e) {
      console.log(e);
    }
  });

export const useConfirmAccount = () =>
  useRecoilCallback(({ snapshot, set, reset }) => async (account: Account) => {
    const loading = await snapshot.getPromise(loadingState);
    if (loading) return;

    const accountRepository = await snapshot.getPromise(accountRepositoryState);

    set(loadingState, true);
    try {
      await accountRepository.confirmAccount(account.id);
    } catch (e) {
      console.error(e);
      set(loadingState, false);
      set(snackbarOpenState, true);
      set(snackbarContentState, '支払い確認済みに設定することに失敗しました');
      return;
    }
    set(loadingState, false);
    set(snackbarOpenState, true);
    set(snackbarContentState, '支払い確認が完了しました');

    set(isOpenConfirmModalState, false);

    // 請求書再取得
    clearAccounts(reset);
  });

const clearAccounts = (reset: (recoilVal: RecoilState<any>) => void) => {
  reset(pageState);
  reset(accountsState);
  reset(docSnapsState);
  reset(allFetchedState);
  reset(lastPageState);
  reset(initializedState);
};
export const useReload = () =>
  useRecoilCallback(({ reset }) => () => {
    clearAccounts(reset);
  });