import { FirebaseApp } from '@firebase/app';
import { Timestamp, updateDoc } from 'firebase/firestore';

import { accountDocRef } from '../../refs';

interface ActivateAccountArgs {
  app: FirebaseApp;
  accountId: string;
  vendorId: string;
}
export const activateAccount = async (args: ActivateAccountArgs) => {
  const { app, accountId, vendorId } = args;
  await updateDoc(accountDocRef(app, accountId), {
    status: 'active',
    vendorId,
    activatedAt: Timestamp.now(),
    lastEditedAt: Timestamp.now()
  });
};

interface ConfirmAccountArgs {
  app: FirebaseApp;
  accountId: string;
}
export const confirmAccount = async (args: ConfirmAccountArgs) => {
  const { app, accountId } = args;
  await updateDoc(accountDocRef(app, accountId), {
    status: 'confirmed',
    confirmedAt: Timestamp.now(),
    lastEditedAt: Timestamp.now()
  });
};