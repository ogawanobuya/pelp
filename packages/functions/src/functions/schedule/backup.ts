import { v1 } from '@google-cloud/firestore';

import { BACKUP_BUCKET_NAME } from '../../utils/env';
import { functions4GB } from '../../utils/firebase/functions';

export const backup = functions4GB.pubsub
  .schedule('0 2 * * *')
  .timeZone('Asia/Tokyo')
  // see: https://firebase.google.com/docs/firestore/solutions/schedule-export#firebase-cli
  .onRun(async () => {
    const projectId =
      // eslint-disable-next-line no-process-env
      process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT || '';
    const client = new v1.FirestoreAdminClient();
    const databaseName = client.databasePath(projectId, '(default)');

    if (BACKUP_BUCKET_NAME === '') return null;

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: BACKUP_BUCKET_NAME,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: []
      })
      .then((responses) => {
        const response = responses[0];
        console.log(`Operation Name: ${response['name']}`);
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Export operation failed');
      });
  });