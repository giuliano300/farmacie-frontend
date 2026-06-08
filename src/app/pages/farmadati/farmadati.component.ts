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
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltip } from "@angular/material/tooltip";
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressBar } from "@angular/material/progress-bar";
import { FarmadatiUpdates } from '../../interfaces/Farmadati-updates';
import { FarmadatiUpdatesService } from '../../services/farmadati-updates.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap, timer } from 'rxjs';
import { AddFarmadatiDialogComponent } from '../../add-farmadati-dialog/add-farmadati-dialog.component';

@Component({
    selector: 'app-farmadati',
    imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatTooltip, DatePipe, CommonModule, MatProgressBar],
    templateUrl: './farmadati.component.html',
    styleUrl: './farmadati.component.scss'
})
export class FarmadatiComponent {

    farmadatiUpdates: FarmadatiUpdates[] = []; 
    displayedColumns: string[] = ['startedAt', 'status', 'progress','durata', 'endedAt', 'action'];
    dataSource = new MatTableDataSource<FarmadatiUpdates>(this.farmadatiUpdates);
    constructor(private dialog: MatDialog, private farmadatiUpdatesService: FarmadatiUpdatesService, private router: Router, private destroyRef: DestroyRef) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnInit(): void {
      timer(0, 1000)
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
          this.farmadatiUpdates = data
            .sort((a, b) => new Date(b!.startedAt!).getTime() - new Date(a!.startedAt!).getTime())
            .map(f => ({              
              ...f, 
              progress: '',
              durata: '',
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
      const dialogRef = this.dialog.open(AddFarmadatiDialogComponent, {
        width: '500px',
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.farmadatiUpdatesService.create(result.type).subscribe((data)=>{
            this.getFarmadati();
          })        
          console.log(result);
        } 
        else 
        {
          console.log("Close");
        }
      });

    }
      
    DeleteItem(item:FarmadatiUpdates){

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px'
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.farmadatiUpdatesService.delete(item!.id!)
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
      if(element!.productNumber == 0)
        return 0;

      const total = !element!.productNumber ? 0 : element!.productWorked! / element!.productNumber! * 100;
      return  total.toFixed(2);
    }

    getDurataImport(element: FarmadatiUpdates){
      if(element!.startedAt == null)
        return '';    

      const start = new Date(element!.startedAt!);
      let now = new Date();
      const diff = Math.abs(now.getTime() - start.getTime());
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if(element!.endedAt != null)
        now = new Date(element!.endedAt!);

      return `${minutes} m ${seconds} s`;
    }
}
