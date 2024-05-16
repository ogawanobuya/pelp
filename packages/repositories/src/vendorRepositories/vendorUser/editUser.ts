import { FirebaseApp } from '@firebase/app';
import { Timestamp } from 'firebase/firestore';

import { deleteDoc, updateDoc } from '../../helpers/firestoreHelper';
import { vendorUserDocRef } from '../../refs';
import { CreateVendorUserArgs } from '../../types/functions';
import { callFirebaseFunction } from '../../utils/callFirebaseFunction';
import { functionNames } from '../../utils/functionNames';

export const createVendorUser = async (
  app: FirebaseApp,
  args: CreateVendorUserArgs
) => callFirebaseFunction(app, functionNames.createVendorUser, args);

export interface EditedVendorUser {
  role: Array<string>;
  isGroupAdmin: boolean;
}
interface EditVendorUserArgs {
  app: FirebaseApp;
  vendorId: string;
  authUserId: string;
  editedUser: EditedVendorUser;
}
export const editVendorUser = async (args: EditVendorUserArgs) => {
  const { app, vendorId, authUserId, editedUser } = args;
  const { role, isGroupAdmin } = editedUser;
  const now = Timestamp.now();
  await updateDoc(vendorUserDocRef(app, vendorId, authUserId), {
    role,
    isGroupAdmin,
    lastEditedAt: now
  });
};

interface DeleteVendorUserArgs {
  app: FirebaseApp;
  vendorId: string;
  authUserId: string;
}
export const deleteVendorUser = async (args: DeleteVendorUserArgs) => {
  const { app, vendorId, authUserId } = args;
  await deleteDoc(vendorUserDocRef(app, vendorId, authUserId));
};