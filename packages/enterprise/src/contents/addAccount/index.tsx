import AppsIcon from '@mui/icons-material/Apps';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import AuthStateChecker from 'src/components/authStateChecker';
import CalendarDatePicker from 'src/components/calendarDatePicker';
import PageTitleWrapper from 'src/components/pageTitleWrapper';

import AddAccountContentFormControl from './formControl';
import {
  currencies,
  useAmountState,
  useIsValidValue,
  useIsValidVendorEmailValue,
  useNewPayDateState,
  useOriginalDueDateState,
  useVendorEmailState,
  useVendorNameState,
  useOnChangeCurrency,
  useCurrencyValue,
  useUserConfiguredIdState,
  useAddAccount,
  useLoadingValue,
  useSnackbarContentValue,
  useSnackbarOpenState
} from './localStates';
import PageHeader from './pageHeader';

const SelectWrapper = styled(Select)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    text-align: center;
`
);

const currencyName = (currency: string) => {
  switch (currency) {
    case 'jpy':
      return '日本円 ¥';
    case 'usd':
      return '米ドル $';
    case 'eur':
      return 'ユーロ €';
    default:
      return '';
  }
};

const AddAccountContent = () => {
  const [vendorName, setVendorName] = useVendorNameState();
  const [vendorEmail, setVendorEmail] = useVendorEmailState();
  const isValidVendorEmail = useIsValidVendorEmailValue();
  const [amount, setAmount] = useAmountState();
  const currency = useCurrencyValue();
  const [originalDueDate, setOriginalDueDate] = useOriginalDueDateState();
  const [newPayDate, setNewPayDate] = useNewPayDateState();
  const [userConfiguredId, setUserConfiguredId] = useUserConfiguredIdState();
  const loading = useLoadingValue();
  const onChangeCurrency = useOnChangeCurrency();
  const addAccount = useAddAccount();
  const isValid = useIsValidValue();
  const snackbarContent = useSnackbarContentValue();
  const [snackbarOpen, setSnackbarOpen] = useSnackbarOpenState();

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp ― 請求書の追加</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <AddAccountContentFormControl
          title="取引先"
          placeholder="取引先名称"
          value={vendorName}
          onChange={(event) => setVendorName(event.target.value)}
          icon={<CorporateFareIcon />}
        />
        <AddAccountContentFormControl
          title="取引先メールアドレス"
          error={!isValidVendorEmail}
          placeholder="取引先メールアドレス"
          value={vendorEmail}
          onChange={(event) => setVendorEmail(event.target.value)}
          icon={<MailOutlineIcon />}
        />
        <AddAccountContentFormControl
          type="number"
          title="割引前金額"
          placeholder="割引前金額"
          value={amount}
          onChange={(event) => {
            setAmount(
              Number.isNaN(parseInt(event.target.value, 10))
                ? 0
                : parseInt(event.target.value, 10)
            );
          }}
          icon={<AttachMoneyIcon />}
        />
        <Box width={120}>
          <FormControl variant="outlined" fullWidth>
            <Typography variant="h5" align="left" sx={{ my: 1 }}>
              通貨
            </Typography>
            <SelectWrapper
              value={currency}
              onChange={(event) =>
                onChangeCurrency(event.target.value as string)
              }
              autoWidth
            >
              {currencies.map((c) => (
                <MenuItem key={c} value={c}>
                  {currencyName(c)}
                </MenuItem>
              ))}
            </SelectWrapper>
          </FormControl>
        </Box>
        <Box width={180}>
          <FormControl variant="outlined" fullWidth>
            <Typography variant="h5" align="left" sx={{ my: 1 }}>
              支払い予定日
            </Typography>
            <CalendarDatePicker
              keyStr="originalDueDate"
              date={originalDueDate}
              handleSelect={setOriginalDueDate}
              label="支払い予定日"
            />
          </FormControl>
        </Box>
        <Box width={180}>
          <FormControl variant="outlined" fullWidth>
            <Typography variant="h5" align="left" sx={{ my: 1 }}>
              早払い予定日
            </Typography>
            <CalendarDatePicker
              keyStr="newPayDate"
              date={newPayDate}
              handleSelect={setNewPayDate}
              label="早払い予定日"
            />
          </FormControl>
        </Box>
        <AddAccountContentFormControl
          title="ID（オプション）"
          placeholder=""
          value={userConfiguredId}
          onChange={(event) => setUserConfiguredId(event.target.value)}
          icon={<AppsIcon />}
        />
        <Box>
          <Button
            onClick={addAccount}
            disabled={!isValid}
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
          </Button>
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

export default AddAccountContent;