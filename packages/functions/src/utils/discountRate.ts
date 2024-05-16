interface DiscountInfo {
  discountRate: number; // 1 - (amount - discountAmount) / amount
  discountAmount: number; // 割引額
  discountRateIncludingCommision: number; // 1 - amountAfterDiscount / amount
  vendorCommission: number; // 手数料
  amountAfterDiscount: number; // amount - discountAmount - vendorCommission
}

export const calculateDiscountRate = (
  wacc: number,
  amount: number,
  originalDueDate: Date,
  newPayDate: Date
): DiscountInfo => {
  // 早払い予定日と元の支払日の日数差
  const Le = Math.floor(
    (originalDueDate.getTime() - newPayDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  // wacc を日数差で割戻す
  // 少額の場合にはその-1乗に比例する額を上乗せする
  // 上乗せ分はそのままだと非有界なので10%で抑える
  const discountRate_temp = wacc * (Le / 365) + min(0.1, max(3600 / amount, 0));
  // 1000 未満は切り上げ
  // 1000 以上の数を2回引くので amount が 2000 以下なら ceil を外す
  const discountAmount_temp = Math.floor(amount * discountRate_temp);
  const discountAmount =
    amount > 2000
      ? Math.ceil(discountAmount_temp / 1000) * 1000
      : discountAmount_temp;
  const discountRate = 1 - (amount - discountAmount) / amount;
  // 1000 未満は切り上げ
  // 1000 以上の数を2回引くので amount が 2000 以下なら ceil を外す
  const vendorCommission_temp = Math.floor((amount - discountAmount) * 0.005);
  const vendorCommission =
    amount > 2000
      ? Math.ceil(vendorCommission_temp / 1000) * 1000
      : vendorCommission_temp;
  const amountAfterDiscount = amount - discountAmount - vendorCommission;
  const discountRateIncludingCommision = 1 - amountAfterDiscount / amount;
  return {
    discountRate,
    discountAmount,
    discountRateIncludingCommision,
    vendorCommission,
    amountAfterDiscount
  };
};

const max = (a: number, b: number) => (a > b ? a : b);
const min = (a: number, b: number) => (a < b ? a : b);