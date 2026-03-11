export interface BatchReport {
  batchId: string;
  finishedAt: Date;
  totalProducts: number;
  insert: number;
  updatePrice: number;
  insertImages: number;
  complete: number;
  errors: number;
}