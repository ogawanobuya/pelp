import { FirebaseApp } from '@firebase/app';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';

import {
  AddEnterpriseEmailsArgs,
  CreateEnterpriseUserArgs,
  DeleteEnterpriseEmailsArgs,
  GenerateOneTimePasswordArgs,
  VerifyOneTimePasswordArgs
} from '../../types/functions';

import * as EditGroup from './editGroup';
import * as EditUser from './editUser';
import * as FetchGroup from './fetchGroup';
import * as FetchUser from './fetchUser';

interface EditEnterpriseUserGroupArgs {
  enterpriseId: string;
  name: string;
}
interface EditEnterpriseUserArgs {
  enterpriseId: string;
  authUserId: string;
  editedUser: EditUser.EditedEnterpriseUser;
}
interface DeleteEnterpriseUserArgs {
  enterpriseId: string;
  authUserId: string;
}
interface FetchEnterpriseUserArgs {
  enterpriseId: string;
  authUserId: string;
}
interface FetchEnterpriseUsersArgs {
  enterpriseId: string;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}

export const enterpriseUserRepository = (app: FirebaseApp) => {
  // admin only
  const editEnterpriseUserGroup = (args: EditEnterpriseUserGroupArgs) =>
    EditGroup.editEnterpriseUserGroup({ app, ...args });
  const generateOneTimePassword = (args: GenerateOneTimePasswordArgs) =>
    EditGroup.generateOneTimePassword(app, args);
  const verifyOneTimePassword = (args: VerifyOneTimePasswordArgs) =>
    EditGroup.verifyOneTimePassword(app, args);
  // admin only
  const addEnterpriseEmails = (args: AddEnterpriseEmailsArgs) =>
    EditGroup.addEnterpriseEmails(app, args);
  // admin only
  const deleteEnterpriseEmails = (args: DeleteEnterpriseEmailsArgs) =>
    EditGroup.deleteEnterpriseEmails(app, args);

  // admin only
  const createEnterpriseUser = (args: CreateEnterpriseUserArgs) =>
    EditUser.createEnterpriseUser(app, args);
  // editing "isGroupAdmin" is admin only
  const editEnterpriseUser = (args: EditEnterpriseUserArgs) =>
    EditUser.editEnterpriseUser({ app, ...args });
  // admin only
  const deleteEnterpriseUser = (args: DeleteEnterpriseUserArgs) =>
    EditUser.deleteEnterpriseUser({ app, ...args });

  const fetchEnterpriseUserGroup = (enterpriseId: string) =>
    FetchGroup.fetchEnterpriseUserGroup({ app, enterpriseId });

  const fetchEnterpriseUser = (args: FetchEnterpriseUserArgs) =>
    FetchUser.fetchEnterpriseUser({ app, ...args });
  // admin only
  const fetchEnterpriseUsers = (args: FetchEnterpriseUsersArgs) =>
    FetchUser.fetchEnterpriseUsers({ app, ...args });

  return {
    editEnterpriseUserGroup,
    generateOneTimePassword,
    verifyOneTimePassword,
    addEnterpriseEmails,
    deleteEnterpriseEmails,
    createEnterpriseUser,
    editEnterpriseUser,
    deleteEnterpriseUser,
    fetchEnterpriseUserGroup,
    fetchEnterpriseUser,
    fetchEnterpriseUsers
  };
};