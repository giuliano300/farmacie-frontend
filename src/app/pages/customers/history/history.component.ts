import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltip } from "@angular/material/tooltip";
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { customerWithBatchStatus } from '../../../interfaces/customerWithBatchStatus';
import { CompleteBatchesItem } from '../../../interfaces/CompleteBatchesItem';
import { BatchesService } from '../../../services/batches.service';
import { CustomersService } from '../../../services/customers.service';
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
    selector: 'app-history',
    imports: [MatCardModule,
    MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip, CommonModule, MatProgressBar],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss'
})
export class HistoryComponent {

    batch: CompleteBatchesItem[] = []; 
    displayedColumns: string[] = ['StartedAt', 'currentStep', 'stepStatus', 'magento', 'action'];
    dataSource = new MatTableDataSource<CompleteBatchesItem>(this.batch);

    customerId: string | undefined = undefined;
    customer: customerWithBatchStatus | undefined;
    firstLoading: boolean = true;
    totalCount: number = 0;
    pageIndex: number = 0;
    pageSize: number = 10;

    constructor(private dialog: MatDialog, 
      private batchesService: BatchesService,
      private customerService: CustomersService, 
      private router: Router,     
      private route: ActivatedRoute,
) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnInit(): void {
      this.get();
    }

    get(){
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (!id) {
          this.router.navigate(["customers"]);
          return;
        }

        this.customerId = id;
        this.pageIndex = 0;

        this.customerService.getCustomer(id).subscribe((c: customerWithBatchStatus)=>{
            this.customer = c;
        })

        this.loadHistory();
      });
   }

  loadHistory(){
    if (!this.customerId) return;

    this.firstLoading = true;

    this.batchesService.history(this.customerId, this.pageIndex, this.pageSize).subscribe((data) => {
            this.totalCount = data.totalCount;
            this.pageIndex = data.pageIndex;
            this.pageSize = data.pageSize;
            this.batch = data.items.map(b => ({
                ...b,
                values: '',
                action: {
                    update: 'ri-pencil-line',
                    delete: 'ri-delete-bin-line'
                }
            }));

            //console.log(JSON.stringify(this.batch));
            this.dataSource = new MatTableDataSource<CompleteBatchesItem>(this.batch);
            this.firstLoading = false;
        });
  }

  onPageChange(event: PageEvent){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHistory();
  }

  reloadCurrentPage(){
    if (this.batch.length === 1 && this.pageIndex > 0) {
      this.pageIndex--;
    }

    this.loadHistory();
  }

  DeleteItem(item:CompleteBatchesItem){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) 
      {
        this.firstLoading = true;
        this.batchesService.delete(item.batch.batchId!).subscribe(()=>{
          this.reloadCurrentPage();
        });
      } 
      else 
      {
        console.log("Close");
      }
    });
  }

  back(){
    this.router.navigate(["customers"]);
  }

}
