import { FirebaseApp } from '@firebase/app';
import { User } from '@firebase/auth';

import {
  onAuthStateChanged as _onAuthStateChanged,
  signOut as _signOut,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  sendPasswordResetEmail as _sendPasswordResetEmail
} from '../../helpers/firebaseAuthHelper';
import { fetchDoc } from '../../helpers/firestoreHelper';
import { enterpriseUserDocRef } from '../../refs';
import { castToEnterpriseUser, EnterpriseUser } from '../../types';

interface OnAuthStateChangedArgs {
  callbackNotAuthenticated: () => Promise<void>;
  callbackAuthenticated: (
    user: User,
    enterpriseUser: EnterpriseUser
  ) => Promise<void>;
}

export const enterpriseAuthRepository = (app: FirebaseApp) => {
  const onAuthStateChanged = (args: OnAuthStateChangedArgs) =>
    _onAuthStateChanged(app, async (user) => {
      const { callbackNotAuthenticated, callbackAuthenticated } = args;
      if (!user) {
        await callbackNotAuthenticated();
        return;
      }
      const { uid } = user;
      const idTokenResult = await user.getIdTokenResult(true);
      const { enterpriseId } = idTokenResult.claims;
      if (typeof enterpriseId !== 'string') {
        await callbackNotAuthenticated();
        return;
      }
      const docSnap = await fetchDoc(
        enterpriseUserDocRef(app, enterpriseId, uid)
      );
      const enterpriseUser = castToEnterpriseUser(docSnap.data());
      if (!enterpriseUser) {
        await signOut();
        await callbackNotAuthenticated();
        return;
      }
      // ディープコピーをコールバックに渡す
      await callbackAuthenticated(
        JSON.parse(JSON.stringify(user)),
        enterpriseUser
      );
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