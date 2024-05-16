export const functionNames = {
  // admin
  createEnterpriseUserGroup: 'enterpriseUser-createEnterpriseUserGroup',
  // enterprise admin
  createEnterpriseUser: 'enterpriseUser-createEnterpriseUser',
  // enterprise admin
  addEnterpriseEmails: 'enterpriseUser-addEnterpriseEmails',
  // enterprise admin
  deleteEnterpriseEmails: 'enterpriseUser-deleteEnterpriseEmails',
  // anyone
  generateOneTimePassword: 'oneTimePassword-generateOneTimePassword',
  // anyone
  verifyOneTimePassword: 'oneTimePassword-verifyOneTimePassword',
  // anyone
  addVendorEmails: 'vendorUser-addVendorEmails',
  // anyone
  deleteVendorEmails: 'vendorUser-deleteVendorEmails',
  // email-verified vendor
  createVendorUserGroup: 'vendorUser-createVendorUserGroup',
  // vendor admin
  createVendorUser: 'vendorUser-createVendorUser',
  // anyone
  sendVerificationVendorEmail: 'vendorUser-sendVerificationVendorEmail',
  // anyone
  sendContactEmail: 'contact-sendContactEmail'
} as const;
export type FunctionName = typeof functionNames[keyof typeof functionNames];