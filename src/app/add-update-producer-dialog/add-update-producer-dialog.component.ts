import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProducerMappingService } from '../services/producer-mapping.service';

@Component({
  selector: 'app-add-update-producer-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-producer-dialog.component.html',
  styleUrls: ['./add-update-producer-dialog.component.scss']
})
export class AddUpdateProducerDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddUpdateProducerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private service: ProducerMappingService
  ) {}

  // DATA
  managementProducers: any[] = [];
  magentoProducers: any[] = [];

  // SELEZIONI
  selectedGestionale: any = null;
  selectedMagento: any = null;

  // SEARCH
  gestionaleSearch = '';
  magentoSearch = '';

  // DROPDOWN
  filteredGestionale: any[] = [];
  filteredMagento: any[] = [];

  // MAPPINGS
  mappings: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // 🔹 gestionale
    this.service.getManagementProducer(this.data!).subscribe(res => {
      this.managementProducers = res.map((x: any) => ({
        key: x.id,
        label: x.producer
      }));
    });

    // 🔹 magento
    this.service.getMagentoProducer(this.data!).subscribe(res => {
      this.magentoProducers = res;
    });
  }

  // FOCUS
  onGestionaleFocus() {
    this.filteredGestionale = this.managementProducers.slice(0, 50);
  }

  onMagentoFocus() {
    this.filteredMagento = this.magentoProducers.slice(0, 50);
  }

  // SEARCH
  onGestionaleSearch(term: string) {
    if (!term) {
      this.filteredGestionale = this.managementProducers.slice(0, 50);
      return;
    }

    this.filteredGestionale = this.managementProducers
      .filter(x => x.label.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 50);
  }

  onMagentoSearch(term: string) {
    if (!term) {
      this.filteredMagento = this.magentoProducers.slice(0, 50);
      return;
    }

    this.filteredMagento = this.magentoProducers
      .filter(x => x.label.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 50);
  }

  // SELECT
  selectGestionale(p: any) {
    this.selectedGestionale = p;
    this.gestionaleSearch = p.label;
    this.filteredGestionale = [];
  }

  selectMagento(p: any) {
    this.selectedMagento = p;
    this.magentoSearch = p.label;
    this.filteredMagento = [];
  }

  // ADD
  addMapping() {
    if (!this.selectedGestionale || !this.selectedMagento) return;

    const exists = this.mappings.some(x =>
      x.gestionaleKey === this.selectedGestionale.key &&
      x.magentoValue === this.selectedMagento.value
    );

    if (exists) return;

    this.mappings.push({
      gestionaleKey: this.selectedGestionale.key,
      magentoValue: this.selectedMagento.value
    });

    this.reset();
  }

  reset() {
    this.selectedGestionale = null;
    this.selectedMagento = null;
    this.gestionaleSearch = '';
    this.magentoSearch = '';
  }

  // REMOVE
  removeMapping(index: number) {
    this.mappings.splice(index, 1);
  }

  // HELPERS
  getGestionaleLabel(key: string): string {
    return this.managementProducers.find(x => x.key === key)?.label || key;
  }

  getMagentoLabel(value: string): string {
    return this.magentoProducers.find(x => x.value === value)?.label || value;
  }

  // SAVE
  save() {
    const payload = this.mappings.map(m => {
      const magento = this.magentoProducers.find(x => x.value === m.magentoValue);
      const management = this.managementProducers.find(x => x.key === m.gestionaleKey);

      //console.log(management);

      return {
        customerId: this.data!,
        magentoValue: magento?.value,
        magentoLabel: magento?.label || '',
        managementLabel: management.label || '',
        managementKey:  management.key
      };
    });

    this.dialogRef.close(payload);
  }

  // CLICK OUTSIDE
  @HostListener('document:click')
  onClickOutside() {
    this.filteredGestionale = [];
    this.filteredMagento = [];
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}