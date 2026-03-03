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

@Component({
    selector: 'app-customers',
    imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip],
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.scss'
})
export class CustomersComponent {

    customers: customers[] = []; 
    displayedColumns: string[] = ['id','name', 'magentoStoreCode', 'active', 'action'];
    dataSource = new MatTableDataSource<customers>(this.customers);

    constructor(private dialog: MatDialog, private customersService: CustomersService, private router: Router) {}

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
        this.customersService.getCustomers().subscribe((data: customers[]) => {
            // Aggiungi la proprietà action a ogni categoria esistente
            this.customers = data.map(customer => ({
                ...customer, 
                action: {
                    details: 'ri-search-line',
                    update: 'ri-pencil-line',
                    delete: 'ri-delete-bin-line'
                }
            }));

            //console.log(JSON.stringify(this.customers));
            this.dataSource = new MatTableDataSource<customers>(this.customers);
            this.dataSource.paginator = this.paginator;
        });
   }

   openDetails(customer: any){
    const dialogRef = this.dialog.open(DetailCustomerDialogComponent, {
      data: customer,
      width: '80vw',
      maxWidth: '1000px'
    });

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
