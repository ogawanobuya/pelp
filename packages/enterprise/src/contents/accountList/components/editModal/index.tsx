import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Typography
} from '@mui/material';
import { Account } from 'pelp-repositories/src';
import { useEffect } from 'react';
import CalendarDatePicker from 'src/components/calendarDatePicker';
import Modal from 'src/components/modal';

import {
  useEditAccount,
  useInitialize,
  useInitializedState,
  useLoadingValue,
  useNewPayDateState,
  useOriginalDueDateState
} from './localStates';

interface AccountListEditModalProps {
  open: boolean;
  handleClose: () => void;
  callback: () => void;
  account: Account;
}
const AccountListEditModal = (props: AccountListEditModalProps) => {
  const { open, handleClose, callback, account } = props;

  const [originalDueDate, setOriginalDueDate] = useOriginalDueDateState(
    account.id
  );
  const [newPayDate, setNewPayDate] = useNewPayDateState(account.id);
  const [initialized, setInitialized] = useInitializedState(account.id);
  const loading = useLoadingValue(account.id);
  const editAccount = useEditAccount();
  const initialize = useInitialize();

  useEffect(() => {
    if (!initialized) initialize(account);
  });

  return (
    <Modal
      key={account.id}
      open={open}
      handleClose={() => {
        handleClose();
        setInitialized(false);
      }}
      title="請求書の編集"
    >
      <Box width={180}>
        <FormControl variant="outlined" fullWidth>
          <Typography variant="h5" align="left" sx={{ my: 1 }}>
            支払い予定日
          </Typography>
          <CalendarDatePicker
            keyStr={`originalDueDate_${account.id}`}
            date={originalDueDate}
            handleSelect={setOriginalDueDate}
            label="支払い予定日"
          />
        </FormControl>
      </Box>
      <Box width={180}>
        <FormControl variant="outlined" fullWidth>
          <Typography variant="h5" align="left" sx={{ my: 1 }}>
            早払い予定日
          </Typography>
          <CalendarDatePicker
            keyStr={`newPayDate${account.id}`}
            date={newPayDate}
            handleSelect={setNewPayDate}
            label="早払い予定日"
          />
        </FormControl>
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 2, ml: '50%', transform: 'translateX(-50%)' }}
        onClick={() =>
          editAccount({
            account,
            callback: () => {
              callback();
              setInitialized(false);
            }
          })
        }
      >
        {loading ? <CircularProgress color="inherit" size={20} /> : '変更'}
      </Button>
    </Modal>
  );
};

export default AccountListEditModal;