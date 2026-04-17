export interface MagentoConfig {
  baseUrl: string;
  token: string;
  ftpHost: string;
  ftpUser: string;
  ftpPassword: string;
  ftpImportPath: string;
  magentoRootPath: string;
  cronDelayMilliseconds: number;
  websiteId: number;
  attributeSetId: number;
}

export interface customers {
  id: string;
  code: string;
  name: string;
  magentoStoreCode: string;
  heronFolder: string;
  heronFtpFolder: string;
  heronFtp: string;
  heronUsername: string;
  heronPassword: string;
  active: boolean;
  msi: boolean;
  createdAt: Date;
  magento: MagentoConfig;
}