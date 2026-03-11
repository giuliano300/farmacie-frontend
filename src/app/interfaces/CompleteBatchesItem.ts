import { BatchReport } from "./batch-report";
import { BatchDashboardItem } from "./dashboard";

export interface CompleteBatchesItem {
  batch: BatchDashboardItem;
  report?: BatchReport;
}