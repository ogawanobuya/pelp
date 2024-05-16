import { Timestamp } from 'firebase-admin/firestore';

import {
  castToVendorUser,
  castToVendorUserGroup,
  VendorUser,
  vendorUserDocPath,
  vendorUserGroupDocPath,
  vendorUsersCollectionPath
} from '../../../pelp-repositories';
import admin from '../admin';

export const fetchVendorUserGroup = async (vendorId: string) => {
  const docSnap = await admin
    .firestore()
    .doc(vendorUserGroupDocPath(vendorId))
    .get();
  const vendorUserGroup = castToVendorUserGroup(docSnap.data());
  return vendorUserGroup;
};

export const fetchAllVendorUsers = async (vendorId: string) => {
  const querySnap = await admin
    .firestore()
    .collection(vendorUsersCollectionPath(vendorId))
    .get();
  const vendorUsers = querySnap.docs
    .map((doc) => castToVendorUser(doc.data()))
    .filter((c) => c) as Array<VendorUser>;
  return vendorUsers;
};

export const handleUpdateVendorUserGroup = async (
  vendorId: string,
  emails: Array<string>,
  name: string
) => {
  const vendorUsers = await fetchAllVendorUsers(vendorId);

  // グループのユーザーのデータを更新
  const batch = admin.firestore().batch();
  vendorUsers.forEach((user) => {
    batch.update(admin.firestore().doc(vendorUserDocPath(vendorId, user.id)), {
      vendorEmails: emails,
      vendorName: name,
      lastEditedAt: Timestamp.now()
    });
  });
  await batch.commit();

  // onUpdateVendorUser が呼び出される
};