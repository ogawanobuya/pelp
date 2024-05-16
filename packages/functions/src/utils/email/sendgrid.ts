import * as sgMail from '@sendgrid/mail';

import { SendContactEmailArgs } from '../../pelp-repositories';
import { SENDGRID_API_KEY } from '../env';

import { AccountTemplateData } from './accountTemplateData';

interface EmailVerificationDynamicTemplateData {
  signInWithEmailLink: string;
}
interface PasswordResetDynamicTemplateData {
  passwordResetLink: string;
}
interface AccountNotificationDynamicTemplateData {
  signInWithEmailLink: string;
  account: AccountTemplateData;
}
interface OneTimePasswordTemplateData {
  oneTimePassword: string;
}
type ContactTemplateData = SendContactEmailArgs;
interface AccountUpdatedTDynamicTemplateData {
  signInWithEmailLink: string;
  before: {
    newPayDate: string;
  };
  after: {
    newPayDate: string;
  };
}

export const templateId = {
  emailVerification: 'd-ebc738da93d647a2baaca197b8c6ebfe',
  passwordReset: 'd-07fb044f4e4249bfb5cd2327bff5ccf1',
  newAccount: 'd-7edb1e2ef78845108a65e1628f227266',
  accountOfferRejected: 'd-284526e3817d4ce7a9dfeb9cad505ff1',
  accountActivated: 'd-fc07215470dd47ae8b16bff04ed3bda3',
  accountAdjusted: 'd-7da89f03ab354d0ea31d9c576c3b7a1f',
  accountPaid: 'd-1710c46ed1124610ac5170567c130ff4',
  oneTimePassword: 'd-92924ac6011c442ab24f9007fc0de303',
  contact: 'd-8ed899f5ab174f5888165337bdf74e99',
  contactConfirmation: 'd-0cd5136618634e79974f8ca7ed0b1c46',
  accountUpdated: 'd-1b7706060f4a4578b4d5284239503f93'
} as const;
export type TemplateId = typeof templateId[keyof typeof templateId];

export const asmGroupId = {
  vendorNotification: 20728,
  enterpriseNotification: 20729
} as const;
export type AsmGroupId = typeof asmGroupId[keyof typeof asmGroupId];

interface SendEmailArgs {
  to: string;
  templateId: TemplateId;
  dynamicTemplateData:
    | EmailVerificationDynamicTemplateData
    | PasswordResetDynamicTemplateData
    | AccountNotificationDynamicTemplateData
    | OneTimePasswordTemplateData
    | ContactTemplateData
    | AccountUpdatedTDynamicTemplateData;
  groupId?: AsmGroupId;
  groupsToDisplay?: Array<AsmGroupId>;
}
export const sendEmail = async (args: SendEmailArgs) => {
  if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    if (args.groupId && args.groupsToDisplay) {
      await sgMail.send({
        from: { name: 'Pelp', email: 'no-reply@pelpfinance.com' },
        to: args.to,
        templateId: args.templateId,
        dynamicTemplateData: args.dynamicTemplateData,
        asm: {
          groupId: args.groupId,
          groupsToDisplay: args.groupsToDisplay
        }
      });
    } else {
      await sgMail.send({
        from: { name: 'Pelp', email: 'no-reply@pelpfinance.com' },
        to: args.to,
        templateId: args.templateId,
        dynamicTemplateData: args.dynamicTemplateData
      });
    }
  }
};