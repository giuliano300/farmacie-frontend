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
import { suppliers } from '../../interfaces/supplier';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltip } from "@angular/material/tooltip";
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SuppliersService } from '../../services/suppliers.service';

@Component({
    selector: 'app-suppliers',
    imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip],
    templateUrl: './suppliers.component.html',
    styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent {

    suppliers: suppliers[] = []; 
    displayedColumns: string[] = ['id','name', 'code', 'active', 'lastUpdate', 'sincro', 'action'];
    dataSource = new MatTableDataSource<suppliers>(this.suppliers);

    constructor(private dialog: MatDialog, private suppliersService: SuppliersService, private router: Router) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnInit(): void {
        this.getSuppliers();
    }

    getSuppliers(){
        this.suppliersService.getSuppliers().subscribe((data: suppliers[]) => {
            // Aggiungi la proprietà action a ogni categoria esistente
            this.suppliers = data.map(supplier => ({
                ...supplier, 
                sincro: 'ri-restart-line',
                action: {
                    update: 'ri-pencil-line',
                    delete: 'ri-delete-bin-line'
                }
            }));

            //console.log(JSON.stringify(this.suppliers));
            this.dataSource = new MatTableDataSource<suppliers>(this.suppliers);
            this.dataSource.paginator = this.paginator;
        });
   }
    
   updateSupplier(id:string){
    this.router.navigate(['/suppliers/add', id]);
  }
    
  DeleteItem(item:suppliers){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.suppliersService.delete(item.id!)
          .subscribe((data: boolean) => {
            if(data){
              this.getSuppliers();
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
