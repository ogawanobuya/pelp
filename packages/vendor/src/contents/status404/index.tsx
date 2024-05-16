import { Box, Typography, Container, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';

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

function Status404Content() {
  return (
    <>
      <Helmet>
        <title>Pelp ― 404</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="logo" height={180} src="/static/icon/icon.png" />
            <Typography variant="h2" sx={{ my: 1 }}>
              Status 404
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
              sx={{ mb: 4 }}
            >
              ページが存在しません。
            </Typography>
            <Button disableRipple component={NavLink} to="/dashboards">
              ダッシュボードに戻る
            </Button>
          </Box>
        </Container>
      </MainContent>
    </>
  );
}

export default Status404Content;