import { Timestamp } from '../../utils/timestamp';

export interface AccountIndex {
  id: string; // ドキュメントID
  accountId: string; // accounts/{accountId}
  enterpriseId: string; // バイヤーのグループID
  createdAt: Timestamp; // ドキュメント作成のタイムスタンプ
  lastEditedAt: Timestamp; // ドキュメント最終編集のタイムスタンプ
}