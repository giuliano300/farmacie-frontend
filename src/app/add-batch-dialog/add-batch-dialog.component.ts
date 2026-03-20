import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardContent, MatCard } from "@angular/material/card";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { FeathericonsModule } from "../icons/feathericons/feathericons.module";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CustomersService } from '../services/customers.service';
import { customerWithBatchStatus } from '../interfaces/customerWithBatchStatus';
import { MatOption, MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-batch-dialog',
  templateUrl: './add-batch-dialog.component.html',
  styleUrls: ['./add-batch-dialog.component.scss'],
  standalone:true,
  imports: [
    MatDialogModule,
    MatCardContent,
    MatCard,
    MatFormField,
    MatFormFieldModule,
    FeathericonsModule,
    MatInputModule,
    MatIconModule,
    MatLabel,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule
]
})
export class AddBatchDialogComponent {
  
  title: string = "Crea nuovo batch";

  categoryForm: FormGroup;
  customers: customerWithBatchStatus[] = []

  constructor(public dialogRef: MatDialogRef<AddBatchDialogComponent>,
    private customersService: CustomersService, 
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      customerId: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  

  ngOnInit(): void {
      this.customersService.getCustomers().subscribe((data: customerWithBatchStatus[]) => {
        this.customers = data;
      });
  }

  onSave() {
    if (this.categoryForm.valid) {
      const result: any = {
        ...this.categoryForm.value
      };
      this.dialogRef.close(result);
    }
  }

  onClose(): void {
    this.dialogRef.close(false); // L'utente ha annullato
  }
}
