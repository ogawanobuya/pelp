import { Button, Typography } from '@mui/material';
import Modal from 'src/components/modal';

interface AccountListConfirmModalProps {
  open: boolean;
  handleClose: () => void;
  onClick: () => void;
}
const AccountListConfirmModal = (props: AccountListConfirmModalProps) => {
  const { open, handleClose, onClick } = props;
  return (
    <Modal open={open} handleClose={handleClose} title="入金確認を完了する">
      <Typography variant="body1" align="left" sx={{ my: 1 }}>
        入金確認が完了したことをバイヤーに知らせます。これにより早払いが完全に完了します。
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, ml: '50%', transform: 'translateX(-50%)' }}
        onClick={onClick}
      >
        入金確認を完了する
      </Button>
    </Modal>
  );
};

export default AccountListConfirmModal;