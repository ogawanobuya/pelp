import { initializeApp, FirebaseOptions } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  initializeFirestore
} from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

import {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID,
  NODE_ENV
} from '../env';

const options: FirebaseOptions = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
  measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const firebaseApp = initializeApp(options);

// see: https://www.memory-lovers.blog/entry/2021/01/17/232930
getAuth(firebaseApp).useDeviceLanguage();
if (NODE_ENV !== 'production') {
  connectAuthEmulator(getAuth(), 'http://localhost:9099/');
  connectFunctionsEmulator(
    getFunctions(firebaseApp, 'asia-northeast1'),
    'localhost',
    5001
  );
  connectFirestoreEmulator(
    initializeFirestore(firebaseApp, {
      ignoreUndefinedProperties: true,
      experimentalForceLongPolling: true
    }),
    'localhost',
    8080
  );
}