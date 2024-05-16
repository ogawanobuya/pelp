import AddIcon from '@mui/icons-material/Add';
// TODO: #47
// import DashboardIcon from '@mui/icons-material/Dashboard';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import TableRowsIcon from '@mui/icons-material/TableRows';
import UploadIcon from '@mui/icons-material/Upload';
import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import { EnterpriseUser } from 'pelp-repositories/src';
import { MouseEventHandler, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { userDataState } from 'src/globalStates/authState';

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
  to?: string;
  text: string;
  startIcon?: React.ReactNode;
  visible?: boolean;
}
const SidebarMenuListItem = (props: SidebarMenuListItemProps) => {
  const { onClick, to, text, startIcon, visible = true } = props;
  if (!visible) return <Box />;
  return (
    <ListItem>
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

interface SidebarMenuHrefListItemProps {
  href: string;
  onClick?: MouseEventHandler | undefined;
  text: string;
  startIcon?: React.ReactNode;
  visible?: boolean;
}
const SidebarMenuHrefListItem = (props: SidebarMenuHrefListItemProps) => {
  const { href, onClick, text, startIcon, visible = true } = props;
  if (!visible) return <Box />;
  return (
    <ListItem>
      <Button href={href} disableRipple onClick={onClick} startIcon={startIcon}>
        {text}
      </Button>
    </ListItem>
  );
};

interface SidebarMenuListAndSubheaderProps {
  text: string;
  children?: React.ReactNode;
  visible?: boolean;
}
const SidebarMenuListAndSubheader = (
  props: SidebarMenuListAndSubheaderProps
) => {
  const { text, children, visible = true } = props;
  if (!visible) return <Box />;
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

  // Recoilの値にアクセスできるようになるのを待ってからgetRecoilValueを実行
  // 遅延読み込みの外側ではこの処理が必要
  const [enterpriseUser, setEnterpriseUser] =
    useState<EnterpriseUser>(undefined);
  const isGroupAdmin = enterpriseUser ? enterpriseUser.isGroupAdmin : false;
  const init = useRecoilCallback(({ snapshot }) => async () => {
    const userData = await snapshot.getPromise(userDataState);
    setEnterpriseUser(userData.enterpriseUser);
  });
  useEffect(() => {
    if (!enterpriseUser) init();
  });

  return (
    <MenuWrapper>
      {
        // TODO: #47
        /* <SidebarMenuListAndSubheader text="ホーム">
        <SidebarMenuListItem
          to="/dashboards/home"
          text="ダッシュボード"
          onClick={closeSidebar}
          startIcon={<DashboardIcon />}
        />
      </SidebarMenuListAndSubheader> */
      }
      <SidebarMenuListAndSubheader text="請求書管理">
        <SidebarMenuListItem
          to="/dashboards/account-list"
          text="請求書一覧"
          onClick={closeSidebar}
          startIcon={<TableRowsIcon />}
        />
        <SidebarMenuListItem
          to="/dashboards/add-account"
          text="請求書の追加"
          onClick={closeSidebar}
          startIcon={<AddIcon />}
        />
        <SidebarMenuListItem
          to="/dashboards/payment-schedule"
          text="支払い予定"
          onClick={closeSidebar}
          startIcon={<EventNoteIcon />}
        />
        <SidebarMenuListItem
          to="/dashboards/import-csv"
          text="CSVインポート"
          onClick={closeSidebar}
          startIcon={<UploadIcon />}
        />
        <SidebarMenuListItem
          to="/dashboards/confirmed-account-list"
          text="早払い履歴"
          onClick={closeSidebar}
          startIcon={<HistoryIcon />}
        />
      </SidebarMenuListAndSubheader>
      <SidebarMenuListAndSubheader text="設定" visible={isGroupAdmin}>
        <SidebarMenuListItem
          to="/dashboards/edit-group"
          text="バイヤー情報編集"
          onClick={closeSidebar}
          startIcon={<PersonIcon />}
        />
        <SidebarMenuListItem
          to="/dashboards/edit-users"
          text="アカウント管理"
          onClick={closeSidebar}
          startIcon={<GroupsIcon />}
        />
      </SidebarMenuListAndSubheader>
      <SidebarMenuListAndSubheader text="ヘルプ">
        <SidebarMenuHrefListItem
          href="https://support.pelpfinance.com/contact"
          text="問い合わせ"
          onClick={closeSidebar}
          startIcon={<ContactSupportIcon />}
        />
        <SidebarMenuHrefListItem
          href="https://different-lantern-6a5.notion.site/Pelp-9cb986ee6721456b8cc0d99a35264959"
          text="ヘルプセンター"
          onClick={closeSidebar}
          startIcon={<HelpCenterIcon />}
        />
      </SidebarMenuListAndSubheader>
    </MenuWrapper>
  );
};

export default SidebarMenu;