import { FirebaseApp } from '@firebase/app';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';

import {
  CreateVendorUserGroupArgs,
  CreateVendorUserArgs,
  GenerateOneTimePasswordArgs,
  VerifyOneTimePasswordArgs,
  AddVendorEmailsArgs,
  DeleteVendorEmailsArgs
} from '../../types/functions';

import * as EditGroup from './editGroup';
import * as EditUser from './editUser';
import * as FetchGroup from './fetchGroup';
import * as FetchUser from './fetchUser';

interface EditVendorUserGroupArgs {
  vendorId: string;
  name: string;
}
interface EditVendorUserArgs {
  vendorId: string;
  authUserId: string;
  editedUser: EditUser.EditedVendorUser;
}
interface DeleteVendorUserArgs {
  vendorId: string;
  authUserId: string;
}
interface FetchVendorUserArgs {
  vendorId: string;
  authUserId: string;
}
interface FetchVendorUsersArgs {
  vendorId: string;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}

export const vendorUserRepository = (app: FirebaseApp) => {
  const createVendorUserGroup = (args: CreateVendorUserGroupArgs) =>
    EditGroup.createVendorUserGroup(app, args);
  // admin only
  const editVendorUserGroup = (args: EditVendorUserGroupArgs) =>
    EditGroup.editEnterpriseUserGroup({ app, ...args });
  const addVendorEmails = (args: AddVendorEmailsArgs) =>
    EditGroup.addVendorEmails(app, args);
  // admin only
  const deleteVendorEmails = (args: DeleteVendorEmailsArgs) =>
    EditGroup.deleteVendorEmails(app, args);

  const generateOneTimePassword = (args: GenerateOneTimePasswordArgs) =>
    EditGroup.generateOneTimePassword(app, args);
  const verifyOneTimePassword = (args: VerifyOneTimePasswordArgs) =>
    EditGroup.verifyOneTimePassword(app, args);

  // admin only
  const createVendorUser = (args: CreateVendorUserArgs) =>
    EditUser.createVendorUser(app, args);
  const editVendorUser = (args: EditVendorUserArgs) =>
    EditUser.editVendorUser({ app, ...args });
  // admin only
  const deleteVendorUser = (args: DeleteVendorUserArgs) =>
    EditUser.deleteVendorUser({ app, ...args });

  const fetchVendorUserGroup = (vendorId: string) =>
    FetchGroup.fetchVendorUserGroup({ app, vendorId });

  const fetchVendorUser = (args: FetchVendorUserArgs) =>
    FetchUser.fetchVendorUser({ app, ...args });
  // admin only
  const fetchVendorUsers = (args: FetchVendorUsersArgs) =>
    FetchUser.fetchVendorUsers({ app, ...args });

  return {
    createVendorUserGroup,
    editVendorUserGroup,
    addVendorEmails,
    deleteVendorEmails,
    generateOneTimePassword,
    verifyOneTimePassword,
    createVendorUser,
    editVendorUser,
    deleteVendorUser,
    fetchVendorUserGroup,
    fetchVendorUser,
    fetchVendorUsers
  };
};