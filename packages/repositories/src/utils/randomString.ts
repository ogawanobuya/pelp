import { customAlphabet } from 'nanoid/non-secure';

export const randomString = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  20
);