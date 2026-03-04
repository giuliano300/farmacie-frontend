import { stepStatus } from "./enum";

export interface batchStatusResponse {
  CanStartNewBatch: boolean;

  runningBatchId?: string;

  runningStepId?: string;

  currentStep?: string;

  stepStatus?: stepStatus;
}