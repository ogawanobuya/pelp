import { FirebaseApp } from '@firebase/app';
import { User } from '@firebase/auth';

import {
  onAuthStateChanged as _onAuthStateChanged,
  signOut as _signOut,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  sendPasswordResetEmail as _sendPasswordResetEmail
} from '../../helpers/firebaseAuthHelper';

interface OnAuthStateChangedArgs {
  callbackNotAuthenticated: () => Promise<void>;
  callbackAuthenticated: (user: User) => Promise<void>;
}

export const adminAuthRepository = (app: FirebaseApp) => {
  const onAuthStateChanged = (args: OnAuthStateChangedArgs) =>
    _onAuthStateChanged(app, async (user) => {
      if (!user) {
        await args.callbackNotAuthenticated();
        return;
      }

      const idTokenResult = await user.getIdTokenResult(true);
      const { admin } = idTokenResult.claims;
      if (!admin) {
        await signOut();
        await args.callbackNotAuthenticated();
        return;
      }

      await args.callbackAuthenticated(JSON.parse(JSON.stringify(user)));
    });
  const signOut = () => _signOut(app);
  const signInWithEmailAndPassword = (email: string, password: string) =>
    _signInWithEmailAndPassword(app, email, password);
  const sendPasswordResetEmail = (email: string, url: string) =>
    _sendPasswordResetEmail(app, email, url);

  return {
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
  };
};