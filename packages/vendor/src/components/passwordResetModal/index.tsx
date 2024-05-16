import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { LoadingButton } from '@mui/lab';
import {
  Container,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

import Modal from '../modal';

import {
  useEmailState,
  useIsValidEmailValue,
  useLoadingValue,
  useMessageValue,
  useSendPassWordResetEmail,
  useSnackbarOpenState
} from './localStates';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

interface PasswordResetModalProps {
  open: boolean;
  handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  callback?: () => void;
}
const PasswordResetModal: FC<PasswordResetModalProps> = (
  props: PasswordResetModalProps
) => {
  const { open, handleClose, callback = () => {} } = props;

  const [email, setEmail] = useEmailState();
  const isValidEmail = useIsValidEmailValue();
  const message = useMessageValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const loading = useLoadingValue();
  const sendPassWordResetEmail = useSendPassWordResetEmail();

  return (
    <>
      <Modal
        open={open}
        handleClose={handleClose}
        title="パスワード再設定メールの送信"
      >
        <Container sx={{ textAlign: 'center' }}>
          <FormControl variant="outlined" fullWidth>
            <Typography variant="h5" align="left" sx={{ my: 1 }}>
              Eメールアドレス
            </Typography>
            <OutlinedInputWrapper
              type="text"
              placeholder="email@domain.com"
              value={email}
              error={!isValidEmail}
              onChange={(event) => setEmail(event.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <LoadingButton
            variant="contained"
            size="medium"
            sx={{ width: 120, height: 30, mt: 3 }}
            loading={loading}
            onClick={() => sendPassWordResetEmail(callback)}
          >
            送信
          </LoadingButton>
        </Container>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        onClick={() => setSnackbarOpen(false)}
        message={message}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      />
    </>
  );
};

export default PasswordResetModal;