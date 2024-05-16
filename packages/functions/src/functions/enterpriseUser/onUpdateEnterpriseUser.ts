import { castToEnterpriseUser } from '../../pelp-repositories';
import { updateCustomClaims } from '../../utils/firebase/auth';
import { functions128MB } from '../../utils/firebase/functions';

export const onUpdateEnterpriseUser = functions128MB.firestore
  .document('/enterpriseUserGroups/{enterpriseId}/users/{authUserId}')
  .onUpdate(async (change) => {
    const enterpriseUser = castToEnterpriseUser(change.after.data());
    if (!enterpriseUser) throw Error('Failed to cast to EnterpriseUser.');
    await updateCustomClaims(change.after.id, {
      isEnterpriseAdmin: enterpriseUser.isGroupAdmin,
      enterpriseRole: enterpriseUser.role
    });
  });