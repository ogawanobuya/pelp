import { FirebaseApp } from '@firebase/app';
import {
  getFunctions,
  httpsCallable as _httpsCallable
} from 'firebase/functions';

const functions = (app: FirebaseApp) => getFunctions(app, 'asia-northeast1');

export const httpsCallable = <Req, Res>(app: FirebaseApp, name: string) =>
  _httpsCallable<Req, Res>(functions(app), name);