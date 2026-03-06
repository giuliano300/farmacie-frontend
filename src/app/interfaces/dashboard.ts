export interface DashboardResponse {
  activeBatches: BatchDashboardItem[];
  completedBatches: BatchDashboardItem[];
}

export interface BatchDashboardItem {
  batchId: string;
  sequenceNumber: number;
  customerId: string;
  startedAt: string;
  status: string;

  currentStep: string;
  stepStatus: number;

  heronImport: StepMetrics;
  farmadati: StepMetrics;
  suppliers: StepMetrics;
  magento: StepMetrics;
}

export interface StepMetrics {
  total: number;
  success: number;
  errors: number;
  progress: number;
}