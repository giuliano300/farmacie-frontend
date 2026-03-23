import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { customers } from '../../interfaces/customer';
import { CustomersService } from '../../services/customers.service';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltip } from "@angular/material/tooltip";
import { DetailCustomerDialogComponent } from '../../detail-customer-dialog/detail-customer-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { customerWithBatchStatus } from '../../interfaces/customerWithBatchStatus';
import { CommonModule } from '@angular/common';
import { BatchesService } from '../../services/batches.service';
import { StepService } from '../../services/step.service';
import { runStepRequest } from '../../interfaces/runStepRequest';
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
    selector: 'app-customers',
    imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip, CommonModule, MatProgressBar],
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.scss'
})
export class CustomersComponent {

    customers: customerWithBatchStatus[] = []; 
    displayedColumns: string[] = ['name', 'magentoStoreCode', 'msi', 'active', 'categories', 'suppliers', 'batches', 'create', 'action'];
    dataSource = new MatTableDataSource<customerWithBatchStatus>(this.customers);
    firstLoading: boolean = true;

    constructor(
      private dialog: MatDialog, 
      private customersService: CustomersService, 
      private batchesService: BatchesService, 
      private stepService: StepService, 
      private router: Router) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnInit(): void {
      this.getCustomers();
    }
    

    getCustomers(){
      this.firstLoading = true;
        this.customersService.getCustomers().subscribe((data: customerWithBatchStatus[]) => {
            // Aggiungi la proprietà action a ogni categoria esistente
            //console.log(data);
            this.customers = data.map(customer => ({
                ...customer, 
                create:'ri-play-fill',
                categories: 'ri-search-line',
                suppliers: 'ri-search-line',
                batches: 'ri-search-line',
                action: {
                    details: 'ri-search-line',
                    update: 'ri-pencil-line',
                    delete: 'ri-delete-bin-line'
                }
            }));

            //console.log(JSON.stringify(this.customers));
            this.dataSource = new MatTableDataSource<customerWithBatchStatus>(this.customers);
            this.dataSource.paginator = this.paginator;
            this.firstLoading = false;
        });
    }

    getToCategories(id:string){
       this.router.navigate(['/customer/categories', id]);
    }

    getToProducers(id:string){
       this.router.navigate(['/customer/producers', id]);
    }

   openDetails(customer: any){
    const dialogRef = this.dialog.open(DetailCustomerDialogComponent, {
      data: customer,
      width: '80vw',
      maxWidth: '1000px'
    });

  }

  isEnabled(element: customerWithBatchStatus){
    if(element.canStartNewBatch)
      return true;

    const dateFromApi = new Date(element.createdAt!);
    const today = new Date();

    // rimuovo l'orario
    dateFromApi.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (dateFromApi.getTime() != today.getTime())
        return true;

    return false;
  }

  createBatch(id: string){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data:
      {
        title: "Vuoi avviare un nuovo batch?",
        description:"Dopo l'avvio puoi controllare in dashboard lo stato di avanzamento del batch.",
        btnDeleteText: "Avvia batch"
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.batchesService.create(id, 0).subscribe((data: any)=>{
          if(data.batchId){
            const req: runStepRequest = {
              batchId: data.batchId,
              step: "HeronImport",
              type: 0
            };
            this.stepService.retry(req).subscribe((res)=>{
              this.getCustomers();
            })
          }
        })
      } 
      else 
      {
        console.log("Close");
      }
    });
   }

   getTooltip(element: any): string {
      return this.isEnabled(element)
        ? 'Crea batch'
        : 'Batch già in esecuzione';
    }

   updateCustomer(id:string){
    this.router.navigate(['/customers/add', id]);
  }
    
  DeleteItem(item:customers){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.customersService.delete(item.id!)
          .subscribe((data: boolean) => {
            if(data){
              this.getCustomers();
            }
          });
      } 
      else 
      {
        console.log("Close");
      }
    });
  }

  showBatches(id:string){
       this.router.navigate(['/customer/history', id]);
  }
}
