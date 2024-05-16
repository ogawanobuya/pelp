import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Grid,
  Container,
  Card,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableCell,
  Box
} from '@mui/material';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AuthStateChecker from 'src/components/authStateChecker';
import PageTitleWrapper from 'src/components/pageTitleWrapper';

import {
  CardHeaderActionWrapper,
  TablePaginationWrapper
} from './components/styled';
import AccountListTableHeadCell from './components/tableHeadCell';
import {
  useFetchNextPage,
  useInitialize,
  useInitializedValue,
  useLastPageValue,
  usePageState,
  useReload,
  useShowedAccountsValue
} from './localStates';
import PaymentScheduleTableRow from './tableRow';

const PaymentScheduleContent = () => {
  const [page, setPage] = usePageState();
  const lastPage = useLastPageValue();
  const accounts = useShowedAccountsValue();
  const initialized = useInitializedValue();

  const initialize = useInitialize();
  const fetchNextPage = useFetchNextPage();
  const reload = useReload();

  useEffect(() => {
    if (!initialized) initialize();
  });

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp - 支払い予定</title>
      </Helmet>
      <PageTitleWrapper>
        <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
          支払い予定
        </Typography>
        <Typography variant="h5" component="h5">
          Pelpに登録した請求書の支払い予定です。
          <br />
          早払いすることが確定した請求書は割引後の金額を表示しています。
        </Typography>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card>
              <CardHeaderActionWrapper>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                  sx={{ mt: 1 }}
                >
                  <IconButton onClick={reload} size="small">
                    <ReplayIcon />
                  </IconButton>
                </Box>
              </CardHeaderActionWrapper>
              <Divider />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <AccountListTableHeadCell>
                        取引先
                      </AccountListTableHeadCell>
                      <AccountListTableHeadCell>
                        支払い日
                      </AccountListTableHeadCell>
                      <AccountListTableHeadCell>
                        支払い金額
                      </AccountListTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounts.map((account, index) => (
                      <PaymentScheduleTableRow key={account.id} index={index} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePaginationWrapper display="flex" p={2}>
                <IconButton
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  size="small"
                  sx={{ mr: 2 }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                  disabled={page === lastPage}
                  onClick={() => {
                    setPage(page + 1);
                    fetchNextPage();
                  }}
                  size="small"
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </TablePaginationWrapper>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AuthStateChecker>
  );
};

export default PaymentScheduleContent;