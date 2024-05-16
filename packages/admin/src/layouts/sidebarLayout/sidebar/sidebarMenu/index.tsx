import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import TableRowsIcon from '@mui/icons-material/TableRows';
import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import { MouseEventHandler } from 'react';
import { NavLink } from 'react-router-dom';

import { useIsSidebarVisibleState } from '../../localStates';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  'transform',
                  'opacity'
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

interface SidebarMenuListItemProps {
  onClick?: MouseEventHandler | undefined;
  to: string;
  text: string;
  startIcon?: React.ReactNode;
}
const SidebarMenuListItem = (props: SidebarMenuListItemProps) => {
  const { onClick, to, text, startIcon } = props;
  return (
    <ListItem component="div">
      <Button
        disableRipple
        component={NavLink}
        onClick={onClick}
        to={to}
        startIcon={startIcon}
      >
        {text}
      </Button>
    </ListItem>
  );
};

interface SidebarMenuListAndSubheaderProps {
  text: string;
  children?: React.ReactNode;
}
const SidebarMenuListAndSubheader = (
  props: SidebarMenuListAndSubheaderProps
) => {
  const { text, children } = props;
  return (
    <List
      component="div"
      subheader={
        <ListSubheader component="div" disableSticky>
          {text}
        </ListSubheader>
      }
    >
      <SubMenuWrapper>
        <List component="div">{children}</List>
      </SubMenuWrapper>
    </List>
  );
};

const SidebarMenu = () => {
  const [, setIsSidebarVisible] = useIsSidebarVisibleState();
  const closeSidebar = () => setIsSidebarVisible(false);

  return (
    <MenuWrapper>
      <SidebarMenuListAndSubheader text="請求書">
        <SidebarMenuListItem
          to="/dashboards/account-list"
          text="請求書一覧"
          onClick={closeSidebar}
          startIcon={<TableRowsIcon />}
        />
        <SidebarMenuListItem
          to="/dashboards/confirmed-account-list"
          text="請求書履歴"
          onClick={closeSidebar}
          startIcon={<HistoryIcon />}
        />
      </SidebarMenuListAndSubheader>
      <SidebarMenuListAndSubheader text="バイヤー">
        <SidebarMenuListItem
          to="/dashboards/add-enterprise-group"
          text="グループ新規作成"
          onClick={closeSidebar}
          startIcon={<AddIcon />}
        />
        <SidebarMenuListItem
          to="/dashboards/edit-enterprise-group"
          text="グループ編集"
          onClick={closeSidebar}
          startIcon={<EditIcon />}
        />
      </SidebarMenuListAndSubheader>
    </MenuWrapper>
  );
};

export default SidebarMenu;