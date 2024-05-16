import {
  MaintainanceData,
  vendorConfigRepository
} from 'pelp-repositories/src';
import { atom, useRecoilCallback, useRecoilValue } from 'recoil';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

const configRepository = vendorConfigRepository(firebaseApp);

const maintainanceDataState = atom<MaintainanceData>({
  key: 'global_maintainanceData_enterprise',
  default: {
    maintainance: true,
    message: ''
  }
});
export const useMaintainanceDataValue = () =>
  useRecoilValue(maintainanceDataState);

const configsFetchedState = atom<boolean>({
  key: 'global_configsFetched_enterpise',
  default: false
});
export const useConfigsFetchedValue = () => useRecoilValue(configsFetchedState);

const loadingState = atom<boolean>({
  key: 'global_maintainanceDataLoading_enterprise',
  default: false
});
export const useConfigLoadingValue = () => useRecoilValue(loadingState);

export const useFetchConfigs = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const loading = await snapshot.getPromise(loadingState);
    if (loading) return;
    const fetched = await snapshot.getPromise(configsFetchedState);
    if (fetched) return;

    set(loadingState, true);
    const maintainanceData = await configRepository.fetchMaintainance();
    set(loadingState, false);
    if (maintainanceData) {
      set(maintainanceDataState, maintainanceData);
    } else {
      set(maintainanceDataState, {
        maintainance: true,
        message: ''
      });
    }
    set(configsFetchedState, true);
  });