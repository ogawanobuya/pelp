import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { subDays } from 'date-fns';
import Label from 'src/components/label';
import { currencyUnit } from 'src/utils/functions/currencyUnit';

import AccountListActivateModal from '../../components/activateModal';

import {
  useActivateAccount,
  useIsGroupAdminValue,
  useIsOpenActivateModalState,
  useShowedAccountsValue
} from './localStates';

interface InactiveAccountListTableRowProps {
  index: number;
}
const InactiveAccountListTableRow = (
  props: InactiveAccountListTableRowProps
) => {
  const { index } = props;

  const isGroupAdmin = useIsGroupAdminValue();
  const account = useShowedAccountsValue()[index];
  const [open, setOpen] = useIsOpenActivateModalState();
  const activate = useActivateAccount();

  const originalDueDate = account.originalDueDate
    ? account.originalDueDate.toDate()
    : null;
  const newPayDate = account.newPayDate ? account.newPayDate.toDate() : null;
  const discountRate = account.discountRate
    ? (account.discountRate * 100).toFixed(3)
    : '処理中';
  const activatingDeadline = account.newPayDate
    ? subDays(account.newPayDate.toDate(), 3)
    : null;

  return (
    <>
      <TableRow hover key={account.id}>
        <TableCell align="center">
          <Button sx={{ p: 0, m: 0 }} onClick={() => setOpen(true)}>
            オファー送信
          </Button>
        </TableCell>
        <TableCell>
          <Label color="secondary">オファー待ち</Label>
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
            {originalDueDate
              ? `${originalDueDate.getFullYear()}年${
                  originalDueDate.getMonth() + 1
                }月${originalDueDate.getDate()}日`
              : ''}
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
              : ''}
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
            {`${activatingDeadline.getFullYear()}年${
              activatingDeadline.getMonth() + 1
            }月${activatingDeadline.getDate()}日`}
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
      <AccountListActivateModal
        open={open}
        handleClose={() => setOpen(false)}
        onClick={() => activate(account.id)}
        isGroupAdmin={isGroupAdmin}
      />
    </>
  );
};

export default InactiveAccountListTableRow;