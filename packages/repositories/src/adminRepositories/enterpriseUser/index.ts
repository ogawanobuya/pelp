import { FirebaseApp } from '@firebase/app';
import { DocumentSnapshot, DocumentData } from 'firebase/firestore';

import { CreateEnterpriseUserGroupArgs } from '../../types/functions';

import * as EditGroup from './editGroup';
import * as FetchGroup from './fetchGroup';

interface EditEnterpriseUserGroupArgs {
  enterpriseId: string;
  editedGroup: EditGroup.EditEnterpriseUserGroup;
}
interface FetchEnterpriseUserGroupsArgs {
  startAfter?: DocumentSnapshot<DocumentData>;
  limit?: number;
}

export const adminEnterpriseUserRepository = (app: FirebaseApp) => {
  const createEnterpriseUserGroup = async (
    callableArgs: CreateEnterpriseUserGroupArgs
  ) => EditGroup.createEnterpriseUserGroup(app, callableArgs);
  const editEnterpriseUserGroup = (args: EditEnterpriseUserGroupArgs) =>
    EditGroup.editEnterpriseUserGroup({ app, ...args });
  const fetchEnterpriseUserGroups = (
    args: FetchEnterpriseUserGroupsArgs
  ): Promise<FetchGroup.FetchEnterpriseUserGroupsRes> =>
    FetchGroup.fetchetchEnterpriseUserGroups({ app, ...args });

  return {
    createEnterpriseUserGroup,
    editEnterpriseUserGroup,
    fetchEnterpriseUserGroups
  };
};