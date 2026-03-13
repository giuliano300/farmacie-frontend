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
  magento: StepMetricsMagento;
}

export interface StepMetrics {
  total: number;
  success: number;
  errors: number;
  progress: number;
}

export interface StepMetricsMagento {
  totalMagentoProducts: number;
  totalDownloadMagentoProducts: number;
  total: number;
  success: number;
  insert: number;
  updatePrice: number;
  insertImages: number;
  errors: number;
  progress: number;
  progressDownload: number;
  progressInsert: number;
  progressUpdatePrice: number;
  progressInsertImages: number;
}