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

  const user = useUesrDataValue();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !REACT_APP_IGNORE_AUTH) navigate('/sign-in');
  });

  return <Box>{children}</Box>;
};

export default AuthStateChecker;