import { TableCell, TableRow, Typography } from '@mui/material';
import { AccountCurrency } from 'pelp-repositories/src';

import { useShowedAccountsValue } from './localStates';

const currencyUnit = (accountCurrency: AccountCurrency) => {
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

interface ConfirmedAccountListTableRowProps {
  index: number;
}
const ConfirmedAccountListTableRow = (
  props: ConfirmedAccountListTableRowProps
) => {
  const { index } = props;

  const account = useShowedAccountsValue()[index];

  const originalDueDate = account.originalDueDate
    ? account.originalDueDate.toDate()
    : null;
  const newPayDate = account.newPayDate ? account.newPayDate.toDate() : null;
  const discountRate = account.discountRate
    ? (account.discountRate * 100).toFixed(3)
    : '処理中';

  return (
    <TableRow hover key={account.id}>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {account.enterpriseName}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {originalDueDate
            ? `${originalDueDate.getFullYear()}年${
                originalDueDate.getMonth() + 1
              }月${originalDueDate.getDate()}日`
            : null}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {newPayDate
            ? `${newPayDate.getFullYear()}年${
                newPayDate.getMonth() + 1
              }月${newPayDate.getDate()}日`
            : null}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {account.amountAfterDiscount
            ? `${currencyUnit(
                account.currency
              )} ${account.amountAfterDiscount.toLocaleString()}`
            : '処理中'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {discountRate}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {account.discountAmount
            ? `${currencyUnit(
                account.currency
              )} ${account.discountAmount.toLocaleString()}`
            : '処理中'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {`${currencyUnit(
            account.currency
          )} ${account.amount.toLocaleString()}`}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default ConfirmedAccountListTableRow;