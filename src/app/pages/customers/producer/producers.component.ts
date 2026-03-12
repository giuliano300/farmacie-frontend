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
import { ProducerMapping } from '../../../interfaces/producer-mapping';
import { ProducerMappingService } from '../../../services/producer-mapping.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { CustomersService } from '../../../services/customers.service';
import { customerWithBatchStatus } from '../../../interfaces/customerWithBatchStatus';
import { AddUpdateProducerDialogComponent } from '../../../add-update-producer-dialog/add-update-producer-dialog.component';
import { MatProgressBar } from "@angular/material/progress-bar";

@Component({
    selector: 'app-producers',
    imports: [MatCardModule,
    MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip, CommonModule, MatProgressBar],
    templateUrl: './producers.component.html',
    styleUrl: './producers.component.scss'
})
export class ProducersComponent {

    producer: ProducerMapping[] = []; 
    displayedColumns: string[] = ['sourceProducer', 'targetProducer', 'action'];
    dataSource = new MatTableDataSource<ProducerMapping>(this.producer);

    customerId: string | undefined = undefined;
    customer: customerWithBatchStatus | undefined;
    firstLoading: boolean = true;

    constructor(private dialog: MatDialog, 
      private producerService: ProducerMappingService, 
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
      this.getproducer();
    }

    getproducer(){
      this.firstLoading = true;
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (!id) this.router.navigate(["customers"]);

        this.customerId = id!;

        this.customerService.getCustomer(id!).subscribe((c: customerWithBatchStatus)=>{
            this.customer = c;
        })


        this.producerService.getAll(this.customerId!).subscribe((data: ProducerMapping[]) => {
            this.producer = data.map(supplier => ({
                ...supplier, 
                action: {
                    update: 'ri-pencil-line',
                    delete: 'ri-delete-bin-line'
                }
            }));

            //console.log(JSON.stringify(this.producer));
            this.dataSource = new MatTableDataSource<ProducerMapping>(this.producer);
            this.dataSource.paginator = this.paginator;
            this.firstLoading = false;
        });
      });
   }

   addproducer(){
     const dialogRef = this.dialog.open(AddUpdateProducerDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) 
      {
        const cat: ProducerMapping = {
          ...result,
          customerId: this.customerId
        }

        this.producerService.create(cat).subscribe((res)=>{
          this.getproducer();
        })
      } 
      else 
      {
        console.log("Close");
      }
    });
   }
    
   updateProducer(producer: ProducerMapping){
     const dialogRef = this.dialog.open(AddUpdateProducerDialogComponent, {
       data: producer,
       width: '500px'
     });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) 
      {
        //console.log(result);
        const cat: ProducerMapping = {
          ...result,
          customerId: producer.customerId,
          id: producer.id
        }

        this.producerService.update(producer.id!, cat).subscribe((res)=>{
          this.getproducer();
        })

      } 
      else 
      {
        console.log("Close");
      }
    });
  }
        
  DeleteItem(item:ProducerMapping){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) 
      {
        this.producerService.delete(item.id!).subscribe(()=>{
          this.getproducer();
        });
      } 
      else 
      {
        console.log("Close");
      }
    });
  }
}
