import { isHoliday } from '@holiday-jp/holiday_jp';
import { subDays } from 'date-fns';

// src/utils/firebase/functions.ts でローカルのTZを Asia/Tokyo にしている
const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay();
  // 土日
  // Date.getDay()は "Sun: 0, Sat: 6"
  if (day === 0 || day === 6) return false;
  const year = date.getFullYear();
  // 年末
  if (new Date(`${year}-12-29`) <= date && date <= new Date(`${year + 1}-1-3`))
    return false;
  // 年始
  if (new Date(`${year - 1}-12-29`) <= date && date <= new Date(`${year}-1-3`))
    return false;
  // 祝日
  if (isHoliday(date)) return false;
  return true;
};

// 営業日のみをカウントするprev日前の日付
export const getPreviousBusinessDay = (date: Date, prev: number): Date => {
  if (prev >= 365)
    throw Error('less than 365 days is allowed as argument prev');
  // ループ終了
  if (prev <= 0) return date;

  // 営業日でないならprevのカウントに入れない
  if (!isBusinessDay(date))
    return getPreviousBusinessDay(subDays(date, 1), prev);

  // 営業日であればprevを減らす
  return getPreviousBusinessDay(subDays(date, 1), prev - 1);
};