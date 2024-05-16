import { FirebaseApp } from '@firebase/app';

import { docRef, collectionRef } from '../helpers/firestoreHelper';
import {
  vendorUserDocPath,
  vendorUserGroupDocPath,
  vendorUserGroupsCollectionPath,
  vendorUsersCollectionPath
} from '../paths';

export const vendorUserGroupsCollectionRef = (app: FirebaseApp) =>
  collectionRef(app, vendorUserGroupsCollectionPath);

export const vendorUserGroupDocRef = (app: FirebaseApp, vendorId: string) =>
  docRef(app, vendorUserGroupDocPath(vendorId));

export const vendorUsersCollectionRef = (app: FirebaseApp, vendorId: string) =>
  collectionRef(app, vendorUsersCollectionPath(vendorId));

export const vendorUserDocRef = (
  app: FirebaseApp,
  vendorId: string,
  authUserId: string
) => docRef(app, vendorUserDocPath(vendorId, authUserId));