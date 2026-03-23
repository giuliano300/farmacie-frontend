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
import { CommonModule, DatePipe } from '@angular/common';
import { CategoryMapping } from '../../../interfaces/category-mapping';
import { CategoryMappingService } from '../../../services/category-mapping.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { CustomersService } from '../../../services/customers.service';
import { customerWithBatchStatus } from '../../../interfaces/customerWithBatchStatus';
import { AddUpdateCategoryDialogComponent } from '../../../add-update-category-dialog/add-update-category-dialog.component';
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
    selector: 'app-categories',
    imports: [MatCardModule,
    MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip, CommonModule, MatProgressBar],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

    categories: CategoryMapping[] = []; 
    displayedColumns: string[] = ['sourceCategory', 'sourceSubCategory', 'magentoPath', 'action'];
    dataSource = new MatTableDataSource<CategoryMapping>(this.categories);

    customerId: string | undefined = undefined;
    customer: customerWithBatchStatus | undefined;
    firstLoading: boolean = true;
    isUpdating: boolean = false;

    constructor(private dialog: MatDialog, 
      private categoriesService: CategoryMappingService, 
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
      this.getCategories();
    }

    getCategories(){
      this.firstLoading = true;
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (!id) this.router.navigate(["customers"]);

        this.customerId = id!;

        this.customerService.getCustomer(id!).subscribe((c: customerWithBatchStatus)=>{
            this.customer = c;
        })


        this.categoriesService.getAll(this.customerId!).subscribe((data: CategoryMapping[]) => {
            this.categories = data.map(supplier => ({
                ...supplier, 
                action: {
                    update: 'ri-pencil-line',
                    delete: 'ri-delete-bin-line'
                }
            }));

            //console.log(JSON.stringify(this.categories));
            this.dataSource = new MatTableDataSource<CategoryMapping>(this.categories);
            this.dataSource.paginator = this.paginator;
            this.firstLoading = false;
        });
      });
   }

    addCategory(){
     const dialogRef = this.dialog.open(AddUpdateCategoryDialogComponent, {
      width: '1000px',
      minWidth: '1000px',
      minHeight:'300px',
      data: this.customerId
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) 
      {
        this.categoriesService.setMultipleMapping(this.customerId!, result).subscribe((res)=>{
          this.getCategories();
        })
      } 
      else 
      {
        console.log("Close");
      }
    });
   }
    
   update(){
    this.isUpdating = true;
      this.categoriesService.SetMagentoManagementCategories(this.customerId!).subscribe((res)=>{
          this.isUpdating = false;
      })
   }

   updateCategory(category: CategoryMapping){
     const dialogRef = this.dialog.open(AddUpdateCategoryDialogComponent, {
       data: category,
       width: '500px'
     });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) 
      {
        //console.log(result);
        const cat: CategoryMapping = {
          ...result,
          customerId: category.customerId,
          id: category.id
        }

        this.categoriesService.update(category.id!, cat).subscribe((res)=>{
          this.getCategories();
        })

      } 
      else 
      {
        console.log("Close");
      }
    });
  }
        
  DeleteItem(item:CategoryMapping){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) 
      {
        this.categoriesService.delete(item.id!).subscribe(()=>{
          this.getCategories();
        });
      } 
      else 
      {
        console.log("Close");
      }
    });
  }
}
