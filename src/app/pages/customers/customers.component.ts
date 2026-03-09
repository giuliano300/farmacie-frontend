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

@Component({
    selector: 'app-customers',
    imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip, CommonModule],
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.scss'
})
export class CustomersComponent {

    customers: customerWithBatchStatus[] = []; 
    displayedColumns: string[] = ['id','name', 'magentoStoreCode', 'active', 'categories', 'suppliers', 'create', 'action'];
    dataSource = new MatTableDataSource<customerWithBatchStatus>(this.customers);

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
        this.customersService.getCustomers().subscribe((data: customerWithBatchStatus[]) => {
            // Aggiungi la proprietà action a ogni categoria esistente
            //console.log(data);
            this.customers = data.map(customer => ({
                ...customer, 
                create:'ri-play-fill',
                categories: 'ri-search-line',
                suppliers: 'ri-search-line',
                action: {
                    details: 'ri-search-line',
                    update: 'ri-pencil-line',
                    delete: 'ri-delete-bin-line'
                }
            }));

            //console.log(JSON.stringify(this.customers));
            this.dataSource = new MatTableDataSource<customerWithBatchStatus>(this.customers);
            this.dataSource.paginator = this.paginator;
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

  createBatch(id: string){
      this.batchesService.create(id).subscribe((data: any)=>{
        if(data.batchId){
          const req: runStepRequest = {
            batchId: data.batchId,
            step: "HeronImport"
          };
          this.stepService.run(req).subscribe((res)=>{
            this.getCustomers();
          })
        }
      })
   }

   getTooltip(element: any): string {
      return element.canStartNewBatch
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
}
