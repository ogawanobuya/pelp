import { AccountCurrency } from 'pelp-repositories/src';

export const currencyUnit = (accountCurrency: AccountCurrency) => {
  switch (accountCurrency) {
    case 'jpy':
      return '¥';
    case 'usd':
      return '$';
    case 'eur':
      return '€';
    default:
      return '';
  }
};