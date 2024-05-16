import { vendorAuthRepository } from 'pelp-repositories/src';
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { REACT_APP_CREATE_GROUP_URL } from 'src/utils/env';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

const authRepository = vendorAuthRepository(firebaseApp);

const keyName = (id: string) => `signUp_${id}_vendor`;

// var

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

const passwordConfirmationState = atom<string>({
  key: keyName('passwordConfirmation'),
  default: ''
});
export const usePasswordConfirmationState = () =>
  useRecoilState(passwordConfirmationState);

const termOfUseCheckboxCheckedState = atom<boolean>({
  key: keyName('termOfUseCheckboxChecked'),
  default: false
});
export const useTermOfUseCheckboxCheckedState = () =>
  useRecoilState(termOfUseCheckboxCheckedState);

const privacyPolicyCheckboxCheckedState = atom<boolean>({
  key: keyName('privacyPolicyCheckboxChecked'),
  default: false
});
export const usePrivacyPolicyCheckboxCheckedState = () =>
  useRecoilState(privacyPolicyCheckboxCheckedState);

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

const modalOpenState = atom<boolean>({
  key: keyName('modalOpen'),
  default: false
});
export const useModalOpenState = () => useRecoilState(modalOpenState);

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingState = () => useRecoilState(loadingState);

// method

const canSignUpState = selector<boolean>({
  key: keyName('canSignUp'),
  get: ({ get }) => {
    const email = get(emailState);
    const password = get(passwordState);
    const passwordConfirmation = get(passwordConfirmationState);
    const isValidEmail = get(isValidEmailState);
    const loadingWhenCalled = get(loadingState);
    const termOfUseCheckboxChecked = get(termOfUseCheckboxCheckedState);
    const privacyPolicyCheckboxChecked = get(privacyPolicyCheckboxCheckedState);

    if (
      loadingWhenCalled ||
      !isValidEmail ||
      password.length === 0 ||
      email.length === 0 ||
      password !== passwordConfirmation ||
      !termOfUseCheckboxChecked ||
      !privacyPolicyCheckboxChecked
    ) {
      return false;
    }

    return true;
  }
});
export const useCanSignUpValue = () => useRecoilValue(canSignUpState);

export const useSignUp = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const email = await snapshot.getPromise(emailState);
    const password = await snapshot.getPromise(passwordState);
    const canSignUp = await snapshot.getPromise(canSignUpState);

    if (!canSignUp) {
      return;
    }

    set(loadingState, true);
    try {
      await authRepository.createUserWithEmailAndPassword(email, password);
      await authRepository.sendVerificationEmail(
        email,
        REACT_APP_CREATE_GROUP_URL
      );
    } catch (e) {
      console.error(e);
      set(snackbarOpenState, true);
      set(messageState, '新規登録に失敗しました');
      set(loadingState, false);
      return;
    }
    set(snackbarOpenState, true);
    set(messageState, 'メールアドレスを認証するためのメールを送信しました');
    set(loadingState, false);
  });

export const useSendVerificationEmail = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const email = await snapshot.getPromise(emailState);
    const isValidEmail = await snapshot.getPromise(isValidEmailState);
    const loadingWhenCalled = await snapshot.getPromise(loadingState);

    if (loadingWhenCalled || !isValidEmail || email.length === 0) {
      return;
    }

    set(loadingState, true);
    try {
      await authRepository.sendVerificationEmail(
        email,
        REACT_APP_CREATE_GROUP_URL
      );
    } catch (e) {
      console.error(e);
      set(snackbarOpenState, true);
      set(messageState, '認証メールの送信に失敗しました');
      set(loadingState, false);
      return;
    }
    set(snackbarOpenState, true);
    set(messageState, 'メールアドレスを認証するためのメールを送信しました');
    set(loadingState, false);
  });