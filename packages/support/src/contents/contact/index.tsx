import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Typography,
  Container,
  OutlinedInput,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  TextField,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';

import {
  useCompanyState,
  useEmailState,
  useIsValidEmailValue,
  useLoadingValue,
  useMessageState,
  useNameState,
  useSnackbarContentValue,
  useSnackbarOpenState,
  useSubmit,
  useSubmittableValue,
  useUserTypeState,
  castToUserType
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

const TextFieldWrapper = styled(TextField)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    }
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

const ContactContent = () => {
  const [userType, setUserType] = useUserTypeState();
  const [message, setMessage] = useMessageState();
  const [email, setEmail] = useEmailState();
  const isValidEmail = useIsValidEmailValue();
  const [name, setName] = useNameState();
  const [company, setCompany] = useCompanyState();
  const submittable = useSubmittableValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();
  const snackbarContent = useSnackbarContentValue();
  const loading = useLoadingValue();
  const submit = useSubmit();

  return (
    <>
      <Helmet>
        <title>Pelp ― お問い合わせ</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="logo" height={180} src="/static/icon/icon.png" />
            <Typography variant="h2" sx={{ my: 1 }}>
              お問い合わせ
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
              sx={{ mb: 4 }}
            >
              Pelpのお問い合わせフォームです。
              ヘルプセンターを合わせてご確認ください。
            </Typography>
            <Link
              href="https://different-lantern-6a5.notion.site/Pelp-9cb986ee6721456b8cc0d99a35264959"
              sx={{ mt: 3, ml: 4, ':hover': { cursor: 'pointer' } }}
            >
              バイヤーヘルプセンター
            </Link>
            <Link
              href="https://different-lantern-6a5.notion.site/Pelp-487f92a5f112443a8e24f958b80be0e5"
              sx={{ mt: 3, ml: 4, ':hover': { cursor: 'pointer' } }}
            >
              サプライヤーヘルプセンター
            </Link>
          </Box>
          <Container maxWidth="sm">
            <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
              <Typography variant="h5" align="left" sx={{ my: 1 }}>
                Pelpアカウントの種類
              </Typography>
              <FormControl>
                <RadioGroup
                  value={userType}
                  onChange={(event) => {
                    const value = castToUserType(event.target.value);
                    if (!value) return;
                    setUserType(value);
                  }}
                >
                  <FormControlLabel
                    value="vendor"
                    control={<Radio />}
                    label="サプライヤーアカウントを持っている"
                  />
                  <FormControlLabel
                    value="enterprise"
                    control={<Radio />}
                    label="バイヤーアカウントを持っている"
                  />
                  <FormControlLabel
                    value="both"
                    control={<Radio />}
                    label="サプライヤー・バイヤー両方のアカウントを持っている"
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="アカウントを持っていない"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <Typography variant="h5" align="left" sx={{ my: 1 }}>
                  メールアドレス（必須）
                </Typography>
                <OutlinedInputWrapper
                  type="text"
                  placeholder="example@pelpfinance.com"
                  value={email}
                  error={!isValidEmail && email.length !== 0}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <Typography variant="h5" align="left" sx={{ my: 1 }}>
                  お問い合わせ内容（必須）
                </Typography>
                <TextFieldWrapper
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  multiline
                  minRows={5}
                  maxRows={15}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <Typography variant="h5" align="left" sx={{ my: 1 }}>
                  会社名
                </Typography>
                <OutlinedInputWrapper
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </FormControl>
              <FormControl variant="outlined" fullWidth>
                <Typography variant="h5" align="left" sx={{ my: 1 }}>
                  送信者名
                </Typography>
                <OutlinedInputWrapper
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FormControl>
              <SubmitButton
                loading={loading}
                onClick={submit}
                disabled={!submittable}
                variant="contained"
                size="medium"
                sx={{ mt: 3 }}
              >
                送信
              </SubmitButton>
            </Card>
          </Container>
        </Container>
      </MainContent>
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

export default ContactContent;