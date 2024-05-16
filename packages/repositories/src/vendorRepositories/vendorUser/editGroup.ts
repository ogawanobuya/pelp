import { FirebaseApp } from '@firebase/app';
import { Timestamp } from 'firebase/firestore';

import { updateDoc } from '../../helpers/firestoreHelper';
import { vendorUserGroupDocRef } from '../../refs';
import {
  AddVendorEmailsArgs,
  CreateVendorUserGroupArgs,
  DeleteVendorEmailsArgs,
  GenerateOneTimePasswordArgs,
  VerifyOneTimePasswordArgs
} from '../../types/functions';
import { callFirebaseFunction } from '../../utils/callFirebaseFunction';
import { functionNames } from '../../utils/functionNames';

export const createVendorUserGroup = async (
  app: FirebaseApp,
  args: CreateVendorUserGroupArgs
) =>
  callFirebaseFunction<CreateVendorUserGroupArgs>(
    app,
    functionNames.createVendorUserGroup,
    args
  );

export const generateOneTimePassword = async (
  app: FirebaseApp,
  args: GenerateOneTimePasswordArgs
) =>
  callFirebaseFunction<GenerateOneTimePasswordArgs>(
    app,
    functionNames.generateOneTimePassword,
    args
  );

export const verifyOneTimePassword = async (
  app: FirebaseApp,
  args: VerifyOneTimePasswordArgs
) => callFirebaseFunction(app, functionNames.verifyOneTimePassword, args);

export const addVendorEmails = async (
  app: FirebaseApp,
  args: AddVendorEmailsArgs
) =>
  callFirebaseFunction<AddVendorEmailsArgs>(
    app,
    functionNames.addVendorEmails,
    args
  );

export const deleteVendorEmails = async (
  app: FirebaseApp,
  args: DeleteVendorEmailsArgs
) =>
  callFirebaseFunction<DeleteVendorEmailsArgs>(
    app,
    functionNames.deleteVendorEmails,
    args
  );

interface EditEnterpriseUserGroupArgs {
  app: FirebaseApp;
  vendorId: string;
  name: string;
}
export const editEnterpriseUserGroup = async (
  args: EditEnterpriseUserGroupArgs
) => {
  const { app, vendorId, name } = args;
  const now = Timestamp.now();
  await updateDoc(vendorUserGroupDocRef(app, vendorId), {
    name,
    lastEditedAt: now
  });
};