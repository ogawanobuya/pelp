/* eslint-disable no-process-env */
/* eslint-disable no-underscore-dangle */

export const REACT_APP_ENTERPRISE = process.env.REACT_APP_ENTERPRISE === 'true';
export const REACT_APP_VENDOR = process.env.REACT_APP_VENDOR === 'true';
export const REACT_APP_IGNORE_AUTH =
  process.env.REACT_APP_IGNORE_AUTH === 'true';
export const REACT_APP_FIREBASE_PRODUCTION =
  process.env.REACT_APP_FIREBASE_PRODUCTION === 'true';

export const {
  REACT_APP_VERSION,
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID,
  REACT_APP_SIGN_IN_URL,
  NODE_ENV
} = process.env;