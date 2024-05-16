import { VendorUser, vendorUserRepository } from 'pelp-repositories/src';
import {
  atom,
  atomFamily,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { userDataState } from 'src/globalStates/authState';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

const userRepository = vendorUserRepository(firebaseApp);

const emailPattern =
  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

const keyName = (id: string) => `EditUders_${id}_vendor`;

// users

const usersState = atom<Array<VendorUser>>({
  key: keyName('users'),
  default: []
});
export const useUsersValue = () => useRecoilValue(usersState);

const initializedState = atom<boolean>({
  key: keyName('initialized'),
  default: false
});
export const useInitializedValue = () => useRecoilValue(initializedState);

export const useInitialize = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const initialized = await snapshot.getPromise(initializedState);
    if (initialized) return;

    set(initializedState, true);

    try {
      const userData = await snapshot.getPromise(userDataState);
      const { vendorUser } = userData;
      if (!vendorUser) return;
      const { vendorId } = vendorUser;

      const res = await userRepository.fetchVendorUsers({
        vendorId,
        limit: 251
      });
      const { users } = res;

      set(usersState, users);
    } catch (e) {
      console.error(e);
    }
  });

export const useDeleteUser = () =>
  useRecoilCallback(({ snapshot, set }) => async (deletedUser: VendorUser) => {
    const loading = await snapshot.getPromise(loadingState);
    if (loading) return;

    const userData = await snapshot.getPromise(userDataState);
    const { vendorUser } = userData;
    if (vendorUser.id === deletedUser.id) return; // cannot delete currect user
    if (!vendorUser) return;
    const { vendorId } = vendorUser;

    set(loadingState, true);
    try {
      await userRepository.deleteVendorUser({
        vendorId,
        authUserId: deletedUser.id
      });
    } catch (e) {
      console.error(e);
      set(loadingState, false);
      set(snackbarOpenState, true);
      set(snackbarContentState, 'アカウントの削除に失敗しました');
    }

    set(loadingState, false);
    set(snackbarOpenState, true);
    set(snackbarContentState, 'アカウントを削除しました');
    set(userDeleteModalOpenState(deletedUser.id), false);
    set(initializedState, false); // refetch users
  });

// added user

const addedUserEmailState = atom<string>({
  key: keyName('addedUserEmail'),
  default: ''
});
export const useAddedUserEmailState = () => useRecoilState(addedUserEmailState);

const isValidAddedUserEmailState = selector<boolean>({
  key: keyName('isValidAddedUserEmail'),
  get: ({ get }) => {
    const email = get(addedUserEmailState);
    return emailPattern.test(email);
  }
});
export const useIsValidAddedUserEmailValue = () =>
  useRecoilValue(isValidAddedUserEmailState);

const isAdminAddedUserState = atom<boolean>({
  key: keyName('isAdminAddedUser'),
  default: false
});
export const useIsAdminAddedUserState = () =>
  useRecoilState(isAdminAddedUserState);

export const useAddUser = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const loading = await snapshot.getPromise(loadingState);
    const isValidEmail = await snapshot.getPromise(isValidAddedUserEmailState);
    if (!isValidEmail || loading) return;

    const users = await snapshot.getPromise(usersState);
    if (users.length >= 250) {
      set(snackbarOpenState, true);
      set(snackbarContentState, '登録可能なアカウントは250個です');
      return;
    }

    const email = await snapshot.getPromise(addedUserEmailState);
    const isGroupAdmin = await snapshot.getPromise(isAdminAddedUserState);

    set(loadingState, true);
    try {
      await userRepository.createVendorUser({ email, isGroupAdmin });
    } catch (e) {
      console.error(e);
      set(loadingState, false);
      set(snackbarOpenState, true);
      set(snackbarContentState, 'アカウントの追加に失敗しました');
    }

    set(loadingState, false);
    set(snackbarOpenState, true);
    set(snackbarContentState, 'アカウントを追加しました');
    set(addedUserEmailState, '');
    set(initializedState, false); // refetch users
  });

// snackbar

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

// loading

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingValue = () => useRecoilValue(loadingState);

// modal

const userDeleteModalOpenState = atomFamily<boolean, string>({
  key: keyName('userDeleteModalOpen'),
  default: false
});
export const useUserDeleteModalOpenState = (userId: string) =>
  useRecoilState(userDeleteModalOpenState(userId));