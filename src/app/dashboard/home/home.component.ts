import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { DashboardResponse } from '../../interfaces/dashboard';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { interval } from 'rxjs';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelDescription, MatExpansionPanelTitle } from "@angular/material/expansion";

@Component({
    selector: 'app-home',
    imports: [
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle
],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(private dashboardService: DashboardService, private router: Router) {}
    groupedBatches: any[] = [];
    openedCustomers = new Set<string>();
    openedBatches = new Set<string>();

    dashboard?: DashboardResponse;

    ngOnInit() {
        this.load();
        interval(5000).subscribe(() => {
            this.load();
        });
    }

    toggleBatch(batch:any) {
        if(this.openedBatches.has(batch.batchId))
            this.openedBatches.delete(batch.batchId);
        else
            this.openedBatches.add(batch.batchId);
    }

    load() {
        this.dashboardService.getDashboard().subscribe(x => {

            const all = [
            ...x.activeBatches,
            ...x.completedBatches
            ];

            const map: any = {};

            for (let batch of all) {

            if (!map[batch.customerId]) {
                map[batch.customerId] = {
                customerId: batch.customerId,
                batches: []
                };
            }

            map[batch.customerId].batches.push(batch);
            }

            this.groupedBatches = Object.values(map);
        });
    }

    toggle(batch: any) {
        const id = batch.batchId;

        if (this.openedBatches.has(id)) {
            this.openedBatches.delete(id);
        } else {
            this.openedBatches.add(id);
        }
    }

    isOpen(batch: any) {
        return this.openedBatches.has(batch.batchId);
    }

    trackBatch(index: number, batch: any) {
        return batch.batchId;
    }
}