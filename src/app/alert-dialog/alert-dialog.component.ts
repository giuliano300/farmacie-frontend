import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css'],
  standalone:true,
  imports: [MatDialogModule]
})
export class AlertDialogComponent {
  
  title: string = "Attenzione";
  description: String = "";

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:  any
  ) {
    if(data)
    {
      this.title = data.title;
      this.description = data.description
    }
  }


  onCancel(): void {
    this.dialogRef.close(false); // L'utente ha annullato
  }
}
