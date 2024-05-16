import { FirebaseApp } from '@firebase/app';

import { collectionRef, docRef } from '../helpers/firestoreHelper';
import {
  oneTimePasswordDocPath,
  oneTimePasswordsCollectionPath
} from '../paths';

export const oneTimePasswordsCollectionRef = (app: FirebaseApp) =>
  collectionRef(app, oneTimePasswordsCollectionPath);

export const oneTimePasswordDocRef = (app: FirebaseApp, email: string) =>
  docRef(app, oneTimePasswordDocPath(email));