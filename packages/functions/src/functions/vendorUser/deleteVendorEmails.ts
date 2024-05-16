import { Timestamp } from 'firebase-admin/firestore';

import {
  castToVendorUserGroup,
  vendorUserGroupDocPath,
  DeleteVendorEmailsArgs
} from '../../pelp-repositories';
import admin from '../../utils/firebase/admin';
import { handleUpdateVendorUserGroup } from '../../utils/firebase/firestore/vendorUser';
import { functions128MB } from '../../utils/firebase/functions';

export const deleteVendorEmails = functions128MB.https.onCall(
  async (data: DeleteVendorEmailsArgs, context) => {
    const { auth } = context;
    if (!auth) throw Error('Not authenticated.');

    // vendor admin のみから呼び出し可能
    const { vendorId, isVendorAdmin } = auth.token;
    if (!vendorId || !isVendorAdmin) throw Error('Permission denied.');

    const { deletedEmails } = data;
    const vendorUserGroupDocRef = admin
      .firestore()
      .doc(vendorUserGroupDocPath(vendorId));
    const vendorUserGroup = castToVendorUserGroup(
      (await vendorUserGroupDocRef.get()).data()
    );
    if (!vendorUserGroup) throw Error('Failed to cast to VendorUserGroup.');

    const emails = vendorUserGroup.emails.filter(
      (email) => !deletedEmails.includes(email)
    );
    await vendorUserGroupDocRef.update({
      emails,
      lastEditedAt: Timestamp.now()
    });

    await handleUpdateVendorUserGroup(vendorId, emails, vendorUserGroup.name);
  }
);