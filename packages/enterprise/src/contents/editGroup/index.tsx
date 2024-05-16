import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import { LoadingButton } from '@mui/lab';
import {
  Grid,
  Typography,
  Container,
  Snackbar,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  IconButton,
  FormControl,
  styled,
  OutlinedInput,
  InputAdornment,
  Divider,
  Box,
  TableBody
} from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthStateChecker from 'src/components/authStateChecker';
import Modal from 'src/components/modal';
import PageTitleWrapper from 'src/components/pageTitleWrapper';

import {
  useAddedEmailState,
  useAddEmail,
  useDeleteEmail,
  useEditGroup,
  useEmailAddStepValue,
  useEmailDeletionModalOpenState,
  useEmailsValue,
  useEnterpriseUserGroupValue,
  useInitialize,
  useInitializedValue,
  useIsValidAddedEmailValue,
  useLoadingValue,
  useNameState,
  useOneTimePasswordState,
  useOpenDeletionModal,
  useResetAddedEmail,
  useSendOneTimePassword,
  useSnackbarContentValue,
  useSnackbarOpenState
} from './localStates';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    max-width: 800px;
`
);

interface EmailDeletionModalProps {
  index: number;
  email: string;
}
const EmailDeletionModal = (props: EmailDeletionModalProps) => {
  const { index, email } = props;

  const [modalOpen, setModalOpen] = useEmailDeletionModalOpenState(email);
  const deleteEmail = useDeleteEmail();
  const loading = useLoadingValue('deleteEmail');

  return (
    <Modal
      open={modalOpen}
      handleClose={() => setModalOpen(false)}
      title="バイヤーメールアドレスの登録解除"
    >
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="body1" align="left">
          バイヤーメールアドレスの登録を解除します。
          再登録には再度メールアドレスを認証する必要があります。
        </Typography>
        <LoadingButton
          variant="contained"
          size="medium"
          sx={{ width: 180, height: 40, ml: 2 }}
          loading={loading}
          onClick={() => deleteEmail(index)}
        >
          登録解除
        </LoadingButton>
      </Container>
    </Modal>
  );
};

const EditGroupContent = () => {
  const group = useEnterpriseUserGroupValue();
  const initialized = useInitializedValue();
  const initialize = useInitialize();
  const [name, setName] = useNameState();
  const editGroup = useEditGroup();
  const [addedEmail, setAddedEmail] = useAddedEmailState();
  const isValidAddedEmail = useIsValidAddedEmailValue();
  const emailAddStep = useEmailAddStepValue();
  const sendOneTimePassword = useSendOneTimePassword();
  const [oneTimePassword, setOneTimePassword] = useOneTimePasswordState();
  const addEmail = useAddEmail();
  const resetAddedEmail = useResetAddedEmail();
  const emails = useEmailsValue();
  const openDeletionModal = useOpenDeletionModal();
  const snackbarContent = useSnackbarContentValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const nameLoading = useLoadingValue('name');
  const defaultLoading = useLoadingValue('default');

  useEffect(() => {
    if (!initialized) initialize();
  });

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp ― グループ設定</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
              バイヤーグループ設定
            </Typography>
            <Typography variant="body1" align="left">
              グループ名とメールアドレスの編集ができます。
            </Typography>
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h4" gutterBottom sx={{ mb: 1 }}>
          グループ名編集
        </Typography>
        <Grid
          container
          justifyContent="start"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Grid item>
            <FormControl variant="outlined" fullWidth>
              <OutlinedInputWrapper
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item>
            <LoadingButton
              variant="contained"
              size="medium"
              sx={{ width: 120, height: 40, mt: 0, ml: 2 }}
              loading={nameLoading}
              onClick={() => editGroup()}
              disabled={name.length === 0 || name === group.name}
            >
              送信
            </LoadingButton>
          </Grid>
        </Grid>
        <Typography variant="h4" component="h4" gutterBottom sx={{ mb: 1 }}>
          メールアドレス追加
        </Typography>
        <Box maxWidth={800} sx={{ mb: 1.5 }}>
          <FormControl variant="outlined" fullWidth>
            <OutlinedInputWrapper
              type="text"
              placeholder="example@pelpfinance.com"
              value={addedEmail}
              onChange={(event) => setAddedEmail(event.target.value)}
              error={!isValidAddedEmail && addedEmail.length !== 0}
              disabled={emailAddStep !== 'entering'}
              startAdornment={
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box sx={{ mb: 4 }}>
          {emailAddStep === 'entering' ? (
            <LoadingButton
              variant="contained"
              size="medium"
              sx={{ width: 240, height: 40 }}
              loading={defaultLoading}
              onClick={() => sendOneTimePassword()}
              disabled={emailAddStep !== 'entering' || !isValidAddedEmail}
            >
              ワンタイムパスワード送信
            </LoadingButton>
          ) : (
            <Grid container justifyContent="start" alignItems="center">
              <Grid item>
                <FormControl variant="outlined" fullWidth>
                  <OutlinedInputWrapper
                    type="text"
                    placeholder="ワンタイムパスワード"
                    value={oneTimePassword}
                    onChange={(event) => setOneTimePassword(event.target.value)}
                    disabled={emailAddStep !== 'verifying'}
                    startAdornment={
                      <InputAdornment position="start">
                        <PasswordIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <LoadingButton
                  variant="contained"
                  size="medium"
                  sx={{ width: 180, height: 40, ml: 2 }}
                  loading={defaultLoading}
                  onClick={() => addEmail()}
                >
                  メールアドレス追加
                </LoadingButton>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={() => resetAddedEmail()}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </Box>
        <Typography variant="h4" component="h4" gutterBottom sx={{ mb: 2 }}>
          既存メールアドレス管理
        </Typography>
        <Box maxWidth={500}>
          <Divider />
          <TableContainer>
            <Table>
              <TableBody>
                {emails.map((email, index) => {
                  return (
                    <>
                      <TableRow key={email}>
                        <TableCell width={400}>
                          <Typography variant="body2" align="left">
                            {email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => openDeletionModal(email)}
                            size="small"
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <EmailDeletionModal index={index} email={email} />
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        onClick={() => setSnackbarOpen(false)}
        message={snackbarContent}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      />
    </AuthStateChecker>
  );
};

export default EditGroupContent;