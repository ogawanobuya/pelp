import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface GenerateAccountIndexArgs {
  enterpriseId: string;
  vendorEmail: string;
  amount: number;
  originalDueDate: Timestamp;
  userConfiguredId?: string;
}
export const generateAccountIndex = (args: GenerateAccountIndexArgs) => {
  const {
    enterpriseId,
    vendorEmail,
    amount,
    originalDueDate,
    userConfiguredId
  } = args;
  // see: https://cloud.google.com/firestore/quotas#collections_documents_and_fields
  const email = vendorEmail.replace('/', ''); // '/' must not be included
  const date = format(originalDueDate.toDate(), 'yyyymmdd');
  return [enterpriseId, email, amount.toFixed(0), date, userConfiguredId]
    .filter((s) => s) // where not falsy
    .join('__');
};