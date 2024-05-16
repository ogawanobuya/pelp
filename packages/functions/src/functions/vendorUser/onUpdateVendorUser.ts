import { castToVendorUser } from '../../pelp-repositories';
import { updateCustomClaims } from '../../utils/firebase/auth';
import { functions128MB } from '../../utils/firebase/functions';

export const onUpdateVendorUser = functions128MB.firestore
  .document('/vendorUserGroups/{vendorId}/users/{authUserId}')
  .onUpdate(async (change) => {
    const vendorUser = castToVendorUser(change.after.data());
    if (!vendorUser) throw Error('Failed to cast to VendorUser.');
    await updateCustomClaims(change.after.id, {
      isVendorAdmin: vendorUser.isGroupAdmin,
      vendorRole: vendorUser.role
    });
  });