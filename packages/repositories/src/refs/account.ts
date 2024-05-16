import { FirebaseApp } from '@firebase/app';

import { docRef, collectionRef } from '../helpers/firestoreHelper';
import {
  accountDocPath,
  accountindexDocPath,
  accountindicesCollectionPath,
  accountsCollectionPath,
  indexDocPath,
  indicesCollectionPath
} from '../paths';

export const accountsCollectionRef = (app: FirebaseApp) =>
  collectionRef(app, accountsCollectionPath);

export const accountDocRef = (app: FirebaseApp, accountId: string) =>
  docRef(app, accountDocPath(accountId));

export const indicesCollectionRef = (app: FirebaseApp) =>
  collectionRef(app, indicesCollectionPath);

export const indexDocRef = (app: FirebaseApp, enterpriseId: string) =>
  docRef(app, indexDocPath(enterpriseId));

export const accountindicesCollectionRef = (
  app: FirebaseApp,
  enterpriseId: string
) => collectionRef(app, accountindicesCollectionPath(enterpriseId));

export const accountindexDocRef = (
  app: FirebaseApp,
  enterpriseId: string,
  accountIndex: string
) => docRef(app, accountindexDocPath(enterpriseId, accountIndex));