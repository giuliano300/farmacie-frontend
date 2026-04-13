import { BatchReport } from "./batch-report";
import { BatchDashboardItem } from "./Dashboard";

export interface CompleteBatchesItem {
  batch: BatchDashboardItem;
  report?: BatchReport;
}