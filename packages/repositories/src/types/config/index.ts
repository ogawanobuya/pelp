export interface MaintainanceData {
  maintainance: boolean;
  message: string;
}

const isMaintainanceData = (data: any) => {
  if (!data) return false;
  if (typeof data.maintainance !== 'boolean') return false;
  if (typeof data.message !== 'string') return false;
  return true;
};

export const castToMaintainanceData = (data: any): MaintainanceData | null => {
  if (isMaintainanceData(data)) return data as MaintainanceData;
  return null;
};