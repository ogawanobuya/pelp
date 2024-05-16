import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Button, Divider, IconButton } from '@mui/material';

import AccountListTabs from '../../components/tabs';

import {
  useCheckedValue,
  useIsOpenAdjustModalState,
  useReload
} from './localStates';

const ActiveAccountListCardHeaderAction = () => {
  const checked = useCheckedValue();
  const [, setOpen] = useIsOpenAdjustModalState();
  const reload = useReload();

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
            ? '一括でオファーを受諾する'
            : 'オファーを受諾する'}
        </Button>
        <IconButton onClick={reload} size="small">
          <ReplayIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default ActiveAccountListCardHeaderAction;