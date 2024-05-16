import { updateCustomClaims } from '../../utils/firebase/auth';
import { functions128MB } from '../../utils/firebase/functions';

export const onDeleteAdminUser = functions128MB.firestore
  .document('/adminUsers/{authUserId}')
  .onDelete(async (snapshot) => {
    await updateCustomClaims(snapshot.id, { admin: false });
  });