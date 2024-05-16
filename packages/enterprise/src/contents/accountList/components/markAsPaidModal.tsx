import { Button, Typography } from '@mui/material';
import Modal from 'src/components/modal';

interface AccountListSetAsPaidModalProps {
  open: boolean;
  handleClose: () => void;
  onClick: () => void;
}
const AccountListSetAsPaidModal = (props: AccountListSetAsPaidModalProps) => {
  const { open, handleClose, onClick } = props;
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="請求書を支払い済みにする"
    >
      <Typography variant="body1" align="left" sx={{ my: 1 }}>
        請求書を支払い済みとして設定します。
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, ml: '50%', transform: 'translateX(-50%)' }}
        onClick={onClick}
      >
        支払い済みにする
      </Button>
    </Modal>
  );
};

export default AccountListSetAsPaidModal;