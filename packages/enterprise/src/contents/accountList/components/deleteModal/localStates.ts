import { atom, useRecoilCallback, useRecoilValue } from 'recoil';
import { accountRepositoryState } from 'src/globalStates/repositories';

const keyName = (id: string) => `AccountListDeleteModal_${id}_enterprise`;

const loadingState = atom<boolean>({
  key: keyName('loading'),
  default: false
});
export const useLoadingValue = () => useRecoilValue(loadingState);

interface DeleteAccountArgs {
  accountId: string;
  callback: () => void;
}
export const useDeleteAccount = () =>
  useRecoilCallback(({ snapshot, set }) => async (args: DeleteAccountArgs) => {
    const { accountId, callback } = args;

    const loading = await snapshot.getPromise(loadingState);
    if (loading) return;

    const accountRepository = await snapshot.getPromise(accountRepositoryState);

    set(loadingState, true);
    try {
      await accountRepository.deleteAccount(accountId);
    } catch (e) {
      console.error(e);
      set(loadingState, false);
      return;
    }
    set(loadingState, false);

    callback();
  });