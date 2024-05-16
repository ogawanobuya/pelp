import { atomFamily, useRecoilState } from 'recoil';

const isOpenedPopoverState = atomFamily<boolean, string>({
  key: 'CalendarDatePicker_isOpenedPopover_component',
  default: () => false
});
export const useIsOpenedPopoverState = (key: string) =>
  useRecoilState(isOpenedPopoverState(key));