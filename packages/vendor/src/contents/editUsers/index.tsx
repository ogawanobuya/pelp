import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { LoadingButton } from '@mui/lab';
import {
  TableRow,
  TableCell,
  Typography,
  IconButton,
  styled,
  OutlinedInput,
  Grid,
  Container,
  Snackbar,
  Box,
  Divider,
  TableContainer,
  Table,
  TableBody,
  InputAdornment,
  Switch,
  FormControlLabel,
  FormControl
} from '@mui/material';
import { VendorUser } from 'pelp-repositories/src';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthStateChecker from 'src/components/authStateChecker';
import Label from 'src/components/label';
import Modal from 'src/components/modal';
import PageTitleWrapper from 'src/components/pageTitleWrapper';
import { useUesrDataValue } from 'src/globalStates/authState';

import {
  useInitializedValue,
  useUsersValue,
  useInitialize,
  useDeleteUser,
  useAddedUserEmailState,
  useIsValidAddedUserEmailValue,
  useIsAdminAddedUserState,
  useAddUser,
  useSnackbarContentValue,
  useSnackbarOpenState,
  useLoadingValue,
  useUserDeleteModalOpenState
} from './localStates';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    max-width: 800px;
`
);

interface UserTableRowProps {
  user: VendorUser;
}
const UserTableRow = (props: UserTableRowProps) => {
  const { user } = props;
  const userData = useUesrDataValue();
  const currentUserId = userData.user?.uid ?? '';
  const [modalOpen, setModalOpen] = useUserDeleteModalOpenState(user.id);
  const deleteUser = useDeleteUser();
  const loading = useLoadingValue();

  return (
    <>
      <TableRow>
        <TableCell width={400}>
          <Typography variant="body2" align="left">
            {user.email}
          </Typography>
        </TableCell>
        <TableCell width={50}>
          {user.isGroupAdmin ? <Label>管理者</Label> : <Box />}
        </TableCell>
        <TableCell>
          <IconButton onClick={() => setModalOpen(true)} size="small">
            {user.id !== currentUserId ? <DeleteForeverIcon /> : <Box />}
          </IconButton>
        </TableCell>
      </TableRow>
      <Modal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        title="アカウントの削除"
      >
        <Typography variant="body1" align="left" sx={{ my: 1 }}>
          グループ内のアカウント{user.email}を削除します。
        </Typography>
        <LoadingButton
          variant="contained"
          sx={{ mt: 2, ml: '50%', transform: 'translateX(-50%)' }}
          onClick={() => deleteUser(user)}
          loading={loading}
        >
          削除
        </LoadingButton>
      </Modal>
    </>
  );
};

const EditUsersContent = () => {
  const users = useUsersValue();
  const initialized = useInitializedValue();
  const initialize = useInitialize();
  const [email, setEmail] = useAddedUserEmailState();
  const isValidEmail = useIsValidAddedUserEmailValue();
  const [isGroupAdmin, setIsGroupAdmin] = useIsAdminAddedUserState();
  const addUser = useAddUser();
  const snackbarContent = useSnackbarContentValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const loading = useLoadingValue();

  useEffect(() => {
    if (!initialized) initialize();
  });

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp ― アカウント管理</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
              アカウント管理
            </Typography>
            <Typography variant="body1" align="left">
              グループに所属するアカウントの追加・削除ができます。
              追加時にはグループの編集や早払いオファーの承認の権限がある管理者アカウントにするかどうかを選べます。
            </Typography>
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h4" gutterBottom sx={{ mb: 1 }}>
          アカウント追加
        </Typography>
        <Typography variant="h5" component="h5" gutterBottom sx={{ mb: 1 }}>
          メールアドレス
        </Typography>
        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
          <OutlinedInputWrapper
            type="text"
            placeholder="example@pelpfinance.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={!isValidEmail && email.length !== 0}
            startAdornment={
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            }
            sx={{ width: 400 }}
          />
        </FormControl>
        <FormControlLabel
          label={
            <Typography
              variant="h5"
              component="h5"
              gutterBottom
              sx={{ mt: 0.5 }}
            >
              管理者アカウント
            </Typography>
          }
          control={
            <Switch
              checked={isGroupAdmin}
              onChange={(event) => setIsGroupAdmin(event.target.checked)}
            />
          }
          sx={{ mb: 2 }}
        />
        {/* Boxで改行 */}
        <Box sx={{ mb: 5 }}>
          <LoadingButton
            variant="contained"
            size="medium"
            sx={{ width: 120, height: 40, mt: 0, ml: 2 }}
            loading={loading}
            onClick={() => addUser()}
            disabled={!isValidEmail}
          >
            追加
          </LoadingButton>
        </Box>
        <Typography variant="h4" component="h4" gutterBottom sx={{ mb: 2 }}>
          アカウント一覧
        </Typography>
        <Box maxWidth={600}>
          <Divider />
          <TableContainer>
            <Table>
              <TableBody>
                {users.map((user) => {
                  return <UserTableRow user={user} key={user.id} />;
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

export default EditUsersContent;