import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Button, Divider, IconButton } from '@mui/material';

import AccountListTabs from '../../components/tabs';

import {
  useCheckedValue,
  useIsOpenSetAsPaidModalState,
  useReload
} from './localStates';

const AdjustedAccountListCardHeaderAction = () => {
  const checked = useCheckedValue();
  const [, setOpen] = useIsOpenSetAsPaidModalState();
  const reload = useReload();

  const numberOfChecked = checked.filter((c) => c).length;

  return (
    <>
      <AccountListTabs />
      <Divider sx={{ mb: 1 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          onClick={() => setOpen(true)}
          disabled={checked.every((c) => !c)}
          sx={{ width: 200, height: 30 }}
          variant="contained"
        >
          {checked.filter((c) => c).length > 1
            ? `${numberOfChecked} 件を支払い済みにする`
            : '支払い済みにする'}
        </Button>
        <IconButton onClick={reload} size="small">
          <ReplayIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default AdjustedAccountListCardHeaderAction;