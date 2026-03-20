import { Component, DestroyRef, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { BatchDashboardItem, DashboardResponse } from '../../interfaces/dashboard';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { filter, interval, switchMap, timer } from 'rxjs';
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
import { BatchesService } from '../../services/batches.service';
import { MatTooltip } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompleteBatchesItem } from '../../interfaces/CompleteBatchesItem';
import { AddBatchDialogComponent } from '../../add-batch-dialog/add-batch-dialog.component';

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
    MatCardModule,
    MatTooltip
],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(private dashboardService: DashboardService, 
        private batchesService: BatchesService,
        private router: Router, 
        private stepService: StepService,      
        private dialog: MatDialog,
        private magentoService: MagentoService,
        private destroyRef: DestroyRef
    ) {}
    dashobardItem: BatchDashboardItem[] = [];
    batch: CompleteBatchesItem[] = []; 
    displayedColumns: string[] = ['name', 'currentStep', 'stepStatus', 'heronImport.progress','farmadati.progress','suppliers.progress','magento.progress'];
    displayedColumnsT: string[] = ['Customer', 'StartedAt', 'currentStep', 'stepStatus', 'magento', 'action'];
    dataSource = new MatTableDataSource<BatchDashboardItem>(this.dashobardItem);
    dataSourceT = new MatTableDataSource<CompleteBatchesItem>(this.batch);

    firstLoading: boolean = true;
    earlyClosing: boolean = false;
    steps = ['HeronImport', 'Farmadati', 'Suppliers', 'Magento'];

    ticker = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator

    ngOnInit() {
       this.firstLoading = true;
       this.getLoad();
       setInterval(() => {
            this.ticker++;
        }, 1000);
    }

    getLoad(){
        timer(0, 2500)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                filter(() => document.visibilityState === 'visible'),
                switchMap(async () => this.load())
            )
            .subscribe();
    }

    load() {
        this.get();
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
            this.firstLoading = false;
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

    deleteBatch(b: any){
        const data = 
        {
            title: "Vuoi eliminare questo batch?",
            description:"Dopo l'eliminazione tutti i dati verrano cancellati irreversibilmente.",
            btnDeleteText: "Elimina batch",
            chiudi: "Annulla"
        }
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: '500px',
              data:data
        });
    
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.firstLoading = true;
                this.batchesService.delete(b.batchId!).subscribe(()=>{
                    this.getLoad();
                });  
            } 
            else 
            {
                console.log("Close");
            }
        });
    }

    restartMagento(currentStep: string, row: any){
        if(currentStep === "Magento-insert")
        {
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
        if(currentStep === "update-force")
        {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '500px',
                data: 
                { 
                    title: "Chiusura batch", 
                    description:"Stai terminando anticipatamente il batch. Tutte le operazioni di import saranno concluse.",
                    btnDeleteText: "Termina batch",
                    chiudi: "Annulla"
                }
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.earlyClosing = true;
                    this.magentoService.finalizeBatchAsync(row.batchId).subscribe(()=>{
                        this.getLoad();
                        this.earlyClosing = false;
                    });
                }
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

    getDurata(element: BatchDashboardItem){
        const diff = Date.now() - new Date(element.startedAt).getTime();

        const sec = Math.floor(diff / 1000) % 60;
        const min = Math.floor(diff / 60000) % 60;
        const hour = Math.floor(diff / 3600000);

        return `${hour}h ${min}m ${sec}s`;
    }

    get(){
        this.batchesService.today().subscribe((data: CompleteBatchesItem[]) => {
            this.batch = data.map(b => ({
                ...b, 
                values: '',
                action: {
                    update: 'ri-pencil-line',
                    delete: 'ri-delete-bin-line'
                }
            }));

            //console.log(JSON.stringify(this.batch));
            this.dataSourceT = new MatTableDataSource<CompleteBatchesItem>(this.batch);
            this.dataSourceT.paginator = this.paginator;
        });
    }
    
    start(){
        const dialogRef = this.dialog.open(AddBatchDialogComponent, {
            width: '600px',
            minWidth:'600px'
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) 
            {
                this.firstLoading = true;

                this.batchesService.create(result.customerId, result.type).subscribe((data: any)=>{
                    if(data.batchId){
                        const req: runStepRequest = {
                            batchId: data.batchId,
                            step: "HeronImport",
                            type: Number(result.type)
                        };
                        //console.log(req);
                        if(result.type == 0)
                            this.stepService.retry(req).subscribe((res)=>{
                                this.get();
                                this.firstLoading = false;
                            })
                        else
                            this.stepService.retryByType(req).subscribe((res)=>{
                                this.get();
                                this.firstLoading = false;
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

    DeleteItem(item:CompleteBatchesItem){

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '500px'
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) 
            {
            this.batchesService.delete(item.batch.batchId!).subscribe(()=>{
                this.get();
            });
            } 
            else 
            {
            console.log("Close");
            }
        });
    }
    
}