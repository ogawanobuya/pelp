import { Button, CircularProgress, Typography } from '@mui/material';
import Modal from 'src/components/modal';

import { useDeleteAccount, useLoadingValue } from './localStates';

interface AccountListDeleteModalProps {
  accountId: string;
  open: boolean;
  handleClose: () => void;
  callback: () => void;
}
const AccountListDeleteModal = (props: AccountListDeleteModalProps) => {
  const { accountId, open, handleClose, callback } = props;

  const loading = useLoadingValue();
  const deleteAccount = useDeleteAccount();

  return (
    <Modal
      key={accountId}
      open={open}
      handleClose={handleClose}
      title="請求書の削除"
    >
      <Typography variant="body1" align="left" sx={{ my: 1 }}>
        請求書データを削除します
        <br />
        削除した請求書は早払い対象としてサプライヤーに表示されません
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, ml: '50%', transform: 'translateX(-50%)' }}
        onClick={() => deleteAccount({ accountId, callback })}
      >
        {loading ? <CircularProgress color="inherit" size={20} /> : '削除'}
      </Button>
    </Modal>
  );
};

export default AccountListDeleteModal;