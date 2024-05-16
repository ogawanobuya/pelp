import { FirebaseApp } from '@firebase/app';

import { collectionRef, docRef } from '../helpers/firestoreHelper';
import { configCollectionPath, maintainanceDocPath } from '../paths/config';

export const configCollectionRef = (app: FirebaseApp) =>
  collectionRef(app, configCollectionPath);

export const maintainanceDocRef = (app: FirebaseApp) =>
  docRef(app, maintainanceDocPath);