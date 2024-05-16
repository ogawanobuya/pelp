import { User } from 'firebase/auth';
import { adminAuthRepository } from 'pelp-repositories/src';
import { atom, useRecoilValue } from 'recoil';
import { firebaseApp } from 'src/utils/firebaseApp';

const authRepository = adminAuthRepository(firebaseApp);

export const userDataState = atom<User | null>({
  key: 'global_userData_admin',
  default: null,
  effects: [
    ({ setSelf }) => {
      let resolvePromise: (value: User) => void;
      const initialValue = new Promise<User>((resolve) => {
        resolvePromise = resolve;
      });
      setSelf(initialValue);

      // ログイン状態の監視
      const unsubscribe = authRepository.onAuthStateChanged({
        callbackAuthenticated: async (user) => {
          resolvePromise(user);
          setSelf(user);
        },
        callbackNotAuthenticated: async () => {
          resolvePromise(null);
          setSelf(null);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  ]
});

export const useUesrDataValue = () => useRecoilValue(userDataState);