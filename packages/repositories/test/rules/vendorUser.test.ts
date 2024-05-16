import * as firebase from '@firebase/rules-unit-testing';
import { RulesTestContext } from '@firebase/rules-unit-testing';
import { Timestamp } from 'firebase/firestore';

import { vendorUserDocPath, vendorUserGroupDocPath } from '../../src';
import { randomString } from '../../src/utils/randomString';
import {
  adminContext,
  adminVendorContext,
  vendorContext
} from '../utils/contexts';
import { testEnv } from '../utils/testEnv';
import { testProjectId } from '../utils/testProjectId';

const projectId = testProjectId();
let env: firebase.RulesTestEnvironment;

const vendorId = randomString();
const vendorName = 'vendor';
const now = Timestamp.now();

const adminUserId = randomString();
let adminUserFirestore: ReturnType<RulesTestContext['firestore']>;

const vendorUserId = randomString();
const vendorUserEmail = 'vendor@pelpfinance.com';
let vendorUserFirestore: ReturnType<RulesTestContext['firestore']>;

const adminVendorUserId = randomString();
const adminVendorUserEmail = 'adminvendor@pelpfinance.com';
let adminVendorUserFirestore: ReturnType<RulesTestContext['firestore']>;

beforeAll(async () => {
  env = await testEnv(projectId);

  adminUserFirestore = adminContext(env, adminUserId).firestore();

  vendorUserFirestore = vendorContext(env, vendorUserId, vendorId, [
    adminVendorUserEmail
  ]).firestore();

  adminVendorUserFirestore = adminVendorContext(
    env,
    adminVendorUserId,
    vendorId,
    [adminVendorUserEmail]
  ).firestore();
});

afterAll(async () => {
  await env.cleanup();
});

describe('vendor user group', () => {
  // admin (functions)

  it('admin (functions) create', async () => {
    await adminUserFirestore.doc(vendorUserGroupDocPath(vendorId)).set({
      emails: [adminVendorUserEmail],
      name: vendorName,
      createdAt: now,
      lastEditedAt: now
    });
  });

  // admin

  it('admin read', async () => {
    await adminUserFirestore.doc(vendorUserGroupDocPath(vendorId)).get();
  });

  // admin vendor

  it('admin vendor update', async () => {
    await adminVendorUserFirestore
      .doc(vendorUserGroupDocPath(vendorId))
      .update({
        emails: [adminVendorUserEmail],
        name: vendorName,
        createdAt: now,
        lastEditedAt: now
      });
  });

  it('admin vendor read', async () => {
    await adminVendorUserFirestore.doc(vendorUserGroupDocPath(vendorId)).get();
  });

  // vendor

  it('vendor read', async () => {
    await vendorUserFirestore.doc(vendorUserGroupDocPath(vendorId)).get();
  });
});

describe('admin vendor user', () => {
  // admin (functions)

  it('admin (functions) create', async () => {
    await adminUserFirestore
      .doc(vendorUserDocPath(vendorId, adminVendorUserId))
      .set({
        id: adminVendorUserId,
        email: adminVendorUserEmail,
        vendorId,
        vendorEmails: [adminVendorUserEmail],
        isGroupAdmin: true,
        role: [] as Array<string>,
        createdAt: now,
        lastEditedAt: now
      });
  });

  // admin vendor

  it('admin vendor update', async () => {
    await adminVendorUserFirestore
      .doc(vendorUserDocPath(vendorId, adminVendorUserId))
      .update({
        role: [] as Array<string>,
        lastEditedAt: now
      });
  });

  it('admin vendor read', async () => {
    await adminVendorUserFirestore
      .doc(vendorUserDocPath(vendorId, adminVendorUserId))
      .get();
  });
});

describe('vendor user', () => {
  // admin (functions)

  it('admin (functions) create', async () => {
    await adminUserFirestore
      .doc(vendorUserDocPath(vendorId, vendorUserId))
      .set({
        id: vendorUserId,
        email: vendorUserEmail,
        vendorId,
        vendorEmails: [adminVendorUserEmail],
        isGroupAdmin: false,
        role: [] as Array<string>,
        createdAt: now,
        lastEditedAt: now
      });
  });

  // admin vendor

  it('admin vendor update', async () => {
    await adminVendorUserFirestore
      .doc(vendorUserDocPath(vendorId, vendorUserId))
      .update({
        role: [] as Array<string>,
        lastEditedAt: now
      });
  });

  it('admin vendor read', async () => {
    await adminVendorUserFirestore
      .doc(vendorUserDocPath(vendorId, vendorUserId))
      .get();
  });

  // vendor

  it('vendor read', async () => {
    await vendorUserFirestore
      .doc(vendorUserDocPath(vendorId, vendorUserId))
      .get();
  });
});