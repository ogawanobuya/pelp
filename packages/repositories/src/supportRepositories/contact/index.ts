import { FirebaseApp } from '@firebase/app';

import { SendContactEmailArgs } from '../../types';
import { callFirebaseFunction } from '../../utils/callFirebaseFunction';
import { functionNames } from '../../utils/functionNames';

export const supportContactRepository = (app: FirebaseApp) => {
  const sendContactEmail = (args: SendContactEmailArgs) =>
    callFirebaseFunction(app, functionNames.sendContactEmail, args);

  return { sendContactEmail };
};