import { Button, TableCell, TableRow, Typography } from '@mui/material';
import Label from 'src/components/label';
import { currencyUnit } from 'src/utils/functions/currencyUnit';

import AccountListDeleteModal from '../../components/deleteModal';
import AccountListEditModal from '../../components/editModal';

import {
  useReload,
  useIsOpenDeleteModalState,
  useIsOpenEditModalState,
  useShowedAccountsValue
} from './localStates';

interface InactiveAccountListTableRowProps {
  index: number;
}
const InactiveAccountListTableRow = (
  props: InactiveAccountListTableRowProps
) => {
  const { index } = props;

  const account = useShowedAccountsValue()[index];
  const [openEditModal, setOpenEditModal] = useIsOpenEditModalState(index);
  const [openDeleteModal, setOpenDeleteModal] =
    useIsOpenDeleteModalState(index);
  const reload = useReload();

  const originalDueDate = account.originalDueDate
    ? account.originalDueDate.toDate()
    : null;
  const newPayDate = account.newPayDate ? account.newPayDate.toDate() : null;
  const discountRate = account.discountRate
    ? (account.discountRate * 100).toFixed(3)
    : '処理中';

  return (
    <>
      <TableRow hover key={account.id}>
        <TableCell>
          <Label color="secondary">前払い日超過</Label>
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
            {account.vendorCommission
              ? `${currencyUnit(
                  account.currency
                )} ${account.vendorCommission.toLocaleString()}`
              : '処理中'}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Button sx={{ p: 0, m: 0 }} onClick={() => setOpenEditModal(true)}>
            編集
          </Button>
        </TableCell>
        <TableCell align="center">
          <Button sx={{ p: 0, m: 0 }} onClick={() => setOpenDeleteModal(true)}>
            削除
          </Button>
        </TableCell>
      </TableRow>
      <AccountListEditModal
        account={account}
        open={openEditModal}
        handleClose={() => setOpenEditModal(false)}
        callback={() => {
          reload();
          setOpenEditModal(false);
        }}
      />
      <AccountListDeleteModal
        accountId={account.id}
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        callback={() => {
          reload();
          setOpenDeleteModal(false);
        }}
      />
    </>
  );
};

export default InactiveAccountListTableRow;