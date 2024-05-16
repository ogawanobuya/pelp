import { TableCell, TableRow, Typography } from '@mui/material';
import Label from 'src/components/label';
import { currencyUnit } from 'src/utils/functions/currencyUnit';

import { useShowedAccountsValue } from './localStates';

interface ActiveAccountListTableRowProps {
  index: number; // local index (0 ~ rowsPerPAge-1)
}
const ActiveAccountListTableRow = (props: ActiveAccountListTableRowProps) => {
  const { index } = props;

  const account = useShowedAccountsValue()[index];

  const originalDueDate = account.originalDueDate.toDate();
  const newPayDate = account.newPayDate ? account.newPayDate.toDate() : null;
  const discountRate = account.discountRate
    ? (account.discountRate * 100).toFixed(3)
    : '処理中';

  return (
    <TableRow hover key={account.id}>
      <TableCell>
        <Label color="info">オファー</Label>
      </TableCell>
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
          {`${originalDueDate.getFullYear()}年${
            originalDueDate.getMonth() + 1
          }月${originalDueDate.getDate()}日`}
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
          {`${currencyUnit(
            account.currency
          )} ${account.amount.toLocaleString()}`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
          sx={{ textDecoration: 'underline' }}
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
          {account.discountAmount && account.vendorCommission
            ? `${currencyUnit(account.currency)} ${
                account.discountAmount + account.vendorCommission
              }`
            : '処理中'}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default ActiveAccountListTableRow;