import { FirebaseApp } from '@firebase/app';
import { User } from 'firebase/auth';

import { currentUrl } from '../../helpers/browserHelper';
import {
  onAuthStateChanged as _onAuthStateChanged,
  signOut as _signOut,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  configureEmailAndPassword as _configureEmailAndPassword,
  isSignInWithEmailLink as _isSignInWithEmailLink,
  signInWithEmailLink as _signInWithEmailLink,
  sendSignInLinkToEmail as _sendSignInLinkToEmail
} from '../../helpers/firebaseAuthHelper';
import { fetchDoc } from '../../helpers/firestoreHelper';
import { vendorUserDocRef } from '../../refs';
import {
  castToVendorUser,
  SendVerificationVendorEmailArgs,
  VendorUser
} from '../../types';
import { callFirebaseFunction } from '../../utils/callFirebaseFunction';
import { functionNames } from '../../utils/functionNames';

interface OnAuthStateChangedArgs {
  callbackNotAuthenticated: () => Promise<void>;
  callbackBeforeSigningUp: (user: User) => Promise<void>;
  callbackAuthenticated: (user: User, vendorUser: VendorUser) => Promise<void>;
}

export const vendorAuthRepository = (app: FirebaseApp) => {
  const onAuthStateChanged = (args: OnAuthStateChangedArgs) =>
    _onAuthStateChanged(app, async (user) => {
      const {
        callbackNotAuthenticated,
        callbackBeforeSigningUp,
        callbackAuthenticated
      } = args;
      if (!user) {
        await callbackNotAuthenticated();
        return;
      }
      const { uid } = user;
      const idTokenResult = await user.getIdTokenResult(true);
      const { vendorId, enterpriseId, admin } = idTokenResult.claims;
      // vendor 以外ならログアウト
      if (typeof enterpriseId === 'string' || admin) {
        await signOut();
        await callbackNotAuthenticated();
        return;
      }
      if (typeof vendorId !== 'string') {
        await callbackBeforeSigningUp(JSON.parse(JSON.stringify(user)));
        return;
      }
      const docSnap = await fetchDoc(vendorUserDocRef(app, vendorId, uid));
      const vendorUser = castToVendorUser(docSnap.data());
      if (!vendorUser) {
        await signOut();
        await callbackNotAuthenticated();
        return;
      }
      await callbackAuthenticated(JSON.parse(JSON.stringify(user)), vendorUser);
    });
  const signOut = () => _signOut(app);
  const createUserWithEmailAndPassword = (email: string, password: string) =>
    _createUserWithEmailAndPassword(app, email, password);
  const signInWithEmailAndPassword = (email: string, password: string) =>
    _signInWithEmailAndPassword(app, email, password);
  const sendPasswordResetEmail = (email: string, url: string) =>
    _sendPasswordResetEmail(app, email, url);
  const configureEmailAndPassword = (email: string, password: string) =>
    _configureEmailAndPassword(app, email, password);
  const isSignInWithEmailLink = () => _isSignInWithEmailLink(app, currentUrl());
  const signInWithEmailLink = async (email: string) => {
    if (!isSignInWithEmailLink()) return null;
    const credential = await _signInWithEmailLink(app, email, currentUrl());
    return credential;
  };
  const sendSignInLinkToEmail = async (email: string, url: string) => {
    await _sendSignInLinkToEmail(app, email, url);
  };
  const sendVerificationEmail = async (email: string, url: string) => {
    const res = await callFirebaseFunction<SendVerificationVendorEmailArgs>(
      app,
      functionNames.sendVerificationVendorEmail,
      { email, url }
    );
    return res;
  };

  return {
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    configureEmailAndPassword,
    isSignInWithEmailLink,
    signInWithEmailLink,
    sendSignInLinkToEmail,
    sendVerificationEmail
  };
};