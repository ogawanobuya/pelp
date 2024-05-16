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
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { useUesrDataValue } from 'src/globalStates/authState';
import { REACT_APP_IGNORE_AUTH } from 'src/utils/env';

import {
  useEmailState,
  useIsValidEmailValue,
  useSnackbarOpenedState,
  useLoadingState,
  useSignIn,
  usePasswordState,
  useMessageValue
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

const SignInContent = () => {
  const [email, setEmail] = useEmailState();
  const isValidEmail = useIsValidEmailValue();
  const [password, setPassword] = usePasswordState();
  const message = useMessageValue();
  const [snackbarOpened, setSnackbarOpened] = useSnackbarOpenedState();
  const [loading] = useLoadingState();
  const user = useUesrDataValue();
  const signIn = useSignIn();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && !REACT_APP_IGNORE_AUTH) navigate('/dashboards');
  });

  return (
    <>
      <Helmet>
        <title>Pelp ― ログイン</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="logo" height={180} src="/static/icon/icon.png" />
            <Typography variant="h2" sx={{ my: 1 }}>
              管理者アカウントにログインする
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
              sx={{ mb: 4 }}
            >
              Pelp管理者アカウントにログインする
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
              <SubmitButton
                onClick={() => signIn(() => navigate('/dashboards'))}
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
                    'ログイン'
                  )}
                </Box>
              </SubmitButton>
            </Card>
          </Container>
        </Container>
      </MainContent>
      <Snackbar
        open={snackbarOpened}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpened(false)}
        onClick={() => setSnackbarOpened(false)}
        message={message}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      />
    </>
  );
};

export default SignInContent;