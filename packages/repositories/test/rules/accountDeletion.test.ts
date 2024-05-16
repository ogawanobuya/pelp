import * as firebase from '@firebase/rules-unit-testing';
import { RulesTestContext } from '@firebase/rules-unit-testing';
import { Timestamp } from 'firebase/firestore';

import { Account, accountDocPath, accountindexDocPath } from '../../src';
import { generateAccountIndex } from '../../src/utils/accountIndex';
import { generateBiGramObject } from '../../src/utils/biGram';
import { adminEnterpriseContext, adminContext } from '../utils/contexts';
import { testEnv } from '../utils/testEnv';
import { testProjectId } from '../utils/testProjectId';
import { randomString } from '../../src/utils/randomString';
import { generateAccountStatusNumber } from '../../src/utils/statusNumber';

const projectId = testProjectId();
let env: firebase.RulesTestEnvironment;

const enterpriseId = randomString();
const enterpriseName = 'enterprise';
const vendorName = 'vendor';
const adminVendorUserEmail = 'adminvendor@pelpfinance.com';

const accountId = randomString();
const accountAmount = 1000000;
const accountCurrency = 'jpy';
const originalDueDate = Timestamp.fromDate(new Date(2022, 11, 31));
const newPayDate = Timestamp.fromDate(new Date(2022, 11, 14));
const userConfiguredId = '123456';
const accountDiscountRate = 0.01;
const index = generateAccountIndex({
  enterpriseId,
  vendorEmail: adminVendorUserEmail,
  amount: 1000,
  originalDueDate,
  userConfiguredId
});
const accountDiscountAmount = accountAmount * accountDiscountRate;

const now = Timestamp.now();

const adminUserId = randomString();
let adminUserFirestore: ReturnType<RulesTestContext['firestore']>;

const adminEnterpriseUserId = randomString();
const adminEnterpriseUserEmail = 'adminenterprise@pelpfinance.com';
let adminEnterpriseUserFirestore: ReturnType<RulesTestContext['firestore']>;

beforeAll(async () => {
  env = await testEnv(projectId);

  adminUserFirestore = adminContext(env, adminUserId).firestore();

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

describe('account deletion', () => {
  it('create (enterprise)', async () => {
    // created by enterprise

    const index = generateAccountIndex({
      enterpriseId,
      vendorEmail: adminVendorUserEmail,
      amount: 1000,
      originalDueDate,
      userConfiguredId
    });
    const account: Account = {
      id: accountId,
      enterpriseId,
      enterpriseName,
      enterpriseEmails: [adminEnterpriseUserEmail],
      vendorName,
      vendorEmail: adminVendorUserEmail,
      amount: accountAmount,
      currency: accountCurrency,
      newPayDate,
      originalDueDate,
      payDate: originalDueDate,
      status: 'inactive',
      statusNumber: generateAccountStatusNumber('inactive'),
      searchMap: generateBiGramObject([
        enterpriseId,
        enterpriseName,
        ...[adminEnterpriseUserEmail],
        vendorName,
        adminVendorUserEmail
      ]),
      index,
      userConfiguredId,
      createdAt: now,
      lastEditedAt: now
    };

    const batch = adminEnterpriseUserFirestore.batch();
    batch.set(
      adminEnterpriseUserFirestore.doc(accountDocPath(accountId)),
      account
    );
    batch.set(
      adminEnterpriseUserFirestore.doc(
        accountindexDocPath(enterpriseId, index)
      ),
      {
        id: index,
        accountId,
        enterpriseId,
        createdAt: now,
        lastEditedAt: now
      }
    );
    await batch.commit();

    // set discount rate and amount by functions

    await adminUserFirestore.doc(accountDocPath(accountId)).update({
      discountRate: accountDiscountRate,
      discountAmount: accountDiscountAmount,
      lastEditedAt: now
    });
  });

  it('delete (enterprise)', async () => {
    adminEnterpriseUserFirestore.runTransaction(async (transaction) => {
      transaction.delete(
        adminEnterpriseUserFirestore.doc(accountDocPath(accountId))
      );
      transaction.delete(
        adminEnterpriseUserFirestore.doc(
          accountindexDocPath(enterpriseId, index)
        )
      );
    });
  });
});