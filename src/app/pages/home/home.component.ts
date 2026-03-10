import { Component, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { BatchDashboardItem, DashboardResponse } from '../../interfaces/dashboard';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { interval } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StepService } from '../../services/step.service';
import { runStepRequest } from '../../interfaces/runStepRequest';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MagentoService } from '../../services/magento.service';

@Component({
    selector: 'app-home',
    imports: [
    MatButtonModule, 
    MatSlideToggleModule, 
    MatMenuModule, 
    MatPaginatorModule, 
    MatTableModule, 
    MatCheckboxModule, 
    MatFormFieldModule, 
    CommonModule,
    MatProgressBarModule,
    MatCardModule
],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(private dashboardService: DashboardService, 
        private router: Router, 
        private stepService: StepService,      
        private dialog: MatDialog,
        private magentoService: MagentoService
    ) {}
    dashobardItem: BatchDashboardItem[] = [];
    displayedColumns: string[] = ['name', 'sequenceNumber', 'currentStep', 'stepStatus', 'heronImport.progress','farmadati.progress','suppliers.progress','magento.progress'];
    dataSource = new MatTableDataSource<BatchDashboardItem>(this.dashobardItem);

    steps = ['HeronImport', 'Farmadati', 'Suppliers', 'Magento'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit() {
       this.getLoad();
    }

    getLoad(){
        this.load();
        interval(2500).subscribe(() => {
            this.load();
        });
    }

    load() {
        this.dashboardService.getDashboard().subscribe(x => {

            const all = [
            ...x.activeBatches,
            ...x.completedBatches
            ];


            this.dashobardItem = all.map(dashobardItem => ({
                ...dashobardItem, 
                
            }));

            //console.log(JSON.stringify(this.customers));
            this.dataSource = new MatTableDataSource<BatchDashboardItem>(this.dashobardItem);
            this.dataSource.paginator = this.paginator;
        });
    }

    getColor(progress: number): 'primary' | 'accent' | 'warn' {

        if (progress < 40) {
            return 'warn';       // rosso
        }

        if (progress < 80) {
            return 'accent';     // arancione
        }

        return 'primary';      // blue
    }

    restartMagento(currentStep: string, row: any){
        if(currentStep === "Magento-insert")
        {
            this.dialog.open(AlertDialogComponent, {
                width: '500px',
                data: 
                { 
                    title: "Attenzione", 
                    description: "L' importazione dei prodotti su magento richiede un tempo di sincronizzazione dei prodotti di almeno 10 minuti. Dopo questo tempo inizierà l'import reale sul portale web."
                }
            });
            this.magentoService.massiveImport(row.batchId).subscribe(()=>{
                this.getLoad();
            });
        }
        if(currentStep === "Magento-update-price")
        {
            this.magentoService.updateStockBulk(row.batchId).subscribe(()=>{
                this.getLoad();
            });
        }
        if(currentStep === "Magento-insert-images")
        {
            this.magentoService.updateImageBulk(row.batchId).subscribe(()=>{
                this.getLoad();
            });
        }
    }

    restart(currentStep: string, row: any){
        const req:runStepRequest = {
            batchId: row.batchId,
            step: currentStep ?? "HeronImport"
        };
        this.stepService.retry(req).subscribe((res)=>{
            this.getLoad();
        });
    }

    getStatus(status:number){
        switch(status){
            case 0: 
                return 'in attesa';
            case 1:
                return 'in corso';
            case 2:
                return 'terminato';
            case 3:
                return 'in errore';
            default:
                return 'pending';
        }
    }

    getName(stepName: string){
        switch(stepName){
            case "HeronImport": 
                return "Import file heron";
            case "Farmadati": 
                return "Arricchimento da farmadati";
            case "Suppliers": 
                return "Sincro con prezzi fornitori";
            case "Magento": 
                return "Upload su store Magento";
            default:
                return "Step sconosciuto";
        }
    }
}