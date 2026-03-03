import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-customer-dialog',
  templateUrl: './detail-customer-dialog.component.html',
  styleUrls: ['./detail-customer-dialog.component.scss'],
  standalone:true,
  imports: [MatDialogModule]
})
export class DetailCustomerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DetailCustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private router: Router
    ) {
      console.log(data);
    }

  onCancel(): void {
    this.dialogRef.close(false); // L'utente ha annullato
  }  
  
  onUpdate(): void {
    this.router.navigate(['/customers/add', this.data.id]);
    this.dialogRef.close(false); 
  }
}
