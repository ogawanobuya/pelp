import { atom, useRecoilState } from 'recoil';

const tabState = atom<number>({
  key: 'AccountListContent_tab_enterprise',
  default: 0
});
export const useTabState = () => useRecoilState(tabState);