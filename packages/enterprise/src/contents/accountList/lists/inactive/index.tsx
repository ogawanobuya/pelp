import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReplayIcon from '@mui/icons-material/Replay';
import { LoadingButton } from '@mui/lab';
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
  Box,
  Button,
  FormControl,
  Typography
} from '@mui/material';
import { randomString } from 'pelp-repositories/src/utils/randomString';
import { useEffect } from 'react';
import CalendarDatePicker from 'src/components/calendarDatePicker';
import Modal from 'src/components/modal';

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
  useSnackbarOpenState,
  useCheckedValue,
  useNewPayDateModalOpenState,
  useNewPayDateState,
  useLoadingValue,
  useEditNewPayDate
} from './localStates';
import InactiveAccountListTableRow from './tableRow';

const InactiveAccountListTable = () => {
  const [page, setPage] = usePageState();
  const lastPage = useLastPageValue();
  const accounts = useShowedAccountsValue();
  const initialized = useInitializedValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const snackbarContent = useSnackbarContentValue();
  const [modalOpen, setModalOpen] = useNewPayDateModalOpenState();
  const [newPayDate, setNewPayDate] = useNewPayDateState();
  const checked = useCheckedValue();
  const loading = useLoadingValue();

  const initialize = useInitialize();
  const fetchNextPage = useFetchNextPage();
  const reload = useReload();
  const editNewPayDate = useEditNewPayDate();

  useEffect(() => {
    if (!initialized) initialize();
  });

  return (
    <>
      <Card>
        <CardHeaderActionWrapper>
          <AccountListTabs />
          <Divider sx={{ mb: 1 }} />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              onClick={() => setModalOpen(true)}
              disabled={checked.every((c) => !c)}
              sx={{ width: 230, height: 30 }}
              variant="contained"
            >
              {checked.filter((c) => c).length > 1
                ? '一括で早払い日を更新する'
                : '早払い日を更新する'}
            </Button>
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
                <InactiveAccountListTableRow key={account.id} index={index} />
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
      <Modal
        open={modalOpen}
        title="早払い予定日の更新"
        handleClose={() => {
          setModalOpen(false);
        }}
      >
        <Box width={180}>
          <FormControl variant="outlined" fullWidth>
            <Typography variant="h5" align="left" sx={{ my: 1 }}>
              早払い予定日
            </Typography>
            <CalendarDatePicker
              keyStr={randomString()}
              date={newPayDate}
              handleSelect={setNewPayDate}
              label="早払い予定日"
            />
          </FormControl>
        </Box>
        <LoadingButton
          variant="contained"
          sx={{ mt: 2, ml: '50%', transform: 'translateX(-50%)' }}
          loading={loading}
          onClick={() => {
            editNewPayDate();
          }}
        >
          更新する
        </LoadingButton>
      </Modal>
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

export default InactiveAccountListTable;