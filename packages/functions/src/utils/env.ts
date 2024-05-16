/* eslint-disable no-process-env */

export const BACKUP_BUCKET_NAME = process.env.BACKUP_BUCKET_NAME ?? '';

export const {
  SENDGRID_API_KEY,
  ENTERPRISE_PASSWORD_SETTING_URL,
  ENTERPRISE_SIGN_IN_URL,
  VENDOR_PASSWORD_SETTING_URL,
  VENDOR_SIGN_IN_URL,
  VENDOR_SIGN_UP_URL
} = process.env;