import { FirebaseApp } from '@firebase/app';
import { Timestamp } from 'firebase/firestore';

import { updateDoc } from '../../helpers/firestoreHelper';
import { enterpriseUserGroupDocRef } from '../../refs';
import {
  AddEnterpriseEmailsArgs,
  DeleteEnterpriseEmailsArgs,
  GenerateOneTimePasswordArgs,
  VerifyOneTimePasswordArgs
} from '../../types';
import { callFirebaseFunction } from '../../utils/callFirebaseFunction';
import { functionNames } from '../../utils/functionNames';

export interface EditedEnterpriseUserGroup {
  name: string;
}
interface EditEnterpriseUserGroupArgs {
  app: FirebaseApp;
  enterpriseId: string;
  name: string;
}
export const editEnterpriseUserGroup = async (
  args: EditEnterpriseUserGroupArgs
) => {
  const { app, enterpriseId, name } = args;
  const now = Timestamp.now();
  await updateDoc(enterpriseUserGroupDocRef(app, enterpriseId), {
    name,
    lastEditedAt: now
  });
};

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

export const addEnterpriseEmails = async (
  app: FirebaseApp,
  args: AddEnterpriseEmailsArgs
) =>
  callFirebaseFunction<AddEnterpriseEmailsArgs>(
    app,
    functionNames.addEnterpriseEmails,
    args
  );

export const deleteEnterpriseEmails = async (
  app: FirebaseApp,
  args: DeleteEnterpriseEmailsArgs
) =>
  callFirebaseFunction<DeleteEnterpriseEmailsArgs>(
    app,
    functionNames.deleteEnterpriseEmails,
    args
  );