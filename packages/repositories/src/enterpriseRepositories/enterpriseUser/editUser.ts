import { FirebaseApp } from '@firebase/app';
import { Timestamp } from 'firebase/firestore';

import { deleteDoc, updateDoc } from '../../helpers/firestoreHelper';
import { enterpriseUserDocRef } from '../../refs';
import { CreateEnterpriseUserArgs } from '../../types/functions';
import { callFirebaseFunction } from '../../utils/callFirebaseFunction';
import { functionNames } from '../../utils/functionNames';

export const createEnterpriseUser = async (
  app: FirebaseApp,
  args: CreateEnterpriseUserArgs
) => callFirebaseFunction(app, functionNames.createEnterpriseUser, args);

export interface EditedEnterpriseUser {
  role: Array<string>;
  isGroupAdmin: boolean;
}
interface EditEnterpriseUserArgs {
  app: FirebaseApp;
  enterpriseId: string;
  authUserId: string;
  editedUser: EditedEnterpriseUser;
}
export const editEnterpriseUser = async (args: EditEnterpriseUserArgs) => {
  const { app, enterpriseId, authUserId, editedUser } = args;
  const { role, isGroupAdmin } = editedUser;
  const now = Timestamp.now();
  await updateDoc(enterpriseUserDocRef(app, enterpriseId, authUserId), {
    role,
    isGroupAdmin,
    lastEditedAt: now
  });
};

interface DeleteEnterpriseUserArgs {
  app: FirebaseApp;
  enterpriseId: string;
  authUserId: string;
}
export const deleteEnterpriseUser = async (args: DeleteEnterpriseUserArgs) => {
  const { app, enterpriseId, authUserId } = args;
  await deleteDoc(enterpriseUserDocRef(app, enterpriseId, authUserId));
};