import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, interval, switchMap } from 'rxjs';
import { BatchesService } from '../../services/batches.service';
import { CustomersService } from '../../services/customers.service';
import { DashboardService } from '../../services/dashboard.service';
import { CompleteBatchesItem } from '../../interfaces/CompleteBatchesItem';
import { BatchDashboardItem } from '../../interfaces/Dashboard';
import { customerWithBatchStatus } from '../../interfaces/customerWithBatchStatus';
import { SuppliersService } from '../../services/suppliers.service';
import { FarmadatiUpdatesService } from '../../services/farmadati-updates.service';
import { suppliers } from '../../interfaces/supplier';
import { FarmadatiUpdates } from '../../interfaces/Farmadati-updates';

@Component({
    selector: 'app-home',
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    activeBatches: BatchDashboardItem[] = [];
    completedBatches: CompleteBatchesItem[] = [];
    customers: customerWithBatchStatus[] = [];
    suppliers: suppliers[] = [];
    farmadatiUpdates: FarmadatiUpdates[] = [];
    loading = true;

    constructor(
        private dashboardService: DashboardService,
        private batchesService: BatchesService,
        private customersService: CustomersService,
        private suppliersService: SuppliersService,
        private farmadatiUpdatesService: FarmadatiUpdatesService,
        private router: Router,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.customersService.getCustomers()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(data => this.customers = data);

        interval(3000).pipe(
            switchMap(() => forkJoin({
                dashboard: this.dashboardService.getDashboard(),
                completed: this.batchesService.today(),
                suppliers: this.suppliersService.getSuppliers(),
                farmadati: this.farmadatiUpdatesService.get()
            })),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(data => {
            this.activeBatches = data.dashboard.activeBatches;
            this.completedBatches = data.completed;
            this.suppliers = data.suppliers;
            this.farmadatiUpdates = this.sortFarmadati(data.farmadati);
            this.loading = false;
        });

        this.refresh();
    }

    refresh(): void {
        forkJoin({
            dashboard: this.dashboardService.getDashboard(),
            completed: this.batchesService.today(),
            suppliers: this.suppliersService.getSuppliers(),
            farmadati: this.farmadatiUpdatesService.get()
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
            this.activeBatches = data.dashboard.activeBatches;
            this.completedBatches = data.completed;
            this.suppliers = data.suppliers;
            this.farmadatiUpdates = this.sortFarmadati(data.farmadati);
            this.loading = false;
        });
    }

    private sortFarmadati(updates: FarmadatiUpdates[]): FarmadatiUpdates[] {
        return [...updates].sort((a, b) => new Date(b.startedAt ?? 0).getTime() - new Date(a.startedAt ?? 0).getTime());
    }

    get activeCustomers(): number {
        return this.customers.filter(item => item.customer.active).length;
    }

    get totalProductsToday(): number {
        return this.completedBatches.reduce((total, item) => total + (item.report?.totalProducts ?? 0), 0);
    }

    get errorsToday(): number {
        return this.completedBatches.reduce((total, item) => total + (item.report?.errors ?? 0), 0) +
            this.activeBatches.reduce((total, item) => total + this.getBatchErrors(item), 0);
    }

    get successRate(): number {
        const reported = this.completedBatches.filter(item => item.report);
        if (!reported.length) return 100;
        return Math.round(reported.filter(item => (item.report?.errors ?? 0) === 0).length / reported.length * 100);
    }

    get inactiveCustomers(): customerWithBatchStatus[] {
        return this.customers.filter(item => !item.customer.active);
    }

    get problematicActiveBatches(): BatchDashboardItem[] {
        return this.activeBatches.filter(item => this.getBatchErrors(item) > 0);
    }

    get failedClosedBatches(): CompleteBatchesItem[] {
        return this.completedBatches.filter(item => (item.report?.errors ?? 0) > 0);
    }

    get attentionCount(): number {
        return this.inactiveCustomers.length + this.problematicActiveBatches.length + this.failedClosedBatches.length;
    }

    get activeSuppliers(): number {
        return this.suppliers.filter(item => item.active).length;
    }

    get suppliersUpdatedToday(): number {
        return this.suppliers.filter(item => item.lastUpdate && this.isToday(item.lastUpdate)).length;
    }

    get suppliersWithoutUpdates(): number {
        return this.suppliers.filter(item => item.active && !item.lastUpdate).length;
    }

    get supplierUpdateCoverage(): number {
        if (!this.activeSuppliers) return 100;
        return Math.round(this.suppliers.filter(item => item.active && item.lastUpdate).length / this.activeSuppliers * 100);
    }

    get farmadatiRunning(): number {
        return this.farmadatiUpdates.filter(item => item.startedAt && !item.endedAt).length;
    }

    get farmadatiCompletedToday(): number {
        return this.farmadatiUpdates.filter(item => item.endedAt && this.isToday(item.endedAt)).length;
    }

    get farmadatiProductsToday(): number {
        return this.farmadatiUpdates
            .filter(item => item.startedAt && this.isToday(item.startedAt))
            .reduce((total, item) => total + (item.productWorked ?? 0), 0);
    }

    get latestFarmadatiProgress(): number {
        const latest = this.farmadatiUpdates[0];
        if (!latest?.productNumber) return 0;
        return Math.min(100, Math.round((latest.productWorked ?? 0) / latest.productNumber * 100));
    }

    private isToday(value: string | Date): boolean {
        const date = new Date(value);
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
    }

    getBatchErrors(batch: BatchDashboardItem): number {
        return (batch.heronImport?.errors ?? 0) + (batch.farmadati?.errors ?? 0) +
            (batch.suppliers?.errors ?? 0) + (batch.magento?.insertProducts?.errors ?? 0) +
            (batch.magento?.updateProducts?.errors ?? 0) + (batch.magento?.insertImages?.errors ?? 0);
    }

    customerName(item: any): string {
        return item?.customer?.name ?? 'Cliente';
    }

    openBatches(): void {
        this.router.navigate(['/batches']);
    }

    openCustomers(): void {
        this.router.navigate(['/customers']);
    }

    openSuppliers(): void {
        this.router.navigate(['/suppliers']);
    }

    openFarmadati(): void {
        this.router.navigate(['/farmadati']);
    }
}
