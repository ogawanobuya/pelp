export const enterpriseUserGroupsCollectionPath = '/enterpriseUserGroups';

export const enterpriseUserGroupDocPath = (enterpriseId: string) =>
  `${enterpriseUserGroupsCollectionPath}/${enterpriseId}`;

export const enterpriseUsersCollectionPath = (enterpriseId: string) =>
  `${enterpriseUserGroupDocPath(enterpriseId)}/users`;

export const enterpriseUserDocPath = (
  enterpriseId: string,
  authUserId: string
) => `${enterpriseUsersCollectionPath(enterpriseId)}/${authUserId}`;