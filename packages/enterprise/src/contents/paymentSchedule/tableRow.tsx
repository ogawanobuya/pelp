import { Box, TableCell, TableRow, Typography } from '@mui/material';
import { AccountCurrency, AccountStatus } from 'pelp-repositories/src';
import Label from 'src/components/label';

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

interface StatusLabelProps {
  status: AccountStatus;
}
const StatusLabel = (props: StatusLabelProps) => {
  const { status } = props;

  if (status === 'inactive')
    return <Label color="secondary">オファー待ち</Label>;
  if (status === 'active') return <Label color="primary">早払い待ち</Label>;
  if (status === 'expired')
    return <Label color="secondary">前払い日超過</Label>;
  if (status === 'adjusted') return <Label color="primary">早払い待ち</Label>;

  return <Box />;
};

interface PaymentScheduleTableRowProps {
  index: number;
}
const PaymentScheduleTableRow = (props: PaymentScheduleTableRowProps) => {
  const { index } = props;

  const account = useShowedAccountsValue()[index];

  const payDate = account.payDate.toDate();
  const amount =
    account.status === 'adjusted'
      ? account.amountAfterDiscount ?? 0
      : account.amount;

  return (
    <TableRow hover key={account.id}>
      <TableCell>
        <StatusLabel status={account.status} />
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {account.vendorName}
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
          {`${payDate.getFullYear()}年${
            payDate.getMonth() + 1
          }月${payDate.getDate()}日`}
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
          {`${currencyUnit(account.currency)} ${amount.toLocaleString()}`}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default PaymentScheduleTableRow;