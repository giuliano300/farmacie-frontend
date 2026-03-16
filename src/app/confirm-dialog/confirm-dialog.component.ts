import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  standalone:true,
  imports: [MatDialogModule]
})
export class ConfirmDialogComponent {
  title: string = "CONFERMA ELIMINAZIONE";
  description: string = "Sei sicuro di voler eliminare questo elemento?";
  btnDeleteText: string = "Elimina";
  chiudi: string = "Chiudi";
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:  any
  ) {
    if(data)
    {
      if(data.title)
        this.title = data.title;
      if(data.description)
        this.description = data.description;
      if(data.btnDeleteText)
        this.btnDeleteText = data.btnDeleteText;
      if(data.chiudi)
        this.chiudi = data.chiudi;
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true); // L'utente ha confermato
  }

  onCancel(): void {
    this.dialogRef.close(false); // L'utente ha annullato
  }
}
