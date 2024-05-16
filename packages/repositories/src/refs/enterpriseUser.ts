import { FirebaseApp } from '@firebase/app';

import { docRef, collectionRef } from '../helpers/firestoreHelper';
import {
  enterpriseUserDocPath,
  enterpriseUserGroupDocPath,
  enterpriseUserGroupsCollectionPath,
  enterpriseUsersCollectionPath
} from '../paths';

export const enterpriseUserGroupsCollectionRef = (app: FirebaseApp) =>
  collectionRef(app, enterpriseUserGroupsCollectionPath);

export const enterpriseUserGroupDocRef = (
  app: FirebaseApp,
  enterpriseId: string
) => docRef(app, enterpriseUserGroupDocPath(enterpriseId));

export const enterpriseUsersCollectionRef = (
  app: FirebaseApp,
  enterpriseId: string
) => collectionRef(app, enterpriseUsersCollectionPath(enterpriseId));

export const enterpriseUserDocRef = (
  app: FirebaseApp,
  enterpriseId: string,
  authUserId: string
) => docRef(app, enterpriseUserDocPath(enterpriseId, authUserId));