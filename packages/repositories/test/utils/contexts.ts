import * as firebase from '@firebase/rules-unit-testing';

export const adminContext = (
  testEnv: firebase.RulesTestEnvironment,
  uid: string
) =>
  testEnv.authenticatedContext(uid, {
    admin: true
  });

export const vendorContext = (
  testEnv: firebase.RulesTestEnvironment,
  uid: string,
  vendorId: string,
  vendorEmails: Array<string>
) =>
  testEnv.authenticatedContext(uid, {
    vendorId,
    isVendorAdmin: false,
    vendorEmails
  });

export const adminVendorContext = (
  testEnv: firebase.RulesTestEnvironment,
  uid: string,
  vendorId: string,
  vendorEmails: Array<string>
) =>
  testEnv.authenticatedContext(uid, {
    vendorId,
    isVendorAdmin: true,
    vendorEmails
  });

export const enterpriseContext = (
  testEnv: firebase.RulesTestEnvironment,
  uid: string,
  enterpriseId: string,
  enterpriseEmails: Array<string>
) =>
  testEnv.authenticatedContext(uid, {
    enterpriseId,
    isEnterpriseAdmin: false,
    enterpriseEmails
  });

export const adminEnterpriseContext = (
  testEnv: firebase.RulesTestEnvironment,
  uid: string,
  enterpriseId: string,
  enterpriseEmails: Array<string>
) =>
  testEnv.authenticatedContext(uid, {
    enterpriseId,
    isEnterpriseAdmin: true,
    enterpriseEmails
  });