import * as Account from './account';
import * as AdminUser from './adminUser';
import * as Contact from './contact';
import * as EnterpriseUser from './enterpriseUser';
import * as OneTimePassword from './oneTimePassword';
import * as Schedule from './schedule';
import * as VendorUser from './vendorUser';

export const account = { ...Account };
export const adminUser = { ...AdminUser };
export const contact = { ...Contact };
export const enterpriseUser = { ...EnterpriseUser };
export const oneTimePassword = { ...OneTimePassword };
export const schedule = { ...Schedule };
export const vendorUser = { ...VendorUser };