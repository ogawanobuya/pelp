import { Timestamp, isTimestamp } from '../../utils/timestamp';

export interface EnterpriseUserGroup {
  id: string;
  emails: Array<string>;
  name: string;
  wacc: number;
  createdAt: Timestamp;
  lastEditedAt: Timestamp;
}

export const isEnterpriseUserGroup = (user: any) => {
  const { id, emails, name, wacc, createdAt, lastEditedAt } = user;
  if (typeof id !== 'string') return false;
  if (typeof name !== 'string') return false;
  if (!Array.isArray(emails)) return false;
  if (!emails.every((item) => typeof item === 'string')) return false;
  if (typeof wacc !== 'number') return false;
  if (!isTimestamp(createdAt)) return false;
  if (!isTimestamp(lastEditedAt)) return false;
  return true;
};

export const castToEnterpriseUserGroup = (
  group: any
): EnterpriseUserGroup | null => {
  if (isEnterpriseUserGroup(group)) return group as EnterpriseUserGroup;
  return null;
};

export interface EnterpriseUser {
  id: string;
  email: string;
  enterpriseId: string;
  enterpriseName: string;
  enterpriseEmails: Array<string>;
  isGroupAdmin: boolean;
  role: Array<string>;
  createdAt: Timestamp;
  lastEditedAt: Timestamp;
}

export const isEnterpriseUser = (user: any) => {
  const {
    id,
    email,
    enterpriseId,
    enterpriseName,
    enterpriseEmails,
    isGroupAdmin,
    role,
    createdAt,
    lastEditedAt
  } = user;
  if (typeof id !== 'string') return false;
  if (typeof email !== 'string') return false;
  if (typeof enterpriseId !== 'string') return false;
  if (typeof enterpriseName !== 'string') return false;
  if (!Array.isArray(enterpriseEmails)) return false;
  if (!enterpriseEmails.every((item) => typeof item === 'string')) return false;
  if (typeof isGroupAdmin !== 'boolean') return false;
  if (!Array.isArray(role)) return false;
  if (!role.every((item) => typeof item === 'string')) return false;
  if (!isTimestamp(createdAt)) return false;
  if (!isTimestamp(lastEditedAt)) return false;
  return true;
};

export const castToEnterpriseUser = (user: any): EnterpriseUser | null => {
  if (isEnterpriseUser(user)) return user as EnterpriseUser;
  return null;
};