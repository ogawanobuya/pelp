import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import {
  Box,
  alpha,
  lighten,
  IconButton,
  Tooltip,
  styled,
  useTheme
} from '@mui/material';

import { useIsSidebarVisibleState } from '../localStates';

import HeaderUserbox from './userBox';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: flex-end;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

/*
const EnabledNotificationsIconWrapper = styled(Box)(
  () => `
        &:after {
          content: "●";
          font-size: 15px;
          position: absolute;
          right: 10px;
          top: 7px;
          color: red;
        }
`
);
*/

function Header() {
  const [isSidebarVisible, setIsSidebarVisible] = useIsSidebarVisibleState();
  const toggleSidebar = () => {
    if (isSidebarVisible) setIsSidebarVisible(false);
    else setIsSidebarVisible(true);
  };
  const theme = useTheme();

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 1px 0 ${alpha(
                lighten(theme.colors.primary.main, 0.7),
                0.15
              )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
            : `0px 2px 8px -3px ${alpha(
                theme.colors.alpha.black[100],
                0.2
              )}, 0px 5px 22px -4px ${alpha(
                theme.colors.alpha.black[100],
                0.1
              )}`
      }}
    >
      <HeaderUserbox />
      <Box
        component="span"
        sx={{
          ml: 2,
          display: { lg: 'none', xs: 'inline-block' }
        }}
      >
        <Tooltip arrow title="Toggle Menu">
          <IconButton color="primary" onClick={toggleSidebar}>
            {!isSidebarVisible ? (
              <MenuTwoToneIcon fontSize="small" />
            ) : (
              <CloseTwoToneIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;