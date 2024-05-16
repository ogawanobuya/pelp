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
import { DateRange, Range } from 'react-date-range';

import { useIsOpenedPopoverState } from './localStates';

const dateRangeStr = (start?: Date, end?: Date): string => {
  if (!start && !end) return '';
  if (!start)
    return `
      〜 ${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}
    `;
  if (!end)
    return `
      ${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()} 〜
    `;
  return `
    ${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()} 〜
    ${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}
  `;
};

const DateRangePickerButton = styled(Button)(
  ({ theme }) => `
    height: 53px;
    color: ${theme.header.textColor};
    border-color: ${theme.palette.grey[50]};
    background-color: ${theme.colors.alpha.white[100]};
`
);

interface DateRangePickerProps {
  label: string;
  handleSelect: (startDate?: Date, endDate?: Date) => void;
  startDate: Date;
  endDate: Date;
  keyStr: string;
}
const DateRangePicker = (props: DateRangePickerProps) => {
  const { label, handleSelect, startDate, endDate, keyStr } = props;
  const range: Range = { startDate, endDate, key: keyStr };

  const [isOpenedPopover, setIsOpenedPopover] = useIsOpenedPopoverState(keyStr);
  const theme = useTheme();
  const ref = useRef();

  return (
    <Box width={240} sx={{ mr: 2, mt: -1 }}>
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
        <DateRangePickerButton
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
        >
          <CalendarMonthIcon sx={{ mr: 1 }} />
          {dateRangeStr(startDate, endDate)}
        </DateRangePickerButton>
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
          <DateRange
            ranges={[range]}
            onChange={(ranges) => {
              const r = ranges[keyStr] as Range;
              if (!r) return;
              const sd = r.startDate;
              const ed = r.endDate;
              handleSelect(sd, ed);
            }}
            moveRangeOnFirstSelection={false}
          />
        </Popover>
      </FormControl>
    </Box>
  );
};

export default DateRangePicker;