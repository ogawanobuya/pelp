import { Box, styled } from '@mui/material';

export const CardHeaderActionWrapper = styled(Box)(
  ({ theme }) => `
  margin: 2px 0 8px 0;
  justify-content: space-around;
  flex-wrap: wrap;
  color: ${theme.header.textColor};
  padding: ${theme.spacing(0, 2)};
  right: 0;
  box-sizing: border-box;
`
);

export const TablePaginationWrapper = styled(Box)(
  ({ theme }) => `
  margin: 5px 0;
  justify-content: flex-end;
  color: ${theme.header.textColor};
  padding: ${theme.spacing(0, 2)};
  right: 0;
`
);