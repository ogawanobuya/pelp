import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TableCell } from '@mui/material';
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
      {isSortCriteria ? <ArrowDropDownIcon sx={{ mb: -0.7 }} /> : null}
      {children}
    </TableCell>
  );
};

export default AccountListTableHeadCell;