import { FirebaseApp } from '@firebase/app';
import {
  getAuth,
  onAuthStateChanged as _onAuthStateChanged,
  signOut as _signOut,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  verifyPasswordResetCode as _verifyPasswordResetCode,
  NextOrObserver,
  isSignInWithEmailLink as _isSignInWithEmailLink,
  confirmPasswordReset as _confirmPasswordReset,
  signInWithEmailLink as _signInWithEmailLink,
  sendSignInLinkToEmail as _sendSignInLinkToEmail,
  EmailAuthProvider,
  linkWithCredential,
  User
} from 'firebase/auth';

const auth = (app: FirebaseApp) => getAuth(app);

export const onAuthStateChanged = (
  app: FirebaseApp,
  nextOrObserver: NextOrObserver<User>
) => _onAuthStateChanged(auth(app), nextOrObserver);

export const signOut = (app: FirebaseApp) => _signOut(auth(app));

export const createUserWithEmailAndPassword = (
  app: FirebaseApp,
  email: string,
  password: string
) => _createUserWithEmailAndPassword(auth(app), email, password);

export const configureEmailAndPassword = (
  app: FirebaseApp,
  email: string,
  password: string
) => {
  const credential = EmailAuthProvider.credential(email, password);
  const user = auth(app).currentUser;
  if (!user) return null;
  return linkWithCredential(user, credential);
};

export const signInWithEmailAndPassword = (
  app: FirebaseApp,
  email: string,
  password: string
) => _signInWithEmailAndPassword(auth(app), email, password);

export const sendPasswordResetEmail = (
  app: FirebaseApp,
  email: string,
  url: string
) => _sendPasswordResetEmail(auth(app), email, { url });

export const verifyPasswordResetCode = (app: FirebaseApp, oobCode: string) =>
  _verifyPasswordResetCode(auth(app), oobCode);

export const confirmPasswordReset = (
  app: FirebaseApp,
  oobCode: string,
  password: string
) => _confirmPasswordReset(auth(app), oobCode, password);

export const isSignInWithEmailLink = (app: FirebaseApp, emailLink: string) =>
  _isSignInWithEmailLink(auth(app), emailLink);

export const signInWithEmailLink = async (
  app: FirebaseApp,
  email: string,
  emailLink: string
) => _signInWithEmailLink(auth(app), email, emailLink);

export const sendSignInLinkToEmail = (
  app: FirebaseApp,
  email: string,
  url: string
) =>
  _sendSignInLinkToEmail(auth(app), email, {
    url,
    handleCodeInApp: true
  });