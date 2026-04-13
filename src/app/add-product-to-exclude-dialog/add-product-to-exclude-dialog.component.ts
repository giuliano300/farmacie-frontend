import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductToExcludeService } from '../services/product-to-exclude.service';

@Component({
  selector: 'add-product-to-exclude-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product-to-exclude-dialog.component.html',
  styleUrls: ['./add-product-to-exclude-dialog.component.scss']
})
export class AddProductToExcludeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddProductToExcludeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private service: ProductToExcludeService
  ) {}

  // DATA
  productName: string | null = '';
  aic: string | null = '';

  mappings: any[] = [];


  ngOnInit(): void {
  }

  // ADD
  addMapping() {
    if (!this.productName || !this.aic) return;

    const exists = this.mappings.some(x =>
      x.productName === this.productName &&
      x.aic === this.aic
    );

    if (exists) return;

    this.mappings.push({
      productName: this.productName,
      aic: this.aic
    });

    this.reset();
  }

  reset() {
    this.productName = null;
    this.aic = null;
  }

  // REMOVE
  removeMapping(index: number) {
    this.mappings.splice(index, 1);
  }

  // SAVE
  save() {
    const payload = this.mappings.map(m => ({ productName: m.productName, aic: m.aic, customerId: this.data, id: '' }));
    this.dialogRef.close(payload);
  }

  // CLICK OUTSIDE
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}