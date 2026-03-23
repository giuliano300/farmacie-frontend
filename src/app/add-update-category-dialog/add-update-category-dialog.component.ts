import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryMapping } from '../interfaces/category-mapping';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryMappingService } from '../services/category-mapping.service';

@Component({
  selector: 'app-add-update-category-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-update-category-dialog.component.html',
  styleUrls: ['./add-update-category-dialog.component.scss']
})
export class AddUpdateCategoryDialogComponent implements OnInit {
constructor(public dialogRef: MatDialogRef<AddUpdateCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:  string,
    private categoriesService: CategoryMappingService
  ) {
  }
  // DATA
  managementCategories: any[] = [];
  magentoCategories: any[] = [];

  // SELEZIONI
  selectedGestionale: any = null;
  selectedMagento: any = null;

  // SEARCH INPUT
  gestionaleSearch = '';
  magentoSearch = '';

  // DROPDOWN LIST
  filteredGestionale: any[] = [];
  filteredMagento: any[] = [];

  // MAPPINGS FINALI
  mappings: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  // MOCK DATA (sostituisci con API)
  loadData() {
    this.categoriesService.getManagementCategories(this.data!).subscribe((data)=>{
      this.managementCategories = data.map(x => ({
        key: x.key,
        label: `${x.category} | ${x.subCategory}`
      }));
    })

    this.categoriesService.getMagentoCategories(this.data!).subscribe((res)=>{
       this.magentoCategories = res;
    })
  }

  // 🔥 MOSTRA TUTTO AL FOCUS
  onGestionaleFocus() {
    this.filteredGestionale = this.managementCategories.slice(0, 50);
  }

  onMagentoFocus() {
    this.filteredMagento = this.magentoCategories.slice(0, 50);
  }

  // 🔍 SEARCH
  onGestionaleSearch(term: string) {
    if (!term) {
      this.filteredGestionale = this.managementCategories.slice(0, 50);
      return;
    }

    this.filteredGestionale = this.managementCategories
      .filter(x => x.label.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 50);
  }

  onMagentoSearch(term: string) {
    if (!term) {
      this.filteredMagento = this.magentoCategories.slice(0, 50);
      return;
    }

    this.filteredMagento = this.magentoCategories
      .filter(x => x.path.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 50);
  }

  // ✅ SELECT
  selectGestionale(cat: any) {
    this.selectedGestionale = cat;
    this.gestionaleSearch = cat.label;
    this.filteredGestionale = [];
  }

  selectMagento(cat: any) {
    this.selectedMagento = cat;
    this.magentoSearch = cat.path;
    this.filteredMagento = [];
  }

  // ➕ AGGIUNGI MAPPING
  addMapping() {
    if (!this.selectedGestionale || !this.selectedMagento) return;

    const exists = this.mappings.some(x =>
      x.gestionaleKey === this.selectedGestionale.key &&
      x.magentoCategoryId === this.selectedMagento.magentoCategoryId
    );

    if (exists) return;

    this.mappings.push({
      gestionaleKey: this.selectedGestionale.key,
      magentoCategoryId: this.selectedMagento.magentoCategoryId
    });

    // RESET
    this.selectedGestionale = null;
    this.selectedMagento = null;
    this.gestionaleSearch = '';
    this.magentoSearch = '';
  }

  // ❌ REMOVE
  removeMapping(index: number) {
    this.mappings.splice(index, 1);
  }

  // 🔍 HELPER
  getMagentoPath(id: number): string {
    return this.magentoCategories.find(x => x.magentoCategoryId === id)?.path || '';
  }

  getGestionaleLabel(key: string): string {
    return this.managementCategories.find(x => x.key === key)?.label || key;
  }

  // 💾 SAVE
  save() {
    const payload: CategoryMapping[] = this.mappings.map(m => {
      const magento = this.magentoCategories.find(x => x.magentoCategoryId === m.magentoCategoryId);

        return {
          customerId: this.data!,
          gestionaleKey: m.gestionaleKey,
          magentoCategoryId: m.magentoCategoryId,
          magentoPath: magento?.path || ''
        };
    });
     this.dialogRef.close(payload);
  }

  // 🔥 CLICK OUTSIDE → chiude dropdown
  @HostListener('document:click')
  onClickOutside() {
    this.filteredGestionale = [];
    this.filteredMagento = [];
  }

  // evita chiusura quando clicchi dentro
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}