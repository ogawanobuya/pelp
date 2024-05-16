import { addDays } from 'date-fns';
import { Timestamp } from 'firebase-admin/firestore';

import {
  Account,
  castToAccount,
  castToEnterpriseUser,
  EnterpriseUser,
  enterpriseUsersCollectionPath
} from '../../pelp-repositories';
import { convertToAccountTemplateData } from '../../utils/email/accountTemplateData';
import {
  asmGroupId,
  sendEmail,
  templateId,
  TemplateId
} from '../../utils/email/sendgrid';
import { ENTERPRISE_SIGN_IN_URL, VENDOR_SIGN_IN_URL } from '../../utils/env';
import admin from '../../utils/firebase/admin';
import { generateSignInWithEmailLink } from '../../utils/firebase/auth';
import {
  updateNewPayDate,
  updatePayDate
} from '../../utils/firebase/firestore/account';
import { functions256MB } from '../../utils/firebase/functions';

export const onUpdateAccount = functions256MB.firestore
  .document('accounts/{accountId}')
  .onUpdate(async (change) => {
    const before = castToAccount(change.before.data());
    const after = castToAccount(change.after.data());
    if (!before || !after) throw Error('Failed to cast to Account.');

    if (after.lastEditedAt.seconds - before.lastEditedAt.seconds < 30)
      throw Error('Document updated too frequently. Maybe infinite loop.');

    if (before.status !== after.status) {
      if (before.status === 'inactive' && after.status === 'active') {
        await sendMailsToEnterprise(after, templateId.accountActivated);
      }
      if (before.status === 'active' && after.status === 'adjusted') {
        if (after.lastEditedAt.seconds - before.lastEditedAt.seconds < 30) {
          throw Error('Document updated too frequently. Maybe infinite loop.');
        }
        await updatePayDate(after.id, after.newPayDate);
        await sendMailToVendor(after, templateId.accountAdjusted);
      }
      if (before.status === 'adjusted' && after.status === 'paid') {
        await sendMailToVendor(after, templateId.accountPaid);
      }
      if (before.status === 'active' && after.status === 'inactive') {
        if (after.lastEditedAt.seconds - before.lastEditedAt.seconds < 30) {
          throw Error('Document updated too frequently. Maybe infinite loop.');
        }
        await updateNewPayDate(
          after,
          Timestamp.fromDate(addDays(after.newPayDate.toDate(), 7))
        );
        await sendMailToVendor(after, templateId.accountOfferRejected);
      }
      if (before.status === 'active' && after.status === 'outdated') {
        await sendMailToVendor(after, templateId.accountOfferRejected);
      }
    }
  });

const sendMailToVendor = async (account: Account, templateId: TemplateId) => {
  const url = VENDOR_SIGN_IN_URL;
  if (!url) throw Error('url is not defined');
  const signInWithEmailLink = await generateSignInWithEmailLink({
    url,
    email: account.vendorEmail
  });
  await sendEmail({
    to: account.vendorEmail,
    templateId,
    dynamicTemplateData: {
      signInWithEmailLink,
      account: convertToAccountTemplateData(account)
    },
    groupId: asmGroupId.vendorNotification,
    groupsToDisplay: [asmGroupId.vendorNotification]
  });
};

const sendMailsToEnterprise = async (
  account: Account,
  templateId: TemplateId
) => {
  const url = ENTERPRISE_SIGN_IN_URL;
  if (!url) throw Error('url is not defined');
  const querySnap = await admin
    .firestore()
    .collection(enterpriseUsersCollectionPath(account.enterpriseId))
    .get();
  const enterpriseUsers = querySnap.docs
    .map((doc) => castToEnterpriseUser(doc.data()))
    .filter((enterpriseUser) => enterpriseUser) as Array<EnterpriseUser>;
  await Promise.all(
    enterpriseUsers.map(async (enterpriseUser) => {
      const signInWithEmailLink = await generateSignInWithEmailLink({
        url,
        email: enterpriseUser.email
      });
      await sendEmail({
        to: enterpriseUser.email,
        templateId,
        dynamicTemplateData: {
          signInWithEmailLink,
          account: convertToAccountTemplateData(account)
        },
        groupId: asmGroupId.enterpriseNotification,
        groupsToDisplay: [asmGroupId.enterpriseNotification]
      });
    })
  );
};