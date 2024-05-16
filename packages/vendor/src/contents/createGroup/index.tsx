import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Typography,
  Container,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Snackbar,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import PasswordResetModal from 'src/components/passwordResetModal';
import { useUesrDataValue } from 'src/globalStates/authState';
import { REACT_APP_IGNORE_AUTH } from 'src/utils/env';

import {
  useUserEmailState,
  useIsValidUserEmailValue,
  useNameState,
  useSnackbarContentValue,
  useSnackbarOpenState,
  useModalOpenState,
  useLoadingValue,
  useCanCreateGroupValue,
  useCreateGroup
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

const SubmitButton = styled(LoadingButton)(
  ({ theme }) => `
    margin-right: -${theme.spacing(1)};
`
);

const SignInContent = () => {
  const userData = useUesrDataValue();
  const [userEmail, setUserEmail] = useUserEmailState();
  const isValidUserEmail = useIsValidUserEmailValue();
  const [name, setName] = useNameState();
  const snackbarContent = useSnackbarContentValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const [modalOpen, setModalOpen] = useModalOpenState();
  const loading = useLoadingValue();
  const canCreateGroup = useCanCreateGroupValue();
  const createGroup = useCreateGroup();

  const navigate = useNavigate();

  useEffect(() => {
    if (userData.user && userData.vendorUser && !REACT_APP_IGNORE_AUTH)
      navigate('/dashboards');
  });

  return (
    <>
      <Helmet>
        <title>Pelp ― グループ作成</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="logo" height={180} src="/static/icon/icon.png" />
            <Typography variant="h2" sx={{ my: 1 }}>
              サプライヤーグループを作成する
            </Typography>
          </Box>
          <Container maxWidth="sm">
            <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
              <FormControl variant="outlined" fullWidth>
                <Typography variant="h5" align="left" sx={{ my: 1 }}>
                  ログインするアカウントのメールアドレス
                </Typography>
                <OutlinedInputWrapper
                  type="text"
                  placeholder="example@pelpfinance.com"
                  value={userEmail}
                  error={!isValidUserEmail && userEmail.length !== 0}
                  onChange={(event) => setUserEmail(event.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <Typography variant="h5" align="left" sx={{ mt: 3, mb: 1 }}>
                  サプライヤー会社名
                </Typography>
                <OutlinedInputWrapper
                  type="text"
                  placeholder="〇〇株式会社"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <PasswordIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <SubmitButton
                loading={loading}
                onClick={() => createGroup(() => navigate('/dashboards'))}
                disabled={!canCreateGroup}
                variant="contained"
                size="medium"
                sx={{ mt: 3 }}
              >
                グループを作成
              </SubmitButton>
            </Card>
          </Container>
          <Container sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <Link
              onClick={() => navigate('/sign-up')}
              sx={{ mt: 3, ml: 4, ':hover': { cursor: 'pointer' } }}
            >
              失敗する場合はこちらから認証メールを再度送信してください
            </Link>
          </Container>
          <Container sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <Link
              onClick={() => setModalOpen(true)}
              sx={{ mt: 3, ml: 4, ':hover': { cursor: 'pointer' } }}
            >
              パスワード再設定
            </Link>
          </Container>
        </Container>
      </MainContent>
      <PasswordResetModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
      />
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

export default SignInContent;