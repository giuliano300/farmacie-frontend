import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardContent, MatCard } from "@angular/material/card";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { FeathericonsModule } from "../icons/feathericons/feathericons.module";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CategoryMapping } from '../interfaces/category-mapping';
import { ProducerMapping } from '../interfaces/producer-mapping';

@Component({
  selector: 'app-add-update-producer-dialog',
  templateUrl: './add-update-producer-dialog.component.html',
  styleUrls: ['./add-update-producer-dialog.component.scss'],
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
    ReactiveFormsModule]
})
export class AddUpdateProducerDialogComponent {
  
  title: string = "Aggiungi produttore";

  categoryForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddUpdateProducerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:  ProducerMapping,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      sourceProducer: ['', Validators.required],
      targetProducer: ['', Validators.required],
    });
  }

  

  ngOnInit(): void {
    if(this.data){
      this.title = "Modifica produttore";
      this.categoryForm.patchValue({
        sourceProducer: this.data.sourceProducer,
        targetProducer: this.data.targetProducer
      });
    }
  }

  onSave() {
    if (this.categoryForm.valid) {
      const result: CategoryMapping = {
        ...this.categoryForm.value
      };
      this.dialogRef.close(result);
    }
  }

  onClose(): void {
    this.dialogRef.close(false); // L'utente ha annullato
  }
}
