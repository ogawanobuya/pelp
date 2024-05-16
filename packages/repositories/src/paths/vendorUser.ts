export const vendorUserGroupsCollectionPath = '/vendorUserGroups';

export const vendorUserGroupDocPath = (vendorId: string) =>
  `${vendorUserGroupsCollectionPath}/${vendorId}`;

export const vendorUsersCollectionPath = (vendorId: string) =>
  `${vendorUserGroupDocPath(vendorId)}/users`;

export const vendorUserDocPath = (vendorId: string, authUserId: string) =>
  `${vendorUsersCollectionPath(vendorId)}/${authUserId}`;