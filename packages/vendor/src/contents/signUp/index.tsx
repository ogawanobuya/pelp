import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import {
  Box,
  Card,
  Typography,
  Container,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Snackbar,
  CircularProgress,
  Link,
  FormControlLabel,
  Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import Modal from 'src/components/modal';
import { useUesrDataValue } from 'src/globalStates/authState';
import { REACT_APP_IGNORE_AUTH } from 'src/utils/env';

import {
  useEmailState,
  useIsValidEmailValue,
  useSnackbarOpenState,
  useLoadingState,
  useSignUp,
  usePasswordState,
  useMessageValue,
  usePasswordConfirmationState,
  useModalOpenState,
  useSendVerificationEmail,
  useTermOfUseCheckboxCheckedState,
  useCanSignUpValue,
  usePrivacyPolicyCheckboxCheckedState
} from './localStates';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

const SubmitButton = styled(Button)(
  ({ theme }) => `
    margin-right: -${theme.spacing(1)};
`
);

const SignUpContent = () => {
  const [email, setEmail] = useEmailState();
  const isValidEmail = useIsValidEmailValue();
  const [password, setPassword] = usePasswordState();
  const [passwordConfirmation, setPasswordConfirmation] =
    usePasswordConfirmationState();
  const [termOfUseCheckboxChecked, setTermOfUseCheckboxChecked] =
    useTermOfUseCheckboxCheckedState();
  const [privacyPolicyCheckboxChecked, setPrivacyPolicyCheckboxChecked] =
    usePrivacyPolicyCheckboxCheckedState();
  const message = useMessageValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const [modalOpen, setModalOpen] = useModalOpenState();
  const [loading] = useLoadingState();
  const canSignUp = useCanSignUpValue();
  const signUp = useSignUp();
  const sendVerificationEmail = useSendVerificationEmail();
  const userData = useUesrDataValue();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData.user && userData.vendorUser && !REACT_APP_IGNORE_AUTH)
      navigate('/dashboards');
  });

  return (
    <>
      <Helmet>
        <title>Pelp ― 新規登録</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="logo" height={180} src="/static/icon/icon.png" />
            <Typography variant="h2" sx={{ my: 1 }}>
              サプライヤーアカウントを作成する
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
              sx={{ mb: 4 }}
            >
              Pelpサプライヤーアカウントを作成する
            </Typography>
          </Box>
          <Container maxWidth="sm">
            <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
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
              <FormControl variant="outlined" fullWidth>
                <Typography variant="h5" align="left" sx={{ mt: 3 }}>
                  パスワード
                </Typography>
                <OutlinedInputWrapper
                  type="password"
                  placeholder="* * * * * *"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <PasswordIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <Typography variant="h5" align="left" sx={{ mt: 3 }}>
                  パスワード（確認）
                </Typography>
                <OutlinedInputWrapper
                  type="password"
                  placeholder="* * * * * *"
                  value={passwordConfirmation}
                  onChange={(event) =>
                    setPasswordConfirmation(event.target.value)
                  }
                  error={
                    passwordConfirmation.length !== 0 &&
                    password !== passwordConfirmation
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <PasswordIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Box textAlign="left">
                <FormControlLabel
                  label={
                    <Typography variant="h5" align="left">
                      <Link
                        href="https://firebasestorage.googleapis.com/v0/b/pelp-prod.appspot.com/o/public%2FPelp%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84.pdf?alt=media&token=27104940-b4e1-48b5-9003-61dfaced2b82"
                        sx={{ ':hover': { cursor: 'pointer' } }}
                      >
                        利用規約
                      </Link>
                      に同意する
                    </Typography>
                  }
                  control={
                    <Switch
                      checked={termOfUseCheckboxChecked}
                      onChange={(event) =>
                        setTermOfUseCheckboxChecked(event.target.checked)
                      }
                      sx={{ ml: 1 }}
                    />
                  }
                  sx={{ mt: 1 }}
                />
                <FormControlLabel
                  label={
                    <Typography variant="h5" align="left">
                      <Link
                        href="https://firebasestorage.googleapis.com/v0/b/pelp-prod.appspot.com/o/public%2FPelp%E3%83%95%E3%82%9A%E3%83%A9%E3%82%A4%E3%83%8F%E3%82%99%E3%82%B7%E3%83%BC%E3%83%9B%E3%82%9A%E3%83%AA%E3%82%B7%E3%83%BC.pdf?alt=media&token=123d3612-48d1-4ab5-a613-3ba2f4412793"
                        sx={{ ':hover': { cursor: 'pointer' } }}
                      >
                        プライバシーポリシー
                      </Link>
                      に同意する
                    </Typography>
                  }
                  control={
                    <Switch
                      checked={privacyPolicyCheckboxChecked}
                      onChange={(event) =>
                        setPrivacyPolicyCheckboxChecked(event.target.checked)
                      }
                      sx={{ ml: 1 }}
                    />
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
              <SubmitButton
                onClick={signUp}
                disabled={!canSignUp}
                variant="contained"
                size="medium"
                sx={{ mt: 3 }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: 120, height: 30 }}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    '登録'
                  )}
                </Box>
              </SubmitButton>
            </Card>
          </Container>
          <Container sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <Link
              onClick={() => setModalOpen(true)}
              sx={{ mt: 3, ':hover': { cursor: 'pointer' } }}
            >
              認証メールの再送信
            </Link>
          </Container>
        </Container>
      </MainContent>
      <Modal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        title="認証メールの再送信"
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
          <SubmitButton
            onClick={sendVerificationEmail}
            variant="contained"
            size="medium"
            sx={{ mt: 3 }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 120, height: 30 }}
            >
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                '送信'
              )}
            </Box>
          </SubmitButton>
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

export default SignUpContent;