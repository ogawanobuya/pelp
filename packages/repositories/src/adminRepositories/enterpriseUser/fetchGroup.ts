import { FirebaseApp } from '@firebase/app';
import {
  DocumentData,
  DocumentSnapshot,
  startAfter as _startAfter,
  QueryConstraint,
  limitToLast,
  orderBy,
  QueryDocumentSnapshot
} from 'firebase/firestore';

import { fetchDocs } from '../../helpers/firestoreHelper';
import { enterpriseUserGroupsCollectionRef } from '../../refs';
import { castToEnterpriseUserGroup, EnterpriseUserGroup } from '../../types';

interface FetchEnterpriseUserGroupsArgs {
  app: FirebaseApp;
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}
export interface FetchEnterpriseUserGroupsRes {
  limit: number;
  fetched: number;
  valid: number;
  invalid: number;
  groups: Array<EnterpriseUserGroup>;
  snapshots: Array<QueryDocumentSnapshot<DocumentData>>;
}
export const fetchetchEnterpriseUserGroups = async (
  args: FetchEnterpriseUserGroupsArgs
): Promise<FetchEnterpriseUserGroupsRes> => {
  const { app, startAfter, limit = 25 } = args;
  const querySnap = await fetchDocs(
    enterpriseUserGroupsCollectionRef(app),
    [
      startAfter ? _startAfter(startAfter) : null,
      limitToLast(limit),
      orderBy('createdAt')
    ].filter((c) => c) as Array<QueryConstraint>
  );
  const { docs } = querySnap;
  const groups = docs
    .map((doc) => castToEnterpriseUserGroup(doc.data()))
    .filter((group) => group) as Array<EnterpriseUserGroup>;
  return {
    limit,
    fetched: docs.length,
    valid: groups.length,
    invalid: docs.length - groups.length,
    groups,
    snapshots: JSON.parse(JSON.stringify(docs))
  };
};