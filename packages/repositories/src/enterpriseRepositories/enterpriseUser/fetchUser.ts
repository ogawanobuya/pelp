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
import { enterpriseUserDocRef, enterpriseUsersCollectionRef } from '../../refs';
import { castToEnterpriseUser, EnterpriseUser } from '../../types';

interface FetchEnterpriseUserArgs {
  app: FirebaseApp;
  enterpriseId: string;
  authUserId: string;
}
export const fetchEnterpriseUser = async (args: FetchEnterpriseUserArgs) => {
  const { app, enterpriseId, authUserId } = args;
  const docSnap = await fetchDoc(
    enterpriseUserDocRef(app, enterpriseId, authUserId)
  );
  return castToEnterpriseUser(docSnap.data());
};

interface FetchEnterpriseUsersArgs {
  app: FirebaseApp;
  enterpriseId: string;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}
export interface FetchEnterpriseUsersRes {
  limit: number;
  fetched: number;
  valid: number;
  invalid: number;
  users: Array<EnterpriseUser>;
  snapshots: Array<QueryDocumentSnapshot<DocumentData>>;
}
export const fetchEnterpriseUsers = async (
  args: FetchEnterpriseUsersArgs
): Promise<FetchEnterpriseUsersRes> => {
  const { app, enterpriseId, startAfter, limit = 25 } = args;
  const querySnap = await fetchDocs(
    enterpriseUsersCollectionRef(app, enterpriseId),
    [
      startAfter ? _startAfter(startAfter) : null,
      limitToLast(limit),
      orderBy('createdAt')
    ].filter((c) => c) as Array<QueryConstraint>
  );
  const { docs } = querySnap;
  const users = docs
    .map((doc) => castToEnterpriseUser(doc.data()))
    .filter((user) => user) as Array<EnterpriseUser>;
  return {
    limit,
    fetched: docs.length,
    valid: users.length,
    invalid: docs.length - users.length,
    users,
    snapshots: JSON.parse(JSON.stringify(docs))
  };
};