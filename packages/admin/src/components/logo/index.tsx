import { Box, styled } from '@mui/material';
import { Link } from 'react-router-dom';

const LogoWrapper = styled(Link)(
  () => `
        margin: auto auto;
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 38px;
`
);

function Logo() {
  return (
    <LogoWrapper to="/">
      <LogoSignWrapper>
        <img alt="logo" height={52} src="/static/icon/icon.png" />
      </LogoSignWrapper>
    </LogoWrapper>
  );
}

export default Logo;