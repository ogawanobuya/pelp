import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import {
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { VendorUser } from 'pelp-repositories/src';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';
import { userDataState } from 'src/globalStates/authState';

import { signOut } from '../../localStates';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  // Recoilの値にアクセスできるようになるのを待ってからgetRecoilValueを実行
  // 遅延読み込みの外側ではこの処理が必要
  const [vendorUser, setVendorUser] = useState<VendorUser>(undefined);
  const isGroupAdmin = vendorUser ? vendorUser.isGroupAdmin : false;
  const init = useRecoilCallback(({ snapshot }) => async () => {
    const userData = await snapshot.getPromise(userDataState);
    setVendorUser(userData.vendorUser);
  });
  useEffect(() => {
    if (!vendorUser) init();
  });

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {vendorUser ? vendorUser.vendorName : ''}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {vendorUser ? vendorUser.email : ''}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {vendorUser ? vendorUser.vendorName : ''}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {vendorUser ? vendorUser.email : ''}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          {isGroupAdmin ? (
            <ListItem button to="/dashboards/edit-group" component={NavLink}>
              <AccountTreeTwoToneIcon fontSize="small" />
              <ListItemText primary="サプライヤー情報編集" />
            </ListItem>
          ) : (
            <Box />
          )}
          {isGroupAdmin ? (
            <ListItem button to="/dashboards/edit-users" component={NavLink}>
              <GroupsIcon fontSize="small" />
              <ListItemText primary="アカウント管理" />
            </ListItem>
          ) : (
            <Box />
          )}
          <ListItem
            button
            component="a"
            href="https://support.pelpfinance.com/contact"
          >
            <ContactSupportIcon fontSize="small" />
            <ListItemText primary="問い合わせ" />
          </ListItem>
          <ListItem
            button
            component="a"
            href="https://different-lantern-6a5.notion.site/Pelp-487f92a5f112443a8e24f958b80be0e5"
          >
            <HelpCenterIcon fontSize="small" />
            <ListItemText primary="ヘルプセンター" />
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={signOut}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            ログアウト
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;