export const calculateDiscountRate = (
  wacc: number,
  amount: number,
  originalDueDate: Date,
  newPayDate: Date
) => {
  const Le = Math.floor(
    (originalDueDate.getTime() - newPayDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return wacc * (Le / 365) + max(2400 / amount - 0.4, 0) * min(Le / 30, 1);
};

const max = (a: number, b: number) => (a > b ? a : b);
const min = (a: number, b: number) => (a < b ? a : b);