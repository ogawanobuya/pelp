import { Grid, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import AuthStateChecker from 'src/components/authStateChecker';
import PageTitleWrapper from 'src/components/pageTitleWrapper';

import ActiveAccountListTable from './lists/active';
import AdjustedAccountListTable from './lists/adjusted';
import InactiveAccountListTable from './lists/inactive';
import PaidAccountListTable from './lists/paid';
import { useTabState } from './localStates';
import PageHeader from './pageHeader';

interface AccountListProps {
  tab: number;
}
const AccountList = (props: AccountListProps) => {
  const { tab } = props;
  switch (tab) {
    case 0:
      return <InactiveAccountListTable />;
    case 2:
      return <ActiveAccountListTable />;
    case 3:
      return <AdjustedAccountListTable />;
    case 4:
      return <PaidAccountListTable />;
    default:
      return null;
  }
};

const AccountListContent = () => {
  const [tab] = useTabState();

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp - 請求書一覧</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
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
            <AccountList tab={tab} />
          </Grid>
        </Grid>
      </Container>
    </AuthStateChecker>
  );
};

export default AccountListContent;