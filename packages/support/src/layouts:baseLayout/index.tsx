import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { FC, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from 'src/components/footer';

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <Box>
      {children || <Outlet />}
      <Footer />
    </Box>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;