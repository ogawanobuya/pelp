import { adminAuthRepository } from 'pelp-repositories/src';
import { atom, useRecoilState } from 'recoil';
import { firebaseApp } from 'src/utils/firebaseApp';

const authRepository = adminAuthRepository(firebaseApp);

// global var

const isSidebarVisible = atom<boolean>({
  key: 'sidebarLayout_isSidebarVisible_enterprise',
  default: false
});
export const useIsSidebarVisibleState = () => useRecoilState(isSidebarVisible);

// method

export const { signOut } = authRepository;