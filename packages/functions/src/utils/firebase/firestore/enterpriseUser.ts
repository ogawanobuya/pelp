import {
  castToEnterpriseUser,
  castToEnterpriseUserGroup,
  EnterpriseUser,
  enterpriseUserGroupDocPath,
  enterpriseUsersCollectionPath
} from '../../../pelp-repositories';
import admin from '../admin';

export const fetchEnterpriseUserGroup = async (enterpriseId: string) => {
  const docSnap = await admin
    .firestore()
    .doc(enterpriseUserGroupDocPath(enterpriseId))
    .get();
  const enterpriseUserGroup = castToEnterpriseUserGroup(docSnap.data());
  return enterpriseUserGroup;
};

export const fetchAllEnterpriseUsers = async (enterpriseId: string) => {
  const querySnap = await admin
    .firestore()
    .collection(enterpriseUsersCollectionPath(enterpriseId))
    .get();
  const enterpriseUsers = querySnap.docs
    .map((doc) => castToEnterpriseUser(doc.data()))
    .filter((c) => c) as Array<EnterpriseUser>;
  return enterpriseUsers;
};