import { User } from 'firebase/auth';
import {
  vendorAuthRepository,
  VendorUser,
  vendorUserRepository
} from 'pelp-repositories/src';
import { atom, CallbackInterface, useRecoilValue } from 'recoil';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

const authRepository = vendorAuthRepository(firebaseApp);
const userRepository = vendorUserRepository(firebaseApp);

interface UserData {
  vendorUser: VendorUser | null;
  user: User | null;
}

export const userDataState = atom<UserData>({
  key: 'global_userData_vendor',
  default: {
    vendorUser: null,
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
            vendorUser: null,
            user: null
          };
          resolvePromise(data);
          setSelf(data);
        },
        callbackBeforeSigningUp: async (user) => {
          const data: UserData = { vendorUser: null, user };
          resolvePromise(data);
          setSelf(data);
        },
        callbackAuthenticated: async (user, vendorUser) => {
          const data: UserData = { vendorUser, user };
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

export const onUpdateVendorUser = async (intf: CallbackInterface) => {
  const { snapshot, set } = intf;
  const userData = await snapshot.getPromise(userDataState);
  const before = userData.vendorUser;
  if (!before) return;

  try {
    const after = await userRepository.fetchVendorUser({
      vendorId: before.vendorId,
      authUserId: before.id
    });
    set(userDataState, { user: userData.user, vendorUser: after });
  } catch (e) {
    console.error(e);
  }
};