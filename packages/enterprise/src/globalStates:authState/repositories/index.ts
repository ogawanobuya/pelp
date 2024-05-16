import { enterpriseAccountRepository } from 'pelp-repositories/src';
import { selector } from 'recoil';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

import { userDataState } from '../authState';

const keyName = (id: string) => `global_${id}_enterprise`;

export const accountRepositoryState = selector({
  key: keyName('accountRepository'),
  get: ({ get }) => {
    const userData = get(userDataState);
    const { enterpriseUser } = userData;
    if (!enterpriseUser) return null;
    const accountRepository = enterpriseAccountRepository(
      firebaseApp,
      enterpriseUser
    );
    return accountRepository;
  }
});