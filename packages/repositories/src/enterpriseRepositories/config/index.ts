import { FirebaseApp } from '@firebase/app';

import { fetchDoc } from '../../helpers/firestoreHelper';
import { maintainanceDocRef } from '../../refs/config';
import { castToMaintainanceData } from '../../types';

export const enterpriseConfigRepository = (app: FirebaseApp) => {
  const fetchMaintainance = async () => {
    const docSnap = await fetchDoc(maintainanceDocRef(app));
    return castToMaintainanceData(docSnap.data());
  };

  return {
    fetchMaintainance
  };
};