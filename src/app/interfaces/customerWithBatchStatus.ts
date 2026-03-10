import { customers } from "./customer";
import { stepStatus } from "./enum";

export interface customerWithBatchStatus {
  customer: customers;

  canStartNewBatch: boolean;

  runningBatchId?: string;

  runningStepId?: string;

  currentStep?: string;

  stepStatus?: stepStatus;

  createdAt?: Date;
}