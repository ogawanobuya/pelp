import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  Divider,
  Card,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  TableCell,
  Snackbar
} from '@mui/material';
import { useEffect } from 'react';

import AccountListAdjustModal from '../../components/adjustModal';
import {
  CardHeaderActionWrapper,
  TablePaginationWrapper
} from '../../components/styled';
import AccountListTableHeadCell from '../../components/tableHeadCell';

import CardHeaderAction from './cardHeaderAction';
import {
  useAdjustAccounts,
  useCheckedValue,
  useFetchNextPage,
  useInitialize,
  useInitializedValue,
  useIsGroupAdminValue,
  useIsOpenAdjustModalState,
  useLastPageValue,
  usePageState,
  useShowedAccountsValue,
  useSnackbarContentValue,
  useSnackbarOpenState
} from './localStates';
import ActiveAccountListTableRow from './tableRow';

const ActiveAccountListTable = () => {
  const isGroupAdmin = useIsGroupAdminValue();
  const [page, setPage] = usePageState();
  const lastPage = useLastPageValue();
  const accounts = useShowedAccountsValue();
  const initialized = useInitializedValue();
  const [isOpenAdjustModal, setOpenAdjustModal] = useIsOpenAdjustModalState();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const snackbarContent = useSnackbarContentValue();
  const checked = useCheckedValue();
  const numberOfChecked = Math.trunc(checked.filter((c) => c).length);

  const initialize = useInitialize();
  const fetchNextPage = useFetchNextPage();
  const adjustAccounts = useAdjustAccounts();

  useEffect(() => {
    if (!initialized) initialize();
  });

  return (
    <>
      <Card>
        <CardHeaderActionWrapper>
          <CardHeaderAction />
        </CardHeaderActionWrapper>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell />
                <AccountListTableHeadCell>取引先</AccountListTableHeadCell>
                <AccountListTableHeadCell>
                  支払い予定日
                </AccountListTableHeadCell>
                <AccountListTableHeadCell>
                  早払い予定日
                </AccountListTableHeadCell>
                <AccountListTableHeadCell>
                  オファー承認期限
                </AccountListTableHeadCell>
                <AccountListTableHeadCell>
                  元の支払い金額
                </AccountListTableHeadCell>
                <AccountListTableHeadCell>早払い金額</AccountListTableHeadCell>
                <AccountListTableHeadCell>割引率(%)</AccountListTableHeadCell>
                <AccountListTableHeadCell>割引額</AccountListTableHeadCell>
                <AccountListTableHeadCell>手数料</AccountListTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account, index) => (
                <ActiveAccountListTableRow key={account.id} index={index} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePaginationWrapper display="flex" p={2}>
          <IconButton
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            size="small"
            sx={{ mr: 2 }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            disabled={page === lastPage}
            onClick={() => {
              setPage(page + 1);
              fetchNextPage();
            }}
            size="small"
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </TablePaginationWrapper>
      </Card>
      <AccountListAdjustModal
        numberOfChecked={numberOfChecked}
        open={isOpenAdjustModal}
        handleClose={() => setOpenAdjustModal(false)}
        onClick={adjustAccounts}
        isGroupAdmin={isGroupAdmin}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        onClick={() => setSnackbarOpen(false)}
        message={snackbarContent}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      />
    </>
  );
};

export default ActiveAccountListTable;