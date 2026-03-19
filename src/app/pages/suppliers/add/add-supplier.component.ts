import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { ActivatedRoute, Router } from '@angular/router';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, LOCALE_ID } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { animate, style, transition, trigger } from '@angular/animations';
import { SuppliersService } from '../../../services/suppliers.service';
import { suppliers } from '../../../interfaces/supplier';


@Component({
  selector: 'app-add-customer',
  imports: [MatIconModule,
    MatButtonModule,
    ReactiveFormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    FeathericonsModule, 
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './add-supplier.component.html',
  styleUrl: './add-supplier.component.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'it-IT' },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' }
  ],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AddSupplierComponent {
  title: string = "Aggiungi fornitore";

  suppliers: suppliers[] = [];

  customerForm: FormGroup;

  id: string | null = null;

  constructor(
      private router: Router,
      private supplierservice: SuppliersService,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private adapter: DateAdapter<any>,
  ) 
  {
    this.adapter.setLocale('it-IT');
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required]],
      ftpHost: ['', [Validators.required]],
      ftpUser: ['', [Validators.required]],
      ftpPassword: ['', [Validators.required]],
      active: ['', [Validators.required]],
      id: ['']
    });

  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');

      if (this.id) {
        this.title = "Aggiorna fornitore";

        this.supplierservice.getSupplier(this.id)
          .subscribe((data: suppliers) => {
            this.customerForm.patchValue({
              name: data.name,
              code: data.code,
              active: data.active,
              ftpHost: data.ftpHost,
              ftpUser: data.ftpUser,
              ftpPassword: data.ftpPassword,
              id: this.id,
            });
          });
      }
    });

  }

  returnBack(){
    this.router.navigate(["/suppliers"]);
  }

  
  onSubmit() {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;

      const w: suppliers = {
        id: '',
        code: formValue.code,
        name: formValue.name,
        ftpHost: formValue.ftpHost,
        ftpUser: formValue.ftpUser,
        ftpPassword: formValue.ftpPassword,
        remoteFile: formValue.code,
        priority: 1,
        active: formValue.active
      };

      //console.log(w);

      if(this.id)
      {
        w.id = this.id;
        this.supplierservice.updateSupplier(w)
        .subscribe((data: boolean) => {
          if(data)
            this.router.navigate(["/suppliers"]);
          else
            console.log("errore");
        })
      }
      else
      {
        this.supplierservice.setSupplier(w)
        .subscribe((data: suppliers) => {
          if(data)
            this.router.navigate(["/suppliers"]);
          else
            console.log("errore");
        })
      }
    } 
    else 
    {
      console.warn('Form non valido');
    }
  }
}
