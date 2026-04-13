import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltip } from "@angular/material/tooltip";
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { CustomersService } from '../../../services/customers.service';
import { customerWithBatchStatus } from '../../../interfaces/customerWithBatchStatus';
import { MatProgressBar } from "@angular/material/progress-bar";
import { ProductToExclude } from '../../../interfaces/Product-to-exclude';
import { ProductToExcludeService } from '../../../services/product-to-exclude.service';
import { AddProductToExcludeDialogComponent } from '../../../add-product-to-exclude-dialog/add-product-to-exclude-dialog.component';

@Component({
    selector: 'app-product-to-exclude',
    imports: [MatCardModule,
    MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip, CommonModule, MatProgressBar],
    templateUrl: './product-to-exclude.component.html',
    styleUrl: './product-to-exclude.component.scss'
})
export class ProductToExcludeComponent {

    product: ProductToExclude[] = []; 
    displayedColumns: string[] = ['productName', 'aic', 'action'];
    dataSource = new MatTableDataSource<ProductToExclude>(this.product);

    customerId: string | undefined = undefined;
    customer: customerWithBatchStatus | undefined;
    firstLoading: boolean = true;
    isUpdating: boolean = false;

    constructor(private dialog: MatDialog, 
      private productService: ProductToExcludeService, 
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
      this.getProducts();
    }

    getProducts(){
      this.firstLoading = true;
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (!id) this.router.navigate(["customers"]);

        this.customerId = id!;

        this.customerService.getCustomer(id!).subscribe((c: customerWithBatchStatus)=>{
            this.customer = c;
        })


        this.productService.getAll(this.customerId!).subscribe((data: ProductToExclude[]) => {
            this.product = data.map(p => ({
                ...p, 
                action: {
                    update: 'ri-pencil-line',
                    delete: 'ri-delete-bin-line'
                }
            }));

            //console.log(JSON.stringify(this.categories));
            this.dataSource = new MatTableDataSource<ProductToExclude>(this.product);
            this.dataSource.paginator = this.paginator;
            this.firstLoading = false;
        });
      });
   }

    addProducts(){
     const dialogRef = this.dialog.open(AddProductToExcludeDialogComponent, {
      width: '1000px',
      minWidth: '1000px',
      minHeight:'300px',
      data: this.customerId
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) 
      {
        this.productService.setMultiple(result).subscribe((res)=>{
          this.getProducts();
        })
      } 
      else 
      {
        console.log("Close");
      }
    });
   }

   DeleteItem(item:ProductToExclude){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) 
      {
        this.productService.delete(item.id!).subscribe(()=>{
          this.getProducts();
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
