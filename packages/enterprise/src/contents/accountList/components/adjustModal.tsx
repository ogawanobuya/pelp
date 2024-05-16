import { Box, Button, Typography } from '@mui/material';
import Modal from 'src/components/modal';

interface AccountListAdjustModalProps {
  numberOfChecked: number;
  open: boolean;
  handleClose: () => void;
  onClick: () => void;
  isGroupAdmin?: boolean;
}
const AccountListAdjustModal = (props: AccountListAdjustModalProps) => {
  const {
    numberOfChecked,
    open,
    handleClose,
    onClick,
    isGroupAdmin = false
  } = props;
  return (
    <Modal open={open} handleClose={handleClose} title="早払いオファーの受諾">
      <Typography variant="body1" align="left" sx={{ my: 1 }}>
        {numberOfChecked}件の選択している請求書の早払いオファーを受諾します。
        <br />
        オファーを受諾した場合、記載されている早払い日に支払う必要があります。
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, ml: '50%', transform: 'translateX(-50%)' }}
        onClick={onClick}
        disabled={!isGroupAdmin}
      >
        送信
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

export default AccountListAdjustModal;