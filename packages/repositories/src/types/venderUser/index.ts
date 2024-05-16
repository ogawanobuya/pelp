import { Timestamp, isTimestamp } from '../../utils/timestamp';

export interface VendorUserGroup {
  id: string;
  emails: Array<string>;
  name: string;
  createdAt: Timestamp;
  lastEditedAt: Timestamp;
}

export const isVendorUserGroup = (user: any) => {
  const { id, emails, name, createdAt, lastEditedAt } = user;
  if (typeof id !== 'string') return false;
  if (typeof name !== 'string') return false;
  if (!Array.isArray(emails)) return false;
  if (!emails.every((item) => typeof item === 'string')) return false;
  if (!isTimestamp(createdAt)) return false;
  if (!isTimestamp(lastEditedAt)) return false;
  return true;
};

export const castToVendorUserGroup = (group: any): VendorUserGroup | null => {
  if (isVendorUserGroup(group)) return group as VendorUserGroup;
  return null;
};

export interface VendorUser {
  id: string;
  email: string;
  vendorId: string;
  vendorName: string;
  vendorEmails: Array<string>;
  isGroupAdmin: boolean;
  role: Array<string>;
  createdAt: Timestamp;
  lastEditedAt: Timestamp;
}

export const isVendorUser = (user: any) => {
  const {
    id,
    email,
    vendorId,
    vendorName,
    vendorEmails,
    isGroupAdmin,
    role,
    createdAt,
    lastEditedAt
  } = user;
  if (typeof id !== 'string') return false;
  if (typeof email !== 'string') return false;
  if (typeof vendorId !== 'string') return false;
  if (typeof vendorName !== 'string') return false;
  if (!Array.isArray(vendorEmails)) return false;
  if (!vendorEmails.every((item) => typeof item === 'string')) return false;
  if (typeof isGroupAdmin !== 'boolean') return false;
  if (!Array.isArray(role)) return false;
  if (!role.every((item) => typeof item === 'string')) return false;
  if (!isTimestamp(createdAt)) return false;
  if (!isTimestamp(lastEditedAt)) return false;
  return true;
};

export const castToVendorUser = (user: any): VendorUser | null => {
  if (isVendorUser(user)) return user as VendorUser;
  return null;
};