export interface CustomerMagentoCategory {
  id: string; // customerId_magentoId

  customerId: string;

  magentoCategoryId: number;

  parentId: number;

  name: string;

  path: string;

  level: number;

  position: number;

  isActive: boolean;

  productCount: number;

  createdAt: string; // ISO date
}