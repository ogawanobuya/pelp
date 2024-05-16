import { format } from 'date-fns';
import { Timestamp } from 'firebase-admin/firestore';

import { Account } from '../../pelp-repositories';
import { currencyUnit } from '../currencyUnit';

const timestampToString = (timestamp: Timestamp | undefined) => {
  if (!timestamp) return '';
  return format(timestamp.toDate(), 'yyyy/MM/dd');
};

export interface AccountTemplateData {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  enterpriseEmails: Array<string>;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  amount: string;
  currency: string;
  discountRate: number;
  discountAmount: string;
  amountAfterDiscount: string;
  vendorCommission: string;
  originalDueDate: string;
  newPayDate: string;
  payDate: string;
  activatedAt?: string;
  adjustedAt?: string;
  paidAt?: string;
  confirmedAt?: string;
  status: string;
  statusNumber: number;
  userConfiguredId: string;
  createdAt: string;
  lastEditedAt: string;
}

export const convertToAccountTemplateData = (
  account: Account
): AccountTemplateData => {
  return {
    id: account.id,
    enterpriseId: account.enterpriseId,
    enterpriseName: account.enterpriseName,
    enterpriseEmails: account.enterpriseEmails,
    vendorId: account.vendorId ?? '',
    vendorName: account.vendorName,
    vendorEmail: account.vendorEmail,
    amount: account.amount.toLocaleString(),
    currency: currencyUnit(account.currency),
    discountRate: account.discountRate ?? 0,
    discountAmount: account.discountAmount?.toLocaleString() ?? '0',
    amountAfterDiscount: account.amountAfterDiscount?.toLocaleString() ?? '0',
    vendorCommission: account.vendorCommission?.toLocaleString() ?? '0',
    originalDueDate: timestampToString(account.originalDueDate),
    newPayDate: timestampToString(account.newPayDate),
    payDate: timestampToString(account.payDate),
    activatedAt: timestampToString(account.activatedAt),
    adjustedAt: timestampToString(account.adjustedAt),
    paidAt: timestampToString(account.paidAt),
    confirmedAt: timestampToString(account.confirmedAt),
    status: account.status,
    statusNumber: account.statusNumber,
    userConfiguredId: account.userConfiguredId ?? '',
    createdAt: timestampToString(account.createdAt),
    lastEditedAt: timestampToString(account.lastEditedAt)
  };
};