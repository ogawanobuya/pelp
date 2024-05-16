import { FirebaseApp } from '@firebase/app';
import * as CSV from 'csv-string';
import * as DateFns from 'date-fns';
import { Timestamp } from 'firebase/firestore';

import { fetchDoc } from '../../helpers/firestoreHelper';
import { accountindexDocRef } from '../../refs';
import { generateAccountIndex } from '../../utils/accountIndex';
import { generateBiGramObject } from '../../utils/biGram';
import { isValidAsEmail } from '../../utils/isValidAsEmail';
import { randomString } from '../../utils/randomString';
import { generateAccountStatusNumber } from '../../utils/statusNumber';
import { EnterpriseUser } from '../enterpriseUser';

import { Account, castToAccountCurrency } from '.';

const tryParseDate = (
  dateString: string,
  formatString: string
): Timestamp | null => {
  try {
    const date = DateFns.parse(dateString, formatString, Date.now());
    return Timestamp.fromDate(date);
  } catch (e) {
    return null;
  }
};

interface GetAccountsFromCsvStringArgs {
  app: FirebaseApp;
  csvStr: string;
  user: EnterpriseUser;
  skipFirstRow?: boolean;
  dateFormat?: string;
}
interface GetAccountsFromCsvStringResult {
  accounts: Array<Account>;
  errorMessages: Array<string>;
  warningMessages: Array<string>;
  result: boolean;
}

/**
 * | column | name | format |
 * | ---- | ---- | ---- |
 * | 0 | vendorName | string |
 * | 1 | amount | number |
 * | 2 | originalDueDate | date (yyyy/mm/dd by default) |
 * | 3 | newPayDate | date (yyyy/mm/dd by defaut) |
 * | 4 | vendorEmail | string |
 * | 5 | userConfiguredId | string? |
 * | 6 | currency | string? |
 */
export const getAccountsFromCsvString = async (
  args: GetAccountsFromCsvStringArgs
): Promise<GetAccountsFromCsvStringResult> => {
  const {
    app,
    csvStr,
    user,
    skipFirstRow = false,
    dateFormat = 'yyyy/mm/dd'
  } = args;
  try {
    const parsed = CSV.parse(csvStr);
    if (parsed.length === 0) {
      return {
        accounts: [],
        errorMessages: ['データが設定されていません'],
        warningMessages: [],
        result: false
      };
    }
    if (parsed.length > 250) {
      return {
        accounts: [],
        errorMessages: ['一度に登録できる上限は250件です'],
        warningMessages: [],
        result: false
      };
    }
    const errorMessages: Array<string> = [];
    const warningMessages: Array<string> = [];
    const accounts = (
      await Promise.all(
        parsed.map<Promise<Account | null>>(async (row, i) => {
          if (i === 0 && skipFirstRow) {
            return null;
          }
          if (row.length < 5 && row.length > 7) {
            errorMessages.push(
              `第${i + 1}行目が${row.length}列です（5〜7列にしてください）`
            );
            return null;
          }
          const vendorName = row[0];
          const amount = parseInt(row[1], 10);
          if (Number.isNaN(amount)) {
            errorMessages.push(`第${i + 1}行目の請求額が不正な形式です`);
            return null;
          }
          const originalDueDate = tryParseDate(row[2], dateFormat);
          if (!originalDueDate) {
            errorMessages.push(`第${i + 1}行目のもとの支払日が不正な形式です`);
            return null;
          }
          const newPayDate = tryParseDate(row[3], dateFormat);
          if (!newPayDate) {
            errorMessages.push(`第${i + 1}行目の早払い日が不正な形式です`);
            return null;
          }
          const now = Timestamp.now();
          if (originalDueDate.toMillis() < now.toMillis()) {
            errorMessages.push(
              `第${i + 1}行目のもとの支払日が過去の日付になっています`
            );
            return null;
          }
          if (newPayDate.toMillis() < now.toMillis()) {
            errorMessages.push(
              `第${i + 1}行目の早払い日が過去の日付になっています`
            );
            return null;
          }
          if (originalDueDate.toMillis() < newPayDate.toMillis()) {
            errorMessages.push(
              `第${i + 1}行目のもとの支払日が早払い日より前になっています`
            );
            return null;
          }
          const vendorEmail = row[4];
          if (!isValidAsEmail(vendorEmail)) {
            errorMessages.push(
              `第${i + 1}行目のメールアドレスが不正な形式です`
            );
            return null;
          }
          const userConfiguredId = !row[5] ? '' : row[5];
          const currency = castToAccountCurrency(!row[6] ? 'jpy' : row[6]);
          if (!currency) {
            errorMessages.push(`第${i + 1}行目の通貨が不正な形式です`);
            return null;
          }

          const id = randomString();
          const index = generateAccountIndex({
            enterpriseId: user.enterpriseId,
            vendorEmail,
            amount,
            originalDueDate,
            userConfiguredId
          });

          const docSnap = await fetchDoc(
            accountindexDocRef(app, user.enterpriseId, index)
          );
          if (docSnap.exists()) {
            warningMessages.push(
              `第${i + 1}行目はすでに登録されています（スキップしました）`
            );
            return null;
          }

          const account: Account = {
            id,
            enterpriseId: user.enterpriseId,
            enterpriseName: user.enterpriseName,
            enterpriseEmails: user.enterpriseEmails,
            vendorName,
            vendorEmail,
            amount,
            currency,
            originalDueDate,
            newPayDate,
            payDate: originalDueDate,
            status: 'inactive',
            statusNumber: generateAccountStatusNumber('inactive'),
            searchMap: generateBiGramObject(
              [
                user.enterpriseName,
                ...user.enterpriseEmails,
                vendorName,
                vendorEmail
              ],
              [amount.toString(), id, user.enterpriseId, userConfiguredId]
            ),
            index,
            userConfiguredId,
            createdAt: now,
            lastEditedAt: now
          };

          return account;
        })
      )
    ).filter((account) => account) as Array<Account>;
    return {
      accounts,
      errorMessages,
      warningMessages,
      result: errorMessages.length === 0
    };
  } catch (e) {
    console.error(e);
    return {
      accounts: [],
      errorMessages: ['エラーが発生しました'],
      warningMessages: [],
      result: false
    };
  }
};