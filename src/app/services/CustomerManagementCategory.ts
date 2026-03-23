export interface CustomerManagementCategory {
  id: string; // customerId_Farmaci|SOP

  customerId: string;

  category: string;

  subCategory: string;

  key: string; // Farmaci|SOP

  createdAt: string; // ISO date
}