import { User } from 'firebase/auth';
import {
  EnterpriseUser,
  enterpriseAuthRepository,
  enterpriseUserRepository
} from 'pelp-repositories/src';
import { atom, CallbackInterface, useRecoilValue } from 'recoil';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

const authRepository = enterpriseAuthRepository(firebaseApp);
const userRepository = enterpriseUserRepository(firebaseApp);

interface UserData {
  enterpriseUser: EnterpriseUser | null;
  user: User | null;
}

export const userDataState = atom<UserData>({
  key: 'global_userData_enterprise',
  default: {
    enterpriseUser: null,
    user: null
  },
  effects: [
    ({ setSelf }) => {
      let resolvePromise: (value: UserData) => void;
      const initialValue = new Promise<UserData>((resolve) => {
        resolvePromise = resolve;
      });
      setSelf(initialValue);

      // ログイン状態の監視
      const unsubscribe = authRepository.onAuthStateChanged({
        callbackNotAuthenticated: async () => {
          const data: UserData = {
            enterpriseUser: null,
            user: null
          };
          resolvePromise(data);
          setSelf(data);
        },
        callbackAuthenticated: async (user, enterpriseUser) => {
          const data: UserData = { enterpriseUser, user };
          resolvePromise(data);
          setSelf(data);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  ]
});

export const useUesrDataValue = () => useRecoilValue(userDataState);

export const onUpdateEnterpriseUser = async (intf: CallbackInterface) => {
  const { snapshot, set } = intf;
  const userData = await snapshot.getPromise(userDataState);
  const before = userData.enterpriseUser;
  if (!before) return;

  try {
    const after = await userRepository.fetchEnterpriseUser({
      enterpriseId: before.enterpriseId,
      authUserId: before.id
    });
    set(userDataState, { user: userData.user, enterpriseUser: after });
  } catch (e) {
    console.error(e);
  }
};