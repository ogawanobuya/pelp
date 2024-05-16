export const isSameDate = (d1: Date, d2: Date) => {
  if (!d1 || !d2) return false;
  if (d1.getFullYear() !== d2.getFullYear()) return false;
  if (d1.getMonth() !== d2.getMonth()) return false;
  if (d1.getDate() !== d2.getDate()) return false;
  return true;
};