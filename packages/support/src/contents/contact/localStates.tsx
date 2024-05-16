import { supportContactRepository } from 'pelp-repositories/src';
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { firebaseApp } from 'src/utils/firebaseApp';

const contactRepository = supportContactRepository(firebaseApp);

const emailPattern =
  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

const keyName = (id: string) => `contact_${id}_support`;

// userType

type UserType = 'enterprise' | 'vendor' | 'both' | 'none';
const isUserType = (value: string) =>
  value === 'enterprise' ||
  value === 'vendor' ||
  value === 'both' ||
  value === 'none';
export const castToUserType = (value: string): UserType | null => {
  if (!isUserType(value)) return null;
  return value as UserType;
};
const userTypeState = atom<UserType>({
  key: keyName('userType'),
  default: 'vendor'
});
export const useUserTypeState = () => useRecoilState(userTypeState);

// message

const messageState = atom<string>({
  key: keyName('message'),
  default: ''
});
export const useMessageState = () => useRecoilState(messageState);

// email

const emailState = atom<string>({
  key: keyName('email'),
  default: ''
});
export const useEmailState = () => useRecoilState(emailState);

const isValidEmailState = selector<boolean>({
  key: keyName('isValidEmail'),
  get: ({ get }) => {
    const email = get(emailState);
    return emailPattern.test(email);
  }
});
export const useIsValidEmailValue = () => useRecoilValue(isValidEmailState);

// name

const nameState = atom<string>({
  key: keyName('name'),
  default: ''
});
export const useNameState = () => useRecoilState(nameState);

// company

const companyState = atom<string>({
  key: keyName('company'),
  default: ''
});
export const useCompanyState = () => useRecoilState(companyState);

// submittable

const submittableState = selector<boolean>({
  key: keyName('submittable'),
  get: ({ get }) => {
    const message = get(messageState);
    if (message.length === 0) return false;
    const isValidEmail = get(isValidEmailState);
    if (!isValidEmail) return false;
    return true;
  }
});
export const useSubmittableValue = () => useRecoilValue(submittableState);

// snackbar

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

// loading

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingValue = () => useRecoilValue(loadingState);

// submit

export const useSubmit = () =>
  useRecoilCallback(({ snapshot, set, reset }) => async () => {
    const submittable = await snapshot.getPromise(submittableState);
    const loading = await snapshot.getPromise(loadingState);
    if (!submittable || loading) return;
    const userType = await snapshot.getPromise(userTypeState);
    const message = await snapshot.getPromise(messageState);
    const email = await snapshot.getPromise(emailState);
    const name = await snapshot.getPromise(nameState);
    const company = await snapshot.getPromise(companyState);

    set(loadingState, true);
    try {
      await contactRepository.sendContactEmail({
        userType,
        message,
        email,
        name,
        company
      });
    } catch (e) {
      console.error(e);
      set(loadingState, false);
      set(snackbarOpenState, true);
      set(snackbarContentState, '送信に失敗しました');
      return;
    }

    // 送信成功時にフォームをクリア
    reset(userTypeState);
    reset(messageState);
    reset(emailState);
    reset(nameState);
    reset(companyState);

    set(loadingState, false);
    set(snackbarOpenState, true);
    set(snackbarContentState, 'お問い合わせメールを送信しました');
  });