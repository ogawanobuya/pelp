import { handleUpdateVendorUserGroup } from '../../utils/firebase/firestore/vendorUser';
import { functions128MB } from '../../utils/firebase/functions';

export const onUpdateVendorUserGroup = functions128MB.firestore
  .document('/vendorUserGroups/{vendorId}')
  .onUpdate(async (change, context) => {
    const { vendorId } = context.params;
    if (typeof vendorId !== 'string') throw Error('vendorId has invalid type.');

    const { name, emails } = change.after.data();
    if (typeof name !== 'string') throw Error('Field "name" is not string.');
    if (!Array.isArray(emails)) throw Error('Field "emails" is not Array[].');
    if (!emails.every((item) => typeof item === 'string'))
      throw Error('Field "emails" is not Array[].');

    await handleUpdateVendorUserGroup(vendorId, emails, name);
  });