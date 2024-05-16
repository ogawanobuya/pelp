import {
  Box,
  Typography,
  Container,
  Button,
  FormControl,
  styled,
  OutlinedInput,
  CircularProgress
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import AuthStateChecker from 'src/components/authStateChecker';

import { useWaccState } from '../editEnterpriseGroup/localStates';

import {
  useAddEnterpriseGroup,
  useAdminEmailState,
  useEmailsStringState,
  useIsValidAdminEmailValue,
  useIsValidEmailsValue,
  useLoadingState,
  useNameState
} from './localStates';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

const ButtonBoxWrapper = styled(Box)(
  () => `
    justify-content: center;
`
);

const AddEnterpriseGroup = () => {
  const [name, setName] = useNameState();
  const [adminEmail, setAdminEmail] = useAdminEmailState();
  const [emails, setEmails] = useEmailsStringState();
  const [wacc, setWacc] = useWaccState();
  const isValidAdminEmail = useIsValidAdminEmailValue();
  const isValidEmails = useIsValidEmailsValue();
  const addEnterpriseGroup = useAddEnterpriseGroup();
  const [loading] = useLoadingState();

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp ― バイヤーグループの追加</title>
      </Helmet>
      <Container maxWidth="lg">
        <FormControl variant="outlined" fullWidth>
          <Typography variant="h5" align="left" sx={{ mt: 3 }}>
            バイヤーメールアドレス（半角カンマ区切り）
          </Typography>
          <OutlinedInputWrapper
            type="text"
            placeholder="a@pelpfinance.com, b@pelpfinance.com"
            value={emails}
            onChange={(event) => setEmails(event.target.value)}
            error={!isValidEmails}
          />
        </FormControl>
        <FormControl variant="outlined" fullWidth>
          <Typography variant="h5" align="left" sx={{ mt: 3 }}>
            バイヤー名
          </Typography>
          <OutlinedInputWrapper
            type="text"
            placeholder="株式会社〇〇"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormControl>
        <FormControl variant="outlined" fullWidth>
          <Typography variant="h5" align="left" sx={{ mt: 3 }}>
            初期ユーザーメールアドレス
          </Typography>
          <OutlinedInputWrapper
            type="text"
            placeholder="email@pelpfinance.com"
            value={adminEmail}
            onChange={(event) => setAdminEmail(event.target.value)}
            error={!isValidAdminEmail}
          />
        </FormControl>
        <FormControl variant="outlined" fullWidth>
          <Typography variant="h5" align="left" sx={{ mt: 3 }}>
            WACC
          </Typography>
          <OutlinedInputWrapper
            type="number"
            placeholder="0.06"
            value={wacc}
            onChange={(event) =>
              setWacc(
                Number.isNaN(parseFloat(event.target.value))
                  ? 0
                  : parseFloat(event.target.value)
              )
            }
          />
        </FormControl>
        <ButtonBoxWrapper display="flex" sx={{ mt: 5 }}>
          <Button variant="contained" onClick={addEnterpriseGroup}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={120}
              height={25}
            >
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                '登録'
              )}
            </Box>
          </Button>
        </ButtonBoxWrapper>
      </Container>
    </AuthStateChecker>
  );
};

export default AddEnterpriseGroup;