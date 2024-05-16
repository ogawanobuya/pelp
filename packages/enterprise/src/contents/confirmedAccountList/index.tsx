import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
  Typography
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
  useShowedAccountsValue
} from './localStates';
import ConfirmedAccountListTableRow from './tableRow';

const ConfirmedAccountListContent = () => {
  const [page, setPage] = usePageState();
  const lastPage = useLastPageValue();
  const accounts = useShowedAccountsValue();
  const initialized = useInitializedValue();

  const initialize = useInitialize();
  const fetchNextPage = useFetchNextPage();

  useEffect(() => {
    if (!initialized) initialize();
  });

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp - 早払い履歴</title>
      </Helmet>
      <PageTitleWrapper>
        <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
          早払い履歴
        </Typography>
        <Typography variant="h5" component="h5">
          過去のPelpでの取引の一覧です。
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
                <Divider sx={{ mb: 8.8 }} />
              </CardHeaderActionWrapper>
              <Divider />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <AccountListTableHeadCell>
                        取引先
                      </AccountListTableHeadCell>
                      <AccountListTableHeadCell>
                        元の支払い日
                      </AccountListTableHeadCell>
                      <AccountListTableHeadCell>
                        早払い日
                      </AccountListTableHeadCell>
                      <AccountListTableHeadCell>
                        早払い金額
                      </AccountListTableHeadCell>
                      <AccountListTableHeadCell>
                        割引率(%)
                      </AccountListTableHeadCell>
                      <AccountListTableHeadCell>
                        割引額
                      </AccountListTableHeadCell>
                      <AccountListTableHeadCell>
                        割引前金額
                      </AccountListTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounts.map((account, index) => (
                      <ConfirmedAccountListTableRow
                        key={account.id}
                        index={index}
                      />
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

export default ConfirmedAccountListContent;