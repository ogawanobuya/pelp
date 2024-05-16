import { Timestamp, isTimestamp } from '../../utils/timestamp';

export interface Account {
  id: string; // ドキュメントID
  enterpriseId: string; // ドキュメントを作成したバイヤーのID
  enterpriseName: string; // バイヤーの社名
  enterpriseEmails: Array<string>; // バイヤーのメールアドレス
  vendorId?: string; // サプライヤーのID
  vendorName: string; // サプライヤーの社名
  vendorEmail: string; // サプライヤーのメールアドレス
  amount: number; // 金額
  currency: AccountCurrency; // 通貨
  discountRate?: number; // 1 - (amount - discountAmount) / amount
  discountAmount?: number; // 割引額
  amountAfterDiscount?: number; // amount - discountAmount - vendorCommission
  vendorCommission?: number; // 手数料
  discountRateIncludingCommision?: number; // 1 - amountAfterDiscount / amount
  originalDueDate: Timestamp; // 元の支払い日
  newPayDate: Timestamp; // 早払い日
  payDate: Timestamp; // 最初は元の支払日で早払いが確定すると早払い日になる
  activatedAt?: Timestamp; // オファー送信のタイムスタンプ
  adjustedAt?: Timestamp; // 早払い成立のタイムスタンプ
  paidAt?: Timestamp; // バイヤーの入金登録のタイムスタンプ
  confirmedAt?: Timestamp; // サプライヤーの入金確認登録のタイムスタンプ
  status: AccountStatus; // フローの中のどの状態か
  statusNumber: number; // statusでソートするための値
  searchMap: object; // 検索用のBi-Gramのマップ
  index: string; // 唯一性担保用の文字列 indices/{enterpriseId}/accountIndices/{accountIndex} のID
  userConfiguredId?: string; // 唯一性担保のためにユーザーが設定するID
  createdAt: Timestamp; // ドキュメント作成のタイムスタンプ
  lastEditedAt: Timestamp; // ドキュメント最終編集のタイムスタンプ
}

export const isAccount = (account: any) => {
  const {
    id,
    enterpriseId,
    enterpriseName,
    enterpriseEmails,
    vendorName,
    vendorEmail,
    amount,
    currency,
    originalDueDate,
    newPayDate,
    payDate,
    status,
    statusNumber,
    searchMap,
    index,
    createdAt,
    lastEditedAt
  } = account;
  if (typeof id !== 'string') return false;
  if (typeof enterpriseId !== 'string') return false;
  if (typeof enterpriseName !== 'string') return false;
  if (!Array.isArray(enterpriseEmails)) return false;
  if (!enterpriseEmails.every((item) => typeof item === 'string')) return false;
  if (typeof vendorName !== 'string') return false;
  if (typeof vendorEmail !== 'string') return false;
  if (typeof amount !== 'number') return false;
  if (typeof currency !== 'string') return false;
  if (!isAccountCurrency(currency)) return false;
  if (!isTimestamp(originalDueDate)) return false;
  if (!isTimestamp(newPayDate)) return false;
  if (!isTimestamp(payDate)) return false;
  if (typeof status !== 'string') return false;
  if (typeof statusNumber !== 'number') return false;
  if (!isAccountStatus(status)) return false;
  if (typeof searchMap !== 'object') return false;
  if (typeof index !== 'string') return false;
  if (
    !Object.keys(searchMap).every(
      (key) => typeof key === 'string' && searchMap[key] === true
    )
  )
    return false;
  if (!isTimestamp(createdAt)) return false;
  if (!isTimestamp(lastEditedAt)) return false;
  return true;
};

export const castToAccount = (account: any): Account | null => {
  if (isAccount(account)) return account as Account;
  return null;
};

const CURRENCY = { jpy: 'jpy', usd: 'usd', eur: 'eur' } as const;
export type AccountCurrency = typeof CURRENCY[keyof typeof CURRENCY];

export const isAccountCurrency = (arg: string) =>
  arg === 'jpy' || arg === 'usd' || arg === 'eur';

export const castToAccountCurrency = (arg: string): AccountCurrency | null => {
  if (isAccountCurrency(arg)) return arg as AccountCurrency;
  return null;
};

const STATUS = {
  inactive: 'inactive', // 登録のみで早払い募集をしていない
  active: 'active', // 早払い請求募集中
  adjusted: 'adjusted', // 早払い成立・払込待ち
  paid: 'paid', // バイヤーが入金したと設定
  confirmed: 'confirmed', // サプライヤーが入金確認
  expired: 'expired', // newPaydate ~ originalDueDate
  outdated: 'outdated' // originalDueDate ~
} as const;
export type AccountStatus = typeof STATUS[keyof typeof STATUS];

export const isAccountStatus = (arg: string) =>
  arg === 'inactive' ||
  arg === 'active' ||
  arg === 'adjusted' ||
  arg === 'paid' ||
  arg === 'confirmed' ||
  arg === 'expired' ||
  arg === 'outdated';

export const castToAccountStatus = (arg: string): AccountStatus | null => {
  if (isAccountStatus(arg)) return arg as AccountStatus;
  return null;
};

const SORT_CRITERIA = {
  accountId: 'id',
  enterpriseName: 'enterpriseName',
  vendorName: 'vendorName',
  amount: 'amount',
  discountRate: 'discountRate',
  originalDueDate: 'originalDueDate',
  newPayDate: 'newPayDate',
  payDate: 'payDate',
  activatedAt: 'activatedAt',
  adjustedAt: 'adjustedAt',
  paidAt: 'paidAt',
  confirmedAt: 'confirmedAt'
} as const;
export type AccountSortCriteria =
  typeof SORT_CRITERIA[keyof typeof SORT_CRITERIA];