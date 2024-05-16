import { Timestamp } from 'firebase-admin/firestore';

import { enterpriseUserDocPath } from '../../pelp-repositories';
import admin from '../../utils/firebase/admin';
import { fetchAllEnterpriseUsers } from '../../utils/firebase/firestore/enterpriseUser';
import { functions128MB } from '../../utils/firebase/functions';

export const onUpdateEnterpriseUserGroup = functions128MB.firestore
  .document('/enterpriseUserGroups/{enterpriseId}')
  .onUpdate(async (change, context) => {
    const { enterpriseId } = context.params;
    if (typeof enterpriseId !== 'string')
      throw Error('enterpriseId has invalid type.');

    const { name, emails, wacc } = change.after.data();
    if (typeof name !== 'string') throw Error('Field "name" is not string.');
    if (!Array.isArray(emails)) throw Error('Field "emails" is not Array[].');
    if (!emails.every((item) => typeof item === 'string'))
      throw Error('Field "emails" is not Array[].');
    if (typeof wacc !== 'number') throw Error('Field "number" is not number.');

    const enterpriseUsers = await fetchAllEnterpriseUsers(enterpriseId);

    // グループのユーザーのデータを更新
    const batch = admin.firestore().batch();
    enterpriseUsers.forEach((user) => {
      batch.update(
        admin.firestore().doc(enterpriseUserDocPath(enterpriseId, user.id)),
        {
          enterpriseEmails: emails,
          enterpriseName: name,
          lastEditedAt: Timestamp.now()
        }
      );
    });
    await batch.commit();

    // onUpdateEnterpriseUser が呼び出される
  });