import { Timestamp } from 'firebase-admin/firestore';

import {
  castToEnterpriseUserGroup,
  DeleteEnterpriseEmailsArgs,
  enterpriseUserGroupDocPath
} from '../../pelp-repositories';
import admin from '../../utils/firebase/admin';
import { functions128MB } from '../../utils/firebase/functions';

export const deleteEnterpriseEmails = functions128MB.https.onCall(
  async (data: DeleteEnterpriseEmailsArgs, context) => {
    const { auth } = context;
    if (!auth) throw Error('Not authenticated.');

    // enterprise admin のみから呼び出し可能
    const { enterpriseId, isEnterpriseAdmin } = auth.token;
    if (!enterpriseId || !isEnterpriseAdmin) throw Error('Permission denied.');

    const { deletedEmails } = data;
    const enterpriseUserGroupDocRef = admin
      .firestore()
      .doc(enterpriseUserGroupDocPath(enterpriseId));
    const enterpriseUserGroup = castToEnterpriseUserGroup(
      (await enterpriseUserGroupDocRef.get()).data()
    );
    if (!enterpriseUserGroup)
      throw Error('Failed to cast to EnterpriseUserGroup.');

    const emails = enterpriseUserGroup.emails.filter(
      (email) => !deletedEmails.includes(email)
    );
    await enterpriseUserGroupDocRef.update({
      emails,
      lastEditedAt: Timestamp.now()
    });

    // onUpdateEnterpriseUserGroup が呼び出される
  }
);