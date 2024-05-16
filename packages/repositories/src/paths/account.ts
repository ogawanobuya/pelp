export const accountsCollectionPath = '/accounts';

export const accountDocPath = (accountId: string) =>
  `${accountsCollectionPath}/${accountId}`;

export const indicesCollectionPath = '/indices';

export const indexDocPath = (enterpriseId: string) =>
  `${indicesCollectionPath}/${enterpriseId}`;

export const accountindicesCollectionPath = (enterpriseId: string) =>
  `${indexDocPath(enterpriseId)}/accountIndices`;

export const accountindexDocPath = (
  enterpriseId: string,
  accountIndex: string
) => `${accountindicesCollectionPath(enterpriseId)}/${accountIndex}`;