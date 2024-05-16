import { vendorAccountRepository } from 'pelp-repositories/src';
import { selector } from 'recoil';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

import { userDataState } from '../authState';

const keyName = (id: string) => `global_${id}_vendor`;

export const accountRepositoryState = selector({
  key: keyName('accountRepository'),
  get: ({ get }) => {
    const userData = get(userDataState);
    const { vendorUser } = userData;
    if (!vendorUser) return null;
    const accountRepository = vendorAccountRepository(firebaseApp, vendorUser);
    return accountRepository;
  }
});