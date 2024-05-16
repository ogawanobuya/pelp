import { Box, Container, Typography, styled } from '@mui/material';
import { REACT_APP_VERSION } from 'src/utils/env';

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        pb={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">&copy; 2022 - Pelp</Typography>
        </Box>
        <Box>
          <Typography sx={{ pt: { xs: 2, md: 0 } }} variant="subtitle1">
            version {REACT_APP_VERSION}
          </Typography>
        </Box>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;