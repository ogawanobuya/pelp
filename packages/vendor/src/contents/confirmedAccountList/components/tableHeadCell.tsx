import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, TableCell } from '@mui/material';
import { FC, ReactNode } from 'react';

interface AccountListTableHeadCellProps {
  children?: ReactNode;
  isSortCriteria?: boolean;
  setSortCriteria?: () => void;
}
const AccountListTableHeadCell: FC<AccountListTableHeadCellProps> = (
  props: AccountListTableHeadCellProps
) => {
  const { children, isSortCriteria, setSortCriteria } = props;

  return (
    <TableCell onClick={setSortCriteria} sx={{ cursor: 'pointer' }}>
      <Box minWidth={100}>
        {isSortCriteria ? <ArrowDropDownIcon sx={{ mb: -0.7 }} /> : null}
        {children}
      </Box>
    </TableCell>
  );
};

export default AccountListTableHeadCell;