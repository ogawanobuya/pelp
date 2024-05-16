import { enterpriseAuthRepository } from 'pelp-repositories/src';
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { REACT_APP_SIGN_IN_URL } from 'src/utils/env';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';
import { authErrorMessage } from 'src/utils/functions/authErrorMessage';

const authRepository = enterpriseAuthRepository(firebaseApp);

const keyName = (id: string) => `signIn_${id}_enterprise`;

// global var

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

const passwordState = atom<string>({
  key: keyName('password'),
  default: ''
});
export const usePasswordState = () => useRecoilState(passwordState);

const messageState = atom<string>({
  key: keyName('message'),
  default: ''
});
export const useMessageValue = () => useRecoilValue(messageState);

const snackbarOpenedState = atom<boolean>({
  key: keyName('snackbarOpened'),
  default: false
});
export const useSnackbarOpenedState = () => useRecoilState(snackbarOpenedState);

const modalOpenState = atom<boolean>({
  key: keyName('modalOpen'),
  default: false
});
export const useModalOpenState = () => useRecoilState(modalOpenState);

const errorMessageState = atom<string>({
  key: keyName('errorMessage'),
  default: ''
});
export const useErrorMessageValue = () => useRecoilValue(errorMessageState);

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingState = () => useRecoilState(loadingState);

// method

export const useSignIn = () =>
  useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const email = await snapshot.getPromise(emailState);
        const password = await snapshot.getPromise(passwordState);
        const isValidEmail = await snapshot.getPromise(isValidEmailState);
        const loadingWhenCalled = await snapshot.getPromise(loadingState);

        if (
          loadingWhenCalled ||
          !isValidEmail ||
          password.length === 0 ||
          email.length === 0
        ) {
          return;
        }

        set(errorMessageState, '');
        set(loadingState, true);
        try {
          await authRepository.signInWithEmailAndPassword(email, password);
        } catch (e) {
          console.error(e);
          set(snackbarOpenedState, true);
          set(messageState, 'ログインに失敗しました');
          set(errorMessageState, authErrorMessage(e));
        }
        set(loadingState, false);
      },
    []
  );

export const useSendPassWordResetEmail = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
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
      set(snackbarOpenedState, true);
      set(messageState, 'パスワード再設定リンクの送信に失敗しました');
      set(loadingState, false);
      return;
    }
    set(snackbarOpenedState, true);
    set(messageState, 'パスワード再設定リンクをメールに送信しました');
    set(loadingState, false);
  });