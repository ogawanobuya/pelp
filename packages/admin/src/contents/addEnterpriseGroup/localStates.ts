import { adminEnterpriseUserRepository } from 'pelp-repositories/src';
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { firebaseApp } from 'src/utils/firebaseApp';

const enterpriseUserRepository = adminEnterpriseUserRepository(firebaseApp);

const emailPattern =
  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

const keyName = (id: string) => `addEnterpriseGroup_${id}_admin`;

const adminEmailState = atom<string>({
  key: keyName('adminEmail'),
  default: ''
});
export const useAdminEmailState = () => useRecoilState(adminEmailState);

const isValidAdminEmailState = selector<boolean>({
  key: keyName('isValidAdminEmail'),
  get: ({ get }) => {
    const email = get(adminEmailState);
    if (email.length === 0) return true;
    return emailPattern.test(email);
  }
});
export const useIsValidAdminEmailValue = () =>
  useRecoilValue(isValidAdminEmailState);

const emailsStringState = atom<string>({
  key: keyName('emailsString'),
  default: ''
});
export const useEmailsStringState = () => useRecoilState(emailsStringState);

const emailsState = selector<Array<string>>({
  key: keyName('emails'),
  get: ({ get }) => {
    const emailsString = get(emailsStringState);
    return emailsString.replace(' ', '').split(',');
  }
});

const isValidEmailsState = selector<boolean>({
  key: keyName('isValidEmails'),
  get: ({ get }) => {
    const emailsString = get(emailsStringState);
    if (emailsString.length === 0) {
      return true;
    }
    const emails = get(emailsState);
    return emails.every((email) => emailPattern.test(email));
  }
});
export const useIsValidEmailsValue = () => useRecoilValue(isValidEmailsState);

const nameState = atom<string>({
  key: keyName('name'),
  default: ''
});
export const useNameState = () => useRecoilState(nameState);

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
    const adminEmail = await snapshot.getPromise(adminEmailState);
    const emails = await snapshot.getPromise(emailsState);
    const name = await snapshot.getPromise(nameState);
    const wacc = await snapshot.getPromise(waccState);
    const isValidAdminEmail = await snapshot.getPromise(isValidAdminEmailState);
    const isValidEmails = await snapshot.getPromise(isValidEmailsState);
    const loadingWhenCalled = await snapshot.getPromise(loadingState);

    if (
      loadingWhenCalled ||
      !isValidAdminEmail ||
      name.length === 0 ||
      wacc < 0 ||
      adminEmail.length === 0 ||
      emails.length === 0 ||
      !isValidEmails
    ) {
      return;
    }

    set(loadingState, true);
    try {
      await enterpriseUserRepository.createEnterpriseUserGroup({
        adminEmail,
        emails,
        name,
        wacc
      });
    } catch (e) {
      console.log(e);
    }
    set(loadingState, false);
  });