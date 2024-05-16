import { Timestamp } from 'firebase-admin/firestore';

import {
  AddVendorEmailsArgs,
  vendorUserGroupDocPath,
  oneTimePasswordDocPath,
  castToVendorUserGroup
} from '../../pelp-repositories';
import {
  castToOneTimePassword,
  OneTimePassword
} from '../../pelp-repositories/types/oneTimePassword';
import admin from '../../utils/firebase/admin';
import { handleUpdateVendorUserGroup } from '../../utils/firebase/firestore/vendorUser';
import { functions128MB } from '../../utils/firebase/functions';

export const addVendorEmails = functions128MB.https.onCall(
  async (data: AddVendorEmailsArgs, context) => {
    const { auth } = context;
    if (!auth) throw Error('Not authenticated.');
    const emailVerified = auth.token.email_verified;
    if (!emailVerified) throw Error('Email is not verified.');

    const { newEmails, vendorId } = data;
    const vendorUserGroupDocRef = admin
      .firestore()
      .doc(vendorUserGroupDocPath(vendorId));
    const oneTimePasswordDocRefs = newEmails.map((email) =>
      admin.firestore().doc(oneTimePasswordDocPath(email))
    );

    const oneTimePasswords = (
      await Promise.all(
        oneTimePasswordDocRefs.map(async (ref) =>
          castToOneTimePassword((await ref.get()).data())
        )
      )
    ).filter((item) => item) as Array<OneTimePassword>;
    const allVerified = oneTimePasswords.every((otp) => otp.verified);
    if (!allVerified) throw Error('Some of emails are not verified.');

    const before = castToVendorUserGroup(
      (await vendorUserGroupDocRef.get()).data()
    );
    if (!before) throw Error('Failed to cast to VendorUserGroup.');
    // 重複削除
    const emails = Array.from(new Set([...before.emails, ...newEmails]));
    await vendorUserGroupDocRef.update({
      emails,
      lastEditedAt: Timestamp.now()
    });
    const vendorUserGroup = castToVendorUserGroup(
      (await vendorUserGroupDocRef.get()).data()
    );
    await Promise.all(oneTimePasswordDocRefs.map((ref) => ref.delete()));

    if (!vendorUserGroup) throw Error('Failed to cast to VendorUserGroup.');
    await handleUpdateVendorUserGroup(vendorId, emails, vendorUserGroup.name);
  }
);