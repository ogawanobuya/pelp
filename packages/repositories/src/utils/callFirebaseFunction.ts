import { FirebaseApp } from '@firebase/app';

import { httpsCallable } from '../helpers/firebaseFunctionsHelper';

import { FunctionName } from './functionNames';

export const callFirebaseFunction = async <T>(
  app: FirebaseApp,
  functionName: FunctionName,
  callableArgs: T
) => {
  const callable = httpsCallable<T, any>(app, functionName);
  const res = await callable(callableArgs);
  return res;
};