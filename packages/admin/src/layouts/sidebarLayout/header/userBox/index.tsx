import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import {
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  Popover,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { User } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
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
  const [user, setUser] = useState<User>(undefined);
  const init = useRecoilCallback(({ snapshot }) => async () => {
    const userData = await snapshot.getPromise(userDataState);
    setUser(userData);
  });
  useEffect(() => {
    if (!user) init();
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
              {user ? user.email : ''}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user ? user.uid : ''}
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
              {user ? user.email : ''}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user ? user.uid : ''}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
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