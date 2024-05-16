export const oneTimePasswordsCollectionPath = '/oneTimePasswords';

export const oneTimePasswordDocPath = (email: string) =>
  `${oneTimePasswordsCollectionPath}/${email}`;