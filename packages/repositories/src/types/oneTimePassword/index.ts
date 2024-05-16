import { isTimestamp, Timestamp } from '../../utils/timestamp';

export interface OneTimePassword {
  email: string;
  oneTimePassword: string;
  verified: boolean;
  createdAt: Timestamp;
  lastEditedAt: Timestamp;
}

export const isOneTimePassword = (data: any) => {
  const { email, oneTimePassword, verified, createdAt, lastEditedAt } = data;
  if (typeof email !== 'string') return false;
  if (typeof oneTimePassword !== 'string') return false;
  if (typeof verified !== 'boolean') return false;
  if (!isTimestamp(createdAt)) return false;
  if (!isTimestamp(lastEditedAt)) return false;
  return true;
};

export const castToOneTimePassword = (data: any) => {
  if (isOneTimePassword(data)) return data as OneTimePassword;
  return null;
};
