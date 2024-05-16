import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUesrDataValue } from 'src/globalStates/authState';
import { REACT_APP_IGNORE_AUTH } from 'src/utils/env';

interface AuthStateCheckerProps {
  children: React.ReactNode;
}
const AuthStateChecker = (props: AuthStateCheckerProps) => {
  const { children } = props;

  const userData = useUesrDataValue();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData.user && !REACT_APP_IGNORE_AUTH) {
      navigate('/sign-in');
      return;
    }
    if (!userData.vendorUser && !REACT_APP_IGNORE_AUTH) {
      navigate('/create-group');
    }
  });

  return <Box>{children}</Box>;
};

export default AuthStateChecker;