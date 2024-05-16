import { UserImportRecord } from 'firebase-admin/lib/auth/user-import-builder';

import admin from './admin';

interface GenerateSignInWithEmailLinkArgs {
  email: string;
  url: string;
}
export const generateSignInWithEmailLink = (
  args: GenerateSignInWithEmailLinkArgs
) =>
  admin.auth().generateSignInWithEmailLink(args.email, {
    url: args.url,
    handleCodeInApp: true
  });

interface GeneratePasswordResetLinkArgs {
  email: string;
  url: string;
}
export const generatePasswordResetLink = (
  args: GeneratePasswordResetLinkArgs
) =>
  admin.auth().generatePasswordResetLink(args.email, {
    url: args.url,
    handleCodeInApp: true
  });

export const updateCustomClaims = async (
  uid: string,
  customUserClaims: object
) => {
  const user = await admin.auth().getUser(uid);
  await admin.auth().setCustomUserClaims(uid, {
    ...user.customClaims,
    ...customUserClaims
  });
};

export const createUser = (user: UserImportRecord) =>
  admin.auth().importUsers([user]);

export const deleteUser = (uid: string) => admin.auth().deleteUser(uid);