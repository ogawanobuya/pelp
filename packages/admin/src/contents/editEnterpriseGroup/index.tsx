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

import {
  useAddEnterpriseGroup,
  useEnterpriseIdState,
  useLoadingState,
  useWaccState
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

const EditEnterpriseGroup = () => {
  const [enterpriseId, setEnterpriseId] = useEnterpriseIdState();
  const [wacc, setWacc] = useWaccState();
  const [loading] = useLoadingState();
  const addEnterpriseGroup = useAddEnterpriseGroup();

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp ― バイヤーグループの編集</title>
      </Helmet>
      <Container maxWidth="lg">
        <FormControl variant="outlined" fullWidth>
          <Typography variant="h5" align="left" sx={{ mt: 3 }}>
            バイヤーID
          </Typography>
          <OutlinedInputWrapper
            type="text"
            placeholder=""
            value={enterpriseId}
            onChange={(event) => setEnterpriseId(event.target.value)}
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
                '反映'
              )}
            </Box>
          </Button>
        </ButtonBoxWrapper>
      </Container>
    </AuthStateChecker>
  );
};

export default EditEnterpriseGroup;