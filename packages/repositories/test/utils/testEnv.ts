import * as fs from 'fs';

import * as firebase from '@firebase/rules-unit-testing';

export const testEnv = (projectId: string) =>
  firebase.initializeTestEnvironment({
    projectId,
    firestore: {
      host: 'localhost',
      port: 8080,
      rules: fs.readFileSync('./firestore.rules', 'utf8')
    }
  });