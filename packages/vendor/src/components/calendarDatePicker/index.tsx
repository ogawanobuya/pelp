import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
  Box,
  FormControl,
  Typography,
  Popover,
  useTheme,
  styled,
  Button
} from '@mui/material';
import { useRef } from 'react';
import { Calendar } from 'react-date-range';

import { useIsOpenedPopoverState } from './localStates';

const CalendarDatePickerButton = styled(Button)(
  ({ theme }) => `
    height: 53px;
    color: ${theme.header.textColor};
    border-color: ${theme.palette.grey[50]};
    background-color: ${theme.colors.alpha.white[100]};
`
);

interface CalendarDatePickerProps {
  width?: number;
  label: string;
  date?: Date;
  handleSelect: (date: Date) => void;
  keyStr: string;
  disabled?: boolean;
}
const CalendarDatePicker = (props: CalendarDatePickerProps) => {
  const { width, label, date, handleSelect, keyStr, disabled } = props;
  const [isOpenedPopover, setIsOpenedPopover] = useIsOpenedPopoverState(keyStr);
  const theme = useTheme();
  const ref = useRef();

  return (
    <Box width={width ?? 190} sx={{ mr: 2, mt: -1 }}>
      <FormControl variant="outlined" fullWidth>
        <Typography
          width={62}
          variant="caption"
          align="left"
          sx={{
            fontSize: 10,
            mb: -1,
            ml: 1,
            zIndex: 1,
            backgroundColor: theme.colors.alpha.white[100]
          }}
        >
          {label}
        </Typography>
        <CalendarDatePickerButton
          variant="outlined"
          id="originalDueDateFilter"
          onClick={() => setIsOpenedPopover(true)}
          ref={ref}
          sx={{
            borderColor: theme.colors.alpha.black[30],
            '&.MuiButtonBase-root:hover': {
              bgcolor: 'transparent',
              borderColor: theme.colors.alpha.black[70]
            }
          }}
          disabled={disabled ?? false}
        >
          {date ? <CalendarMonthIcon sx={{ mr: 1 }} /> : null}
          {date
            ? `${date.getFullYear()}年${
                date.getMonth() + 1
              }月${date.getDate()}日`
            : null}
        </CalendarDatePickerButton>
        <Popover
          id="originalDueDateFilter"
          open={isOpenedPopover}
          anchorEl={ref.current}
          onClose={() => setIsOpenedPopover(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <Calendar date={date} onChange={handleSelect} />
        </Popover>
      </FormControl>
    </Box>
  );
};

export default CalendarDatePicker;