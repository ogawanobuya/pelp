import * as firebase from '@firebase/rules-unit-testing';
import { RulesTestContext } from '@firebase/rules-unit-testing';
import { Timestamp } from 'firebase/firestore';

import { enterpriseUserDocPath, enterpriseUserGroupDocPath } from '../../src';
import {
  adminContext,
  adminEnterpriseContext,
  enterpriseContext
} from '../utils/contexts';
import { testEnv } from '../utils/testEnv';
import { testProjectId } from '../utils/testProjectId';
import { randomString } from '../../src/utils/randomString';

const projectId = testProjectId();
let env: firebase.RulesTestEnvironment;

const enterpriseId = randomString();
const enterpriseName = 'enterprise';
const now = Timestamp.now();

const adminUserId = randomString();
let adminUserFirestore: ReturnType<RulesTestContext['firestore']>;

const enterpriseUserId = randomString();
const enterpriseUserEmail = 'enterprise@pelpfinance.com';
let enterpriseUserFirestore: ReturnType<RulesTestContext['firestore']>;

const adminEnterpriseUserId = randomString();
const adminEnterpriseUserEmail = 'adminenterprise@pelpfinance.com';
let adminEnterpriseUserFirestore: ReturnType<RulesTestContext['firestore']>;

beforeAll(async () => {
  env = await testEnv(projectId);

  adminUserFirestore = adminContext(env, adminUserId).firestore();

  enterpriseUserFirestore = enterpriseContext(
    env,
    enterpriseUserId,
    enterpriseId,
    [adminEnterpriseUserEmail]
  ).firestore();

  adminEnterpriseUserFirestore = adminEnterpriseContext(
    env,
    adminEnterpriseUserId,
    enterpriseId,
    [adminEnterpriseUserEmail]
  ).firestore();
});

afterAll(async () => {
  await env.cleanup();
});

describe('enterprise user group', () => {
  // admin

  it('admin create', async () => {
    await adminUserFirestore.doc(enterpriseUserGroupDocPath(enterpriseId)).set({
      emails: [adminEnterpriseUserEmail],
      name: enterpriseName,
      wacc: 0.05,
      createdAt: now,
      lastEditedAt: now
    });
  });

  // admin enterprise

  it('admin enterprise update', async () => {
    await adminEnterpriseUserFirestore
      .doc(enterpriseUserGroupDocPath(enterpriseId))
      .update({
        emails: [adminEnterpriseUserEmail],
        name: enterpriseName,
        lastEditedAt: now
      });
  });

  it('admin enterprise read', async () => {
    await adminEnterpriseUserFirestore
      .doc(enterpriseUserGroupDocPath(enterpriseId))
      .get();
  });

  // enterprise

  it('enterprise read', async () => {
    await enterpriseUserFirestore
      .doc(enterpriseUserGroupDocPath(enterpriseId))
      .get();
  });
});

describe('admin enterprise user', () => {
  // admin (functions)

  it('admin (functions) create', async () => {
    await adminUserFirestore
      .doc(enterpriseUserDocPath(enterpriseId, adminEnterpriseUserId))
      .set({
        id: adminEnterpriseUserId,
        email: enterpriseUserEmail,
        enterpriseId,
        enterpriseName,
        enterpriseEmails: [adminEnterpriseUserEmail],
        isGroupAdmin: true,
        role: [] as Array<string>,
        createdAt: now,
        lastEditedAt: now
      });
  });

  // admin enterprise

  it('admin enterprise update', async () => {
    await adminEnterpriseUserFirestore
      .doc(enterpriseUserDocPath(enterpriseId, adminEnterpriseUserId))
      .update({
        role: [] as Array<string>,
        lastEditedAt: now
      });
  });

  it('admin enterprise read', async () => {
    await adminEnterpriseUserFirestore
      .doc(enterpriseUserDocPath(enterpriseId, adminEnterpriseUserId))
      .get();
  });
});

describe('enterprise user', () => {
  // admin (functions)

  it('admin (functions) create', async () => {
    await adminUserFirestore
      .doc(enterpriseUserDocPath(enterpriseId, enterpriseUserId))
      .set({
        id: enterpriseUserId,
        email: enterpriseUserEmail,
        enterpriseId,
        enterpriseName,
        enterpriseEmails: [adminEnterpriseUserEmail],
        isGroupAdmin: false,
        role: [] as Array<string>,
        createdAt: now,
        lastEditedAt: now
      });
  });

  // admin enterprise

  it('admin enterprise update', async () => {
    await adminEnterpriseUserFirestore
      .doc(enterpriseUserDocPath(enterpriseId, enterpriseUserId))
      .update({
        role: [] as Array<string>,
        lastEditedAt: now
      });
  });

  it('admin enterprise read', async () => {
    await adminEnterpriseUserFirestore
      .doc(enterpriseUserDocPath(enterpriseId, enterpriseUserId))
      .get();
  });

  // enterprise

  it('enterprise read', async () => {
    await enterpriseUserFirestore
      .doc(enterpriseUserDocPath(enterpriseId, enterpriseUserId))
      .get();
  });
});