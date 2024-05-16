import { updateCustomClaims } from '../../utils/firebase/auth';
import { functions128MB } from '../../utils/firebase/functions';

export const onCreateAdminUser = functions128MB.firestore
  .document('/adminUsers/{authUserId}')
  .onCreate(async (snapshot) => {
    await updateCustomClaims(snapshot.id, { admin: true });
  });