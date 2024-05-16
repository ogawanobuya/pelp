import { FirebaseApp } from '@firebase/app';

import { fetchDoc } from '../../helpers/firestoreHelper';
import { enterpriseUserGroupDocRef } from '../../refs';
import { castToEnterpriseUserGroup } from '../../types';

interface FetchEnterpriseUserGroupArgs {
  app: FirebaseApp;
  enterpriseId: string;
}
export const fetchEnterpriseUserGroup = async (
  args: FetchEnterpriseUserGroupArgs
) => {
  const { app, enterpriseId } = args;
  const docSnap = await fetchDoc(enterpriseUserGroupDocRef(app, enterpriseId));
  return castToEnterpriseUserGroup(docSnap.data());
};