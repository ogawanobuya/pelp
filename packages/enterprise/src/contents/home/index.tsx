import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  useTheme
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import AuthStateChecker from 'src/components/authStateChecker';
import PageTitleWrapper from 'src/components/pageTitleWrapper';

import HomeNotifications from './notifications';

interface GridItemCardProps {
  title: string;
  contentColor?: string;
  content: string;
}
const GridItemCard = (props: GridItemCardProps) => {
  const { title, contentColor, content } = props;
  const theme = useTheme();

  return (
    <Grid xs={12} sm={12} md={3} item>
      <Card sx={{ px: 1 }}>
        <CardContent>
          <Typography variant="h5" noWrap>
            {title}
          </Typography>
          <Box
            sx={{
              pt: 3
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              noWrap
              sx={{
                color: contentColor ?? theme.colors.alpha.black[100]
              }}
            >
              {content}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

const HomeContent = () => {
  const theme = useTheme();

  return (
    <AuthStateChecker>
      <Helmet>
        <title>Pelp - ダッシュボード</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
              ダッシュボード
            </Typography>
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 2 }}>
          今月の買掛金
        </Typography>
        <Grid container spacing={3}>
          <GridItemCard title="総額" content="¥100,000,000" />
          <GridItemCard
            title="支払い済み"
            contentColor={theme.colors.success.main}
            content="¥10,000,000"
          />
          <GridItemCard
            title="未支払い"
            contentColor={theme.colors.error.dark}
            content="¥90,000,000"
          />
          <GridItemCard title="割引総額" content="¥100,000" />
        </Grid>
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          sx={{ mt: 2, mb: 2 }}
        >
          先月の買掛金
        </Typography>
        <Grid container spacing={3}>
          <GridItemCard title="総額" content="¥100,000,000" />
          <GridItemCard title="割引総額" content="¥100,000" />
        </Grid>
        <Box sx={{ mt: 3 }}>
          <HomeNotifications />
        </Box>
      </Container>
    </AuthStateChecker>
  );
};

export default HomeContent;