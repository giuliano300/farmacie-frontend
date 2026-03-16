import { Component, DestroyRef, ViewChild } from '@angular/core';
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
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressBar } from "@angular/material/progress-bar";
import { FarmadatiUpdates } from '../../interfaces/farmadati-updates';
import { FarmadatiUpdatesService } from '../../services/farmadati-updates.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap, timer } from 'rxjs';

@Component({
    selector: 'app-farmadati',
    imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip, DatePipe, CommonModule, MatProgressBar],
    templateUrl: './farmadati.component.html',
    styleUrl: './farmadati.component.scss'
})
export class FarmadatiComponent {

    farmadatiUpdates: FarmadatiUpdates[] = []; 
    displayedColumns: string[] = ['id', 'startedAt', 'progress', 'endedAt', 'action'];
    dataSource = new MatTableDataSource<FarmadatiUpdates>(this.farmadatiUpdates);
    constructor(private dialog: MatDialog, private farmadatiUpdatesService: FarmadatiUpdatesService, private router: Router, private destroyRef: DestroyRef) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnInit(): void {
      timer(0, 2500)
        .pipe(
            takeUntilDestroyed(this.destroyRef),
            filter(() => document.visibilityState === 'visible'),
            switchMap(async () => this.getFarmadati())
        )
        .subscribe();
    }

    getFarmadati(){
      this.farmadatiUpdatesService.get().subscribe((data: FarmadatiUpdates[]) => {
          // Aggiungi la proprietà action a ogni categoria esistente
          this.farmadatiUpdates = data.map(f => ({
              ...f, 
              progress: '',
              action: {
                  delete: 'ri-delete-bin-line'
              }
          }));

          //console.log(JSON.stringify(this.suppliers));
          this.dataSource = new MatTableDataSource<FarmadatiUpdates>(this.farmadatiUpdates);
          this.dataSource.paginator = this.paginator;
      });
   }
    
    start(){
      const f: FarmadatiUpdates = {
        productNumber:0,
        productWorked:0
      };
      this.farmadatiUpdatesService.create(f).subscribe((data)=>{
        this.getFarmadati();
      })
    }
      
    DeleteItem(item:FarmadatiUpdates){

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px'
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.farmadatiUpdatesService.delete(item.id!)
            .subscribe((data: boolean) => {
              if(data){
                this.getFarmadati();
              }
            });
        } 
        else 
        {
          console.log("Close");
        }
      });
    }

    getProgressBarValue(element: FarmadatiUpdates){
      const total = !element.productNumber ? 0 : element.productWorked! / element.productNumber! * 100;
      return  total.toFixed(2);
    }
}
