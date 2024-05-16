import { adminEnterpriseUserRepository } from 'pelp-repositories/src';
import { atom, useRecoilCallback, useRecoilState } from 'recoil';
import { firebaseApp } from 'src/utils/firebaseApp';

const enterpriseUserRepository = adminEnterpriseUserRepository(firebaseApp);

const keyName = (id: string) => `editEnterpriseGroup_${id}_admin`;

const enterpriseIdState = atom<string>({
  key: keyName('enterpriseId'),
  default: ''
});
export const useEnterpriseIdState = () => useRecoilState(enterpriseIdState);

const waccState = atom<number>({
  key: keyName('wacc'),
  default: 0.06
});
export const useWaccState = () => useRecoilState(waccState);

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingState = () => useRecoilState(loadingState);

export const useAddEnterpriseGroup = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const enterpriseId = await snapshot.getPromise(enterpriseIdState);
    const wacc = await snapshot.getPromise(waccState);
    const loadingWhenCalled = await snapshot.getPromise(loadingState);

    if (loadingWhenCalled || enterpriseId.length === 0 || wacc < 0) {
      return;
    }

    set(loadingState, true);
    try {
      await enterpriseUserRepository.editEnterpriseUserGroup({
        enterpriseId,
        editedGroup: { wacc }
      });
    } catch (e) {
      console.log(e);
    }
    set(loadingState, false);
  });