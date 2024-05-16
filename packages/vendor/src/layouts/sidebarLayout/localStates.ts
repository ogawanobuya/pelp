import { vendorAuthRepository } from 'pelp-repositories/src';
import { atom, useRecoilState } from 'recoil';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

const authRepository = vendorAuthRepository(firebaseApp);

// global var

const isSidebarVisible = atom<boolean>({
  key: 'sidebarLayout_isSidebarVisible_vendor',
  default: false
});
export const useIsSidebarVisibleState = () => useRecoilState(isSidebarVisible);

// method

export const { signOut } = authRepository;