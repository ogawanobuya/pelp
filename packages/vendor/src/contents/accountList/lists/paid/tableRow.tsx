import { Box, Button, TableCell, TableRow, Typography } from '@mui/material';
import Label from 'src/components/label';
import { currencyUnit } from 'src/utils/functions/currencyUnit';

import AccountListConfirmModal from '../../components/cofirmModal';

import {
  useConfirmAccount,
  useIsOpenConfirmModalState,
  useShowedAccountsValue
} from './localStates';

interface PaidAccountListTableRowProps {
  index: number; // local index (0 ~ rowsPerPAge-1)
}
const PaidAccountListTableRow = (props: PaidAccountListTableRowProps) => {
  const { index } = props;

  const account = useShowedAccountsValue()[index];
  const [open, setOpen] = useIsOpenConfirmModalState();
  const confirm = useConfirmAccount();

  const newPayDate = account.newPayDate ? account.newPayDate.toDate() : null;
  const discountRate = account.discountRate
    ? (account.discountRate * 100).toFixed(3)
    : '処理中';

  return (
    <>
      <TableRow hover key={account.id}>
        <TableCell align="center">
          <Button onClick={() => setOpen(true)}>
            <Box width={120} sx={{ p: 0, m: 0 }}>
              入金確認完了
            </Box>
          </Button>
        </TableCell>
        <TableCell>
          <Label color="warning">入金確認待ち</Label>
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
            {account.discountAmount && account.vendorCommission
              ? `${currencyUnit(account.currency)} ${
                  account.discountAmount + account.vendorCommission
                }`
              : '処理中'}
          </Typography>
        </TableCell>
      </TableRow>
      <AccountListConfirmModal
        open={open}
        handleClose={() => setOpen(false)}
        onClick={() => confirm(account)}
      />
    </>
  );
};

export default PaidAccountListTableRow;