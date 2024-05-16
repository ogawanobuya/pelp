import { FirebaseApp } from '@firebase/app';
import {
  addDoc as _addDoc,
  doc as _doc,
  collection as _collection,
  DocumentData,
  updateDoc as _updateDoc,
  WithFieldValue,
  deleteDoc as _deleteDoc,
  writeBatch as _writeBatch,
  getDoc
} from '@firebase/firestore';
import {
  CollectionReference,
  DocumentReference,
  getDocs,
  QueryConstraint,
  runTransaction as _runTransaction,
  Transaction,
  query,
  initializeFirestore,
  UpdateData
} from 'firebase/firestore';

const firestore = (app: FirebaseApp) =>
  // eslint-disable-next-line no-process-env
  process.env.NODE_ENV === 'production'
    ? initializeFirestore(app, {
        ignoreUndefinedProperties: true,
        experimentalForceLongPolling: false
      })
    : initializeFirestore(app, {
        ignoreUndefinedProperties: true,
        experimentalForceLongPolling: true
      });

export const docRef = (app: FirebaseApp, docPath: string) =>
  _doc(firestore(app), docPath);

export const collectionRef = (app: FirebaseApp, collectionPath: string) =>
  _collection(firestore(app), collectionPath);

export interface SetBatchItem<T extends Object> {
  doc: DocumentReference<DocumentData>;
  data: WithFieldValue<T>;
}
export const setBatch = async <T extends Object>(
  app: FirebaseApp,
  batchItems: Array<SetBatchItem<T>>
): Promise<void> => {
  const batch = _writeBatch(firestore(app));
  batchItems.forEach((item) => batch.set(item.doc, item.data));
  await batch.commit();
};

export interface UpdateBatchItem<T extends Object> {
  doc: DocumentReference<DocumentData>;
  data: UpdateData<T>;
}
export const updateBatch = async <T extends Object>(
  app: FirebaseApp,
  batchItems: Array<UpdateBatchItem<T>>
): Promise<void> => {
  const batch = _writeBatch(firestore(app));
  batchItems.forEach((item) => batch.update(item.doc, item.data));
  await batch.commit();
};

export const addDoc = (
  collection: CollectionReference<DocumentData>,
  data: DocumentData
) => _addDoc(collection, data);

export const updateDoc = (
  doc: DocumentReference<DocumentData>,
  data: DocumentData
) => _updateDoc(doc, data);

export const runTransaction = async (
  app: FirebaseApp,
  update: (transaction: Transaction) => Promise<void>
) => _runTransaction(firestore(app), update);

export const deleteDoc = (doc: DocumentReference<DocumentData>) =>
  _deleteDoc(doc);

export const fetchDoc = (doc: DocumentReference<DocumentData>) => getDoc(doc);

export const fetchDocs = (
  collection: CollectionReference<DocumentData>,
  queryConstraints: QueryConstraint[]
) => getDocs(query(collection, ...queryConstraints));