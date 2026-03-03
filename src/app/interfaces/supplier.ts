
export interface suppliers {
  id: string;
  code: string;
  name: string;
  ftpHost: string;
  ftpUser: string;
  ftpPassword: string;
  remoteFile: string;
  priority: number;
  active: boolean;
  lastUpdate?: string | null;
}