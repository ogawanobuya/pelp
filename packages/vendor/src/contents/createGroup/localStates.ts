import {
  vendorAuthRepository,
  vendorUserRepository
} from 'pelp-repositories/src';
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { userDataState } from 'src/globalStates/authState';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

const authRepository = vendorAuthRepository(firebaseApp);
const userRepository = vendorUserRepository(firebaseApp);

const emailPattern =
  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

const keyName = (id: string) => `createGroup_${id}_vendor`;

// email of user logging in

const userEmailState = atom<string>({
  key: keyName('userEmail'),
  default: ''
});
export const useUserEmailState = () => useRecoilState(userEmailState);

const isValidUserEmailState = selector<boolean>({
  key: keyName('isValidUserEmail'),
  get: ({ get }) => {
    const email = get(userEmailState);
    return emailPattern.test(email);
  }
});
export const useIsValidUserEmailValue = () =>
  useRecoilValue(isValidUserEmailState);

// vendorName

const nameState = atom<string>({
  key: keyName('name'),
  default: ''
});
export const useNameState = () => useRecoilState(nameState);

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

// password reset modal

const modalOpenState = atom<boolean>({
  key: keyName('modalOpen'),
  default: false
});
export const useModalOpenState = () => useRecoilState(modalOpenState);

// submit

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingValue = () => useRecoilValue(loadingState);

const canCreateGroupState = selector<boolean>({
  key: keyName('canCreateGroup'),
  get: ({ get }) => {
    const isValidUserEmail = get(isValidUserEmailState);
    const name = get(nameState);

    if (!isValidUserEmail || name.length === 0) return false;
    return true;
  }
});
export const useCanCreateGroupValue = () => useRecoilValue(canCreateGroupState);

export const useCreateGroup = () =>
  useRecoilCallback(({ snapshot, set }) => async (callback: () => void) => {
    const loading = await snapshot.getPromise(loadingState);
    if (loading) return;

    const userEmail = await snapshot.getPromise(userEmailState);
    const isValidUserEmail = await snapshot.getPromise(isValidUserEmailState);
    const name = await snapshot.getPromise(nameState);

    if (!isValidUserEmail || name.length === 0) return;

    set(loadingState, true);
    try {
      const userCredential = await authRepository.signInWithEmailLink(
        userEmail
      );
      await userRepository.createVendorUserGroup({ name });

      const { user } = userCredential;
      const idTokenResult = await user.getIdTokenResult(true);
      const { vendorId } = idTokenResult.claims;
      if (typeof vendorId !== 'string') {
        throw Error('Custom claim vendorId is not defined.');
      }
      const vendorUser = await userRepository.fetchVendorUser({
        vendorId,
        authUserId: user.uid
      });
      set(userDataState, { user, vendorUser });
    } catch (e) {
      console.error(e);
      set(snackbarContentState, 'グループの追加に失敗しました');
      set(snackbarOpenState, true);
      set(loadingState, false);
      return;
    }

    set(loadingState, false);
    callback();
  });