import {
  Box,
  CircularProgress,
  Container,
  styled,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import {
  useConfigsFetchedValue,
  useFetchConfigs,
  useMaintainanceDataValue
} from 'src/globalStates/config';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
`
);

interface MaintainanceStateCheckerProps {
  children: React.ReactNode;
}

const MaintainanceStateChecker = (props: MaintainanceStateCheckerProps) => {
  const { children } = props;

  const maintainanceData = useMaintainanceDataValue();
  const fetched = useConfigsFetchedValue();
  const loading = useConfigsFetchedValue();
  const fetchConfigs = useFetchConfigs();

  useEffect(() => {
    if (!fetched && !loading) fetchConfigs();
  });

  if (!fetched || !maintainanceData) {
    return (
      <MainContent>
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </Container>
      </MainContent>
    );
  }

  if (maintainanceData.maintainance) {
    return (
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="logo" height={180} src="/static/icon/icon.png" />
            <Typography variant="h2" sx={{ my: 1 }}>
              メンテナンス中
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
              sx={{ mb: 4 }}
            >
              {maintainanceData.message}
            </Typography>
          </Box>
        </Container>
      </MainContent>
    );
  }

  return <Box>{children}</Box>;
};

export default MaintainanceStateChecker;