import { Timestamp } from 'firebase-admin/firestore';

import {
  vendorUserDocPath,
  vendorUserGroupDocPath,
  CreateVendorUserGroupArgs,
  VendorUserGroup,
  VendorUser
} from '../../pelp-repositories';
import admin from '../../utils/firebase/admin';
import { updateCustomClaims } from '../../utils/firebase/auth';
import { functions128MB } from '../../utils/firebase/functions';
import { randomString } from '../../utils/randomString';

export const createVendorUserGroup = functions128MB.https.onCall(
  async (data: CreateVendorUserGroupArgs, context) => {
    const { auth } = context;
    if (!auth) throw Error('Not authenticated.');
    const emailVerified = auth.token.email_verified;
    const authEmail = auth.token.email;
    if (!emailVerified || !authEmail) throw Error('Email is not verified.');

    const vendorUserGroupId = randomString();
    const vendorUserGroup: VendorUserGroup = {
      id: vendorUserGroupId,
      name: data.name,
      emails: [authEmail],
      createdAt: Timestamp.now(),
      lastEditedAt: Timestamp.now()
    };
    const adminVendorUser: VendorUser = {
      id: auth.uid,
      email: authEmail,
      vendorId: vendorUserGroupId,
      vendorName: data.name,
      vendorEmails: [authEmail],
      isGroupAdmin: true,
      role: [] as Array<string>,
      createdAt: Timestamp.now(),
      lastEditedAt: Timestamp.now()
    };

    const vendorUserGroupDocRef = admin
      .firestore()
      .doc(vendorUserGroupDocPath(vendorUserGroupId));
    const adminVendorUserDocRef = admin
      .firestore()
      .doc(vendorUserDocPath(vendorUserGroupId, auth.uid));

    const batch = admin.firestore().batch();
    batch.create(vendorUserGroupDocRef, vendorUserGroup);
    batch.create(adminVendorUserDocRef, adminVendorUser);
    await batch.commit();

    // create なので onUpdate は走らない
    // custom claims の更新はここで行う必要がある
    await updateCustomClaims(auth.uid, {
      vendorId: vendorUserGroupId,
      isVendorAdmin: true,
      vendorEmails: [authEmail],
      vendorRole: []
    });
  }
);