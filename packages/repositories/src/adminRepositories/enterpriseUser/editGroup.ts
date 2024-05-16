import { FirebaseApp } from '@firebase/app';
import { Timestamp } from 'firebase/firestore';

import { updateDoc } from '../../helpers/firestoreHelper';
import { enterpriseUserGroupDocRef } from '../../refs';
import { CreateEnterpriseUserGroupArgs } from '../../types/functions';
import { callFirebaseFunction } from '../../utils/callFirebaseFunction';
import { functionNames } from '../../utils/functionNames';

export const createEnterpriseUserGroup = async (
  app: FirebaseApp,
  args: CreateEnterpriseUserGroupArgs
) => callFirebaseFunction(app, functionNames.createEnterpriseUserGroup, args);

export interface EditEnterpriseUserGroup {
  emails?: Array<string>;
  name?: string;
  wacc?: number;
}
interface EditEnterpriseUserGroupArgs {
  app: FirebaseApp;
  enterpriseId: string;
  editedGroup: EditEnterpriseUserGroup;
}
export const editEnterpriseUserGroup = async (
  args: EditEnterpriseUserGroupArgs
) => {
  const { app, enterpriseId, editedGroup } = args;
  const now = Timestamp.now();
  await updateDoc(enterpriseUserGroupDocRef(app, enterpriseId), {
    ...editedGroup,
    lastEditedAt: now
  });
};