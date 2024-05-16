import { Checkbox, TableCell, TableRow, Typography } from '@mui/material';
import Label from 'src/components/label';
import { currencyUnit } from 'src/utils/functions/currencyUnit';

import {
  rowsPerPage,
  useCheckedValue,
  usePageState,
  useShowedAccountsValue,
  useUpdateChecked
} from './localStates';

interface AdjustedAccountListTableRowProps {
  index: number; // local index (0 ~ rowsPerPAge-1)
}
const AdjustedAccountListTableRow = (
  props: AdjustedAccountListTableRowProps
) => {
  const { index } = props;

  const account = useShowedAccountsValue()[index];

  const [page] = usePageState();
  const checked = useCheckedValue();
  const updateChecked = useUpdateChecked();
  const isCheckedRow = checked[page * rowsPerPage + index];

  const newPayDate = account.newPayDate ? account.newPayDate.toDate() : null;
  const discountRate = account.discountRate
    ? (account.discountRate * 100).toFixed(3)
    : '処理中';

  return (
    <TableRow hover key={account.id}>
      <TableCell>
        {account.newPayDate ? (
          <Checkbox
            color="primary"
            checked={isCheckedRow}
            onChange={(e, c) => updateChecked(page * rowsPerPage + index, c)}
          />
        ) : null}
      </TableCell>
      <TableCell>
        <Label color="primary">早払い待ち</Label>
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
          )} ${account.amountAfterDiscount.toLocaleString()}`}
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
          {account.vendorCommission
            ? `${currencyUnit(
                account.currency
              )} ${account.vendorCommission.toLocaleString()}`
            : '処理中'}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default AdjustedAccountListTableRow;