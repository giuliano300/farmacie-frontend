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
  type: number;

  heronImport: StepMetrics;
  farmadati: StepMetrics;
  suppliers: StepMetrics;
  magento: StepMetricsMagento;
  reindexValues: ReindexStatus;
}

export interface StepMetrics {
  total: number;
  success: number;
  errors: number;
  progress: number;
}

export interface StepMetricsMagento {
  totalMagentoProducts: number;
  downloadedMagentoProducts: number;

  progressTotal: number;

  hasInsertProducts: boolean;
  hasInsertImages: boolean;
  hasUpdateQty: boolean;

  insertProducts: MagentoStep;
  updateProducts: MagentoStep;
  insertImages: MagentoStep;
}

export interface MagentoStep {
  total: number;
  processed: number;
  pending: number;
  errors: number;
  status: number; // OperationsStatus
  progress: number;
}

export interface ReindexStatus {
  running: boolean;
  processed: number;
  total: number;
  percent: number;
}