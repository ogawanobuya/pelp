import { Timestamp as ClientTimestamp } from 'firebase/firestore';

export type Timestamp = ClientTimestamp | AdminTimestamp;

export const isTimestamp = (t: any) =>
  t instanceof ClientTimestamp || isAdminTimestamp(t);

interface AdminTimestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
  toMillis(): number;
  isEqual(other: AdminTimestamp): boolean;
  valueOf(): string;
}

const isAdminTimestamp = (t: any) => {
  if (typeof t.seconds !== 'number') return false;
  if (typeof t.nanoseconds !== 'number') return false;
  if (typeof t.toDate !== 'function') return false;
  if (typeof t.toMillis !== 'function') return false;
  if (typeof t.isEqual !== 'function') return false;
  if (typeof t.valueOf !== 'function') return false;
  return true;
};