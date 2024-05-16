import { AccountStatus } from '../pelp-repositories';

export const generateAccountStatusNumber = (status: AccountStatus) => {
  if (status === 'inactive') return 0;
  if (status === 'active') return 1;
  if (status === 'adjusted') return 2;
  if (status === 'paid') return 3;
  if (status === 'confirmed') return 4;
  if (status === 'expired') return 5;
  if (status === 'outdated') return 6;
  return 7;
};