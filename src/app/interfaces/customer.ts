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
  active: boolean;
  createdAt: Date;
  magento: MagentoConfig;
}