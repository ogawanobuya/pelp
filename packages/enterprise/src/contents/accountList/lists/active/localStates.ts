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
import { userDataState } from 'src/globalStates/authState';
import { accountRepositoryState } from 'src/globalStates/repositories';

const keyName = (id: string) => `ActiveAccountList_${id}_enterprise`;

export const rowsPerPage = 25;

// isGroupAdmin

const isGroupAdminState = selector<boolean>({
  key: keyName('isGroupAdmin'),
  get: ({ get }) => {
    const userData = get(userDataState);
    const { enterpriseUser } = userData;
    if (!enterpriseUser) return false;
    return enterpriseUser.isGroupAdmin;
  }
});
export const useIsGroupAdminValue = () => useRecoilValue(isGroupAdminState);

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

const checkedState = atom<Array<boolean>>({
  key: keyName('checked'),
  default: []
});
export const useCheckedValue = () => useRecoilValue(checkedState);

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

const isOpenAdjustModalState = atom<boolean>({
  key: keyName('isOpenAdjustModal'),
  default: false
});
export const useIsOpenAdjustModalState = () =>
  useRecoilState(isOpenAdjustModalState);

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
        status: 'active',
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
        set(
          checkedState,
          Array<boolean>(res1.accounts.length).fill(
            false,
            0,
            res1.accounts.length
          )
        );
        set(allFetchedState, true);
        set(lastPageState, 0);
        return;
      }

      // 2ページ目
      const res2 = await accountRepository.fetchAccountsByStatus({
        status: 'active',
        limit: rowsPerPage,
        startAfter: res1.snapshots[res1.snapshots.length - 1]
      });
      set(accountsState, [...res1.accounts, ...res2.accounts]);
      set(docSnapsState, [...res1.snapshots, ...res2.snapshots]);
      set(
        checkedState,
        Array(res1.accounts.length + res2.accounts.length).fill(
          false,
          0,
          res1.accounts.length + res2.accounts.length
        )
      );
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
    const checked = await snapshot.getPromise(checkedState);
    const lastPage = await snapshot.getPromise(lastPageState);
    try {
      const res = await accountRepository.fetchAccountsByStatus({
        status: 'active',
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
      set(checkedState, [
        ...checked,
        Array(res.accounts.length).fill(false, 0, res.accounts.length)
      ]);
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

export const useUpdateChecked = () =>
  useRecoilCallback(
    ({ snapshot, set }) =>
      async (index: number, c: boolean) => {
        const checked = await snapshot.getPromise(checkedState);
        if (checked.length === 0 || index < 0 || checked.length <= index)
          return;

        if (checked.length === 1) {
          set(checkedState, [c]);
          return;
        }

        if (index === 0) {
          set(checkedState, [c, ...checked.slice(1, checked.length)]);
          return;
        }

        if (index === checked.length - 1) {
          set(checkedState, [...checked.slice(0, checked.length - 1), c]);
          return;
        }

        set(checkedState, [
          ...checked.slice(0, index),
          c,
          ...checked.slice(index + 1, checked.length)
        ]);
      }
  );

export const useAdjustAccounts = () =>
  useRecoilCallback(({ snapshot, set, reset }) => async () => {
    const loading = await snapshot.getPromise(loadingState);
    if (loading) return;

    const accountRepository = await snapshot.getPromise(accountRepositoryState);

    const accounts = await snapshot.getPromise(accountsState);
    const checked = await snapshot.getPromise(checkedState);

    const checkedAccountIds = accounts
      .filter((account, i) => checked[i])
      .map((account) => account.id);

    set(loadingState, true);
    try {
      await accountRepository.adjustAccounts(checkedAccountIds);
    } catch (e) {
      console.error(e);
      set(loadingState, false);
      set(snackbarOpenState, true);
      set(snackbarContentState, 'オファーの受諾に失敗しました');
      return;
    }
    set(loadingState, false);
    set(snackbarOpenState, true);
    set(snackbarContentState, 'オファーを受諾しました');

    set(isOpenAdjustModalState, false);

    // 請求書再取得
    clearAccounts(reset);
  });

const clearAccounts = (reset: (recoilVal: RecoilState<any>) => void) => {
  reset(pageState);
  reset(accountsState);
  reset(docSnapsState);
  reset(allFetchedState);
  reset(lastPageState);
  reset(checkedState);
  reset(initializedState);
};
export const useReload = () =>
  useRecoilCallback(({ reset }) => () => {
    clearAccounts(reset);
  });