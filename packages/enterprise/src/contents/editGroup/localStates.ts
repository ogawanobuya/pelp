import {
  EnterpriseUserGroup,
  enterpriseUserRepository
} from 'pelp-repositories/src';
import {
  atom,
  atomFamily,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import {
  onUpdateEnterpriseUser,
  userDataState
} from 'src/globalStates/authState';
import { firebaseApp } from 'src/utils/firebase/firebaseApp';

const userRepository = enterpriseUserRepository(firebaseApp);

const emailPattern =
  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

const keyName = (id: string) => `EditGroup_${id}_enterprise`;

// enterpriseUserGroup

const enterpriseUserGroupState = atom<EnterpriseUserGroup | null>({
  key: keyName('enterpriseUserGroup'),
  default: null
});
export const useEnterpriseUserGroupValue = () =>
  useRecoilValue(enterpriseUserGroupState);

const initializedState = atom<boolean>({
  key: keyName('initialized'),
  default: false
});
export const useInitializedValue = () => useRecoilValue(initializedState);

export const useInitialize = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const initialized = await snapshot.getPromise(initializedState);
    if (initialized) return;

    set(initializedState, true);

    try {
      const userData = await snapshot.getPromise(userDataState);
      const { enterpriseUser } = userData;
      if (!enterpriseUser) return;
      const { enterpriseId } = enterpriseUser;

      const enterpriseUserGroup = await userRepository.fetchEnterpriseUserGroup(
        enterpriseId
      );

      set(enterpriseUserGroupState, enterpriseUserGroup);
      set(emailsState, enterpriseUserGroup.emails);
      set(nameState, enterpriseUserGroup.name);
    } catch (e) {
      console.error(e);
    }
  });

// name

const nameState = atom<string>({
  key: keyName('name'),
  default: ''
});
export const useNameState = () => useRecoilState(nameState);

export const useEditGroup = () =>
  useRecoilCallback((intf) => async () => {
    const { snapshot, set } = intf;
    const loading = await snapshot.getPromise(loadingState('name'));
    if (loading) return;

    const name = await snapshot.getPromise(nameState);

    set(loadingState('name'), true);
    try {
      const userData = await snapshot.getPromise(userDataState);
      const { enterpriseUser } = userData;
      if (!enterpriseUser) return;
      const { enterpriseId } = enterpriseUser;

      await userRepository.editEnterpriseUserGroup({ enterpriseId, name });
    } catch (e) {
      console.error(e);
      set(snackbarOpenState, true);
      set(snackbarContentState, ' グループの編集に失敗しました');
      set(loadingState('name'), false);
      return;
    }

    snapshot.retain();
    setTimeout(() => onUpdateEnterpriseUser(intf), 5000);

    set(initializedState, false); // リロード
    set(snackbarOpenState, true);
    set(snackbarContentState, ' グループを編集しました');
    set(loadingState('name'), false);
  });

// addedEmail

const addedEmailState = atom<string>({
  key: keyName('addedEmail'),
  default: ''
});
export const useAddedEmailState = () => useRecoilState(addedEmailState);

const isValidAddedEmailState = selector<boolean>({
  key: keyName('isValidAddedEmail'),
  get: ({ get }) => {
    const email = get(addedEmailState);
    const emails = get(emailsState);
    return emailPattern.test(email) && !emails.includes(email);
  }
});
export const useIsValidAddedEmailValue = () =>
  useRecoilValue(isValidAddedEmailState);

export const useSendOneTimePassword = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const loading = await snapshot.getPromise(loadingState('default'));
    if (loading) return;
    const isValidAddedEmail = await snapshot.getPromise(isValidAddedEmailState);
    if (!isValidAddedEmail) return;

    const addedEmail = await snapshot.getPromise(addedEmailState);

    set(loadingState('default'), true);
    try {
      await userRepository.generateOneTimePassword({ email: addedEmail });
    } catch (e) {
      console.error(e);
      set(snackbarOpenState, true);
      set(snackbarContentState, ' ワンタイムパスワードの送信に失敗しました');
      set(loadingState('default'), false);
      return;
    }
    set(emailAddStepState, 'verifying');
    set(oneTimePasswordState, '');

    set(snackbarOpenState, true);
    set(snackbarContentState, ' ワンタイムパスワードを送信しました');
    set(loadingState('default'), false);
  });

type EmailAddStep = 'entering' | 'verifying' | 'verified';
const emailAddStepState = atom<EmailAddStep>({
  key: keyName('emailAddStep'),
  default: 'entering'
});
export const useEmailAddStepValue = () => useRecoilValue(emailAddStepState);

const oneTimePasswordState = atom<string>({
  key: keyName('oneTimePassword'),
  default: ''
});
export const useOneTimePasswordState = () =>
  useRecoilState(oneTimePasswordState);

export const useAddEmail = () =>
  useRecoilCallback((intf) => async () => {
    const { snapshot, set } = intf;
    const loading = await snapshot.getPromise(loadingState('default'));
    if (loading) return;

    const addedEmail = await snapshot.getPromise(addedEmailState);
    const oneTimePassword = await snapshot.getPromise(oneTimePasswordState);

    const step = await snapshot.getPromise(emailAddStepState);
    set(loadingState('default'), true);
    if (step !== 'verified') {
      try {
        await userRepository.verifyOneTimePassword({
          email: addedEmail,
          oneTimePassword
        });
      } catch (e) {
        console.error(e);
        set(snackbarOpenState, true);
        set(snackbarContentState, ' ワンタイムパスワードの認証に失敗しました');
        set(loadingState('default'), false);
        return;
      }
    }

    set(emailAddStepState, 'verified');

    try {
      await userRepository.addEnterpriseEmails({
        newEmails: [addedEmail]
      });
    } catch (e) {
      console.error(e);
      set(snackbarOpenState, true);
      set(snackbarContentState, ' メールアドレスの追加に失敗しました');
      set(loadingState('default'), false);
      return;
    }

    snapshot.retain();
    setTimeout(() => onUpdateEnterpriseUser(intf), 5000);

    set(emailAddStepState, 'entering');
    set(oneTimePasswordState, '');
    set(addedEmailState, '');
    set(loadingState('default'), false);
    set(snackbarOpenState, true);
    set(snackbarContentState, ' メールアドレスを追加しました');
    set(initializedState, false); // リロード
  });

// entering に戻してもう一度メールアドレスをo入力し直す
export const useResetAddedEmail = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const loading = await snapshot.getPromise(loadingState('default'));
    if (loading) return;

    set(emailAddStepState, 'entering');
    set(oneTimePasswordState, '');
    set(addedEmailState, '');
  });

// emails

const emailsState = atom<Array<string>>({
  key: keyName('emails'),
  default: []
});
export const useEmailsValue = () => useRecoilValue(emailsState);

const emailDeletionModalOpenState = atomFamily<boolean, string>({
  key: keyName('emailDeletionModalOpen'),
  default: false
});
export const useEmailDeletionModalOpenState = (email: string) =>
  useRecoilState(emailDeletionModalOpenState(email));

export const useOpenDeletionModal = () =>
  useRecoilCallback(({ set }) => async (email: string) => {
    set(emailDeletionModalOpenState(email), true);
  });

export const useDeleteEmail = () =>
  useRecoilCallback((intf) => async (index: number) => {
    const { snapshot, set } = intf;
    const loading = await snapshot.getPromise(loadingState('deleteEmail'));
    if (loading) return;

    const emails = await snapshot.getPromise(emailsState);
    const deletedEmail = emails[index];

    set(loadingState('deleteEmail'), true);
    try {
      await userRepository.deleteEnterpriseEmails({
        deletedEmails: [deletedEmail]
      });
    } catch (e) {
      set(snackbarOpenState, true);
      set(snackbarContentState, 'バイヤーメールアドレスの削除に失敗しました');
      set(loadingState('deleteEmail'), false);
      return;
    }

    snapshot.retain();
    setTimeout(() => onUpdateEnterpriseUser(intf), 5000);

    set(initializedState, false); // リロード
    set(snackbarOpenState, true);
    set(snackbarContentState, 'バイヤーメールアドレスを削除しました');
    set(emailDeletionModalOpenState(deletedEmail), false);
    set(loadingState('deleteEmail'), false);
  });

// snackbar

const snackbarContentState = atom<string>({
  key: keyName('snackbarContent'),
  default: ''
});
export const useSnackbarContentValue = () =>
  useRecoilValue(snackbarContentState);

const snackbarOpenState = atom<boolean>({
  key: keyName('snackbarOpen'),
  default: false
});
export const useSnackbarOpenState = () => useRecoilState(snackbarOpenState);

// loading

const loadingState = atomFamily<boolean, string>({
  key: keyName('loading'),
  default: false
});
export const useLoadingValue = (id: string) => useRecoilValue(loadingState(id));