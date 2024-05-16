import { FirebaseApp } from '@firebase/app';

import { fetchDoc } from '../../helpers/firestoreHelper';
import { vendorUserGroupDocRef } from '../../refs';
import { castToVendorUserGroup } from '../../types';

interface FetchVendorUserGroupArgs {
  app: FirebaseApp;
  vendorId: string;
}
export const fetchVendorUserGroup = async (args: FetchVendorUserGroupArgs) => {
  const { app, vendorId } = args;
  const docSnap = await fetchDoc(vendorUserGroupDocRef(app, vendorId));
  return castToVendorUserGroup(docSnap.data());
};