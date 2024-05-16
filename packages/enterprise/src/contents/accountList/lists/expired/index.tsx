import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReplayIcon from '@mui/icons-material/Replay';
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
  Snackbar,
  Box
} from '@mui/material';
import { useEffect } from 'react';

import {
  CardHeaderActionWrapper,
  TablePaginationWrapper
} from '../../components/styled';
import AccountListTableHeadCell from '../../components/tableHeadCell';
import AccountListTabs from '../../components/tabs';

import {
  useFetchNextPage,
  useInitialize,
  useInitializedValue,
  useLastPageValue,
  usePageState,
  useShowedAccountsValue,
  useSnackbarContentValue,
  useReload,
  useSnackbarOpenState
} from './localStates';
import ExpiredAccountListTableRow from './tableRow';

const ExpiredAccountListTable = () => {
  const [page, setPage] = usePageState();
  const lastPage = useLastPageValue();
  const accounts = useShowedAccountsValue();
  const initialized = useInitializedValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const snackbarContent = useSnackbarContentValue();

  const initialize = useInitialize();
  const fetchNextPage = useFetchNextPage();
  const reload = useReload();

  useEffect(() => {
    if (!initialized) initialize();
  });

  return (
    <>
      <Card>
        <CardHeaderActionWrapper>
          <AccountListTabs />
          <Divider sx={{ mb: 1 }} />
          <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
            <IconButton onClick={reload} size="small">
              <ReplayIcon />
            </IconButton>
          </Box>
        </CardHeaderActionWrapper>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <AccountListTableHeadCell>取引先</AccountListTableHeadCell>
                <AccountListTableHeadCell>
                  支払い予定日
                </AccountListTableHeadCell>
                <AccountListTableHeadCell>
                  早払い予定日
                </AccountListTableHeadCell>
                <AccountListTableHeadCell>
                  元の支払い金額
                </AccountListTableHeadCell>
                <AccountListTableHeadCell>早払い金額</AccountListTableHeadCell>
                <AccountListTableHeadCell>割引率(%)</AccountListTableHeadCell>
                <AccountListTableHeadCell>割引額</AccountListTableHeadCell>
                <AccountListTableHeadCell>手数料</AccountListTableHeadCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account, index) => (
                <ExpiredAccountListTableRow key={account.id} index={index} />
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

export default ExpiredAccountListTable;