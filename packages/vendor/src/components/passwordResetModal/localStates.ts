import { vendorAuthRepository } from 'pelp-repositories/src';
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { REACT_APP_SIGN_IN_URL } from 'src/utils/env';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

const authRepository = vendorAuthRepository(firebaseApp);

const keyName = (id: string) => `PasswordResetModal_${id}_vendor`;

const emailState = atom<string>({
  key: keyName('email'),
  default: ''
});
export const useEmailState = () => useRecoilState(emailState);

const emailPattern =
  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
const isValidEmailState = selector<boolean>({
  key: keyName('isValidEmail'),
  get: ({ get }) => {
    const email = get(emailState);
    if (email.length === 0) return true;
    return emailPattern.test(email);
  }
});
export const useIsValidEmailValue = () => useRecoilValue(isValidEmailState);

const messageState = atom<string>({
  key: keyName('message'),
  default: ''
});
export const useMessageValue = () => useRecoilValue(messageState);

const snackbarOpenState = atom<boolean>({
  key: keyName('snackbarOpen'),
  default: false
});
export const useSnackbarOpenState = () => useRecoilState(snackbarOpenState);

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingValue = () => useRecoilValue(loadingState);

export const useSendPassWordResetEmail = () =>
  useRecoilCallback(({ snapshot, set }) => async (callback: () => void) => {
    const email = await snapshot.getPromise(emailState);
    const isValidEmail = await snapshot.getPromise(isValidEmailState);
    const loadingWhenCalled = await snapshot.getPromise(loadingState);

    if (loadingWhenCalled || !isValidEmail || email.length === 0) {
      return;
    }

    set(loadingState, true);
    try {
      await authRepository.sendPasswordResetEmail(email, REACT_APP_SIGN_IN_URL);
    } catch (e) {
      console.error(e);
      set(snackbarOpenState, true);
      set(messageState, 'パスワード再設定リンクの送信に失敗しました');
      set(loadingState, false);
      return;
    }
    set(snackbarOpenState, true);
    set(messageState, 'パスワード再設定リンクをメールに送信しました');
    set(loadingState, false);

    callback();
  });