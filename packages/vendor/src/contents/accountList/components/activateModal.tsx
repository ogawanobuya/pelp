import { Box, Button, Typography } from '@mui/material';
import Modal from 'src/components/modal';

interface AccountListActivateModalProps {
  open: boolean;
  handleClose: () => void;
  onClick: () => void;
  isGroupAdmin?: boolean;
}
const AccountListActivateModal = (props: AccountListActivateModalProps) => {
  const { open, handleClose, onClick, isGroupAdmin = false } = props;
  return (
    <Modal open={open} handleClose={handleClose} title="早払いオファーを送る">
      <Typography variant="body1" align="left" sx={{ my: 1 }}>
        早払いオファーを送信します。送信したオファーをバイヤーが受諾すると指定の日次に早払いされます。
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, ml: '50%', transform: 'translateX(-50%)' }}
        onClick={onClick}
        disabled={!isGroupAdmin}
      >
        オファーを送る
      </Button>
      {isGroupAdmin ? (
        <Box />
      ) : (
        <Typography
          variant="body2"
          component="p"
          sx={{ mt: 2, color: 'darkred' }}
        >
          ログインしているアカウントにはオファーを受諾する権限がありません
        </Typography>
      )}
    </Modal>
  );
};

export default AccountListActivateModal;