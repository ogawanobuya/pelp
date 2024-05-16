import { FirebaseApp } from '@firebase/app';
import {
  DocumentData,
  DocumentSnapshot,
  startAfter as _startAfter,
  QueryConstraint,
  limitToLast,
  QueryDocumentSnapshot,
  orderBy
} from 'firebase/firestore';

import { fetchDoc, fetchDocs } from '../../helpers/firestoreHelper';
import { vendorUserDocRef, vendorUsersCollectionRef } from '../../refs';
import { castToVendorUser, VendorUser } from '../../types';

interface FetchVendorUserArgs {
  app: FirebaseApp;
  vendorId: string;
  authUserId: string;
}
export const fetchVendorUser = async (args: FetchVendorUserArgs) => {
  const { app, vendorId, authUserId } = args;
  const docSnap = await fetchDoc(vendorUserDocRef(app, vendorId, authUserId));
  return castToVendorUser(docSnap.data());
};

interface FetchVendorUsersArgs {
  app: FirebaseApp;
  vendorId: string;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}
export interface FetchVendorUsersRes {
  limit: number;
  fetched: number;
  valid: number;
  invalid: number;
  users: Array<VendorUser>;
  snapshots: Array<QueryDocumentSnapshot<DocumentData>>;
}
export const fetchVendorUsers = async (
  args: FetchVendorUsersArgs
): Promise<FetchVendorUsersRes> => {
  const { app, vendorId, startAfter, limit = 25 } = args;
  const querySnap = await fetchDocs(
    vendorUsersCollectionRef(app, vendorId),
    [
      startAfter ? _startAfter(startAfter) : null,
      limitToLast(limit),
      orderBy('createdAt')
    ].filter((c) => c) as Array<QueryConstraint>
  );
  const { docs } = querySnap;
  const users = docs
    .map((doc) => castToVendorUser(doc.data()))
    .filter((user) => user) as Array<VendorUser>;
  return {
    limit,
    fetched: docs.length,
    valid: users.length,
    invalid: docs.length - users.length,
    users,
    snapshots: JSON.parse(JSON.stringify(docs))
  };
};