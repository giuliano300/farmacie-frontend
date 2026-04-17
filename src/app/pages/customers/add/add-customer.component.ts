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
import { CustomersService } from '../../../services/customers.service';
import { customers } from '../../../interfaces/customer';
import { customerWithBatchStatus } from '../../../interfaces/customerWithBatchStatus';


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
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
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
export class AddCustomerComponent {
  title: string = "Aggiungi cliente";

  customers: customers[] = [];

  customerForm: FormGroup;

  id: string | null = null;

  constructor(
      private router: Router,
      private customerService: CustomersService,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private adapter: DateAdapter<any>,
  ) 
  {
    this.adapter.setLocale('it-IT');
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      magentoStoreCode: ['', [Validators.required]],
      baseUrl: ['', [Validators.required]],
      token: ['', [Validators.required]],
      heronFtp: ['', [Validators.required]],
      heronFtpFolder: ['', [Validators.required]],
      heronUsername: ['', [Validators.required]],
      heronPassword: ['', [Validators.required]],
      ftpHost: ['', [Validators.required]],
      ftpUser: ['', [Validators.required]],
      ftpPassword: ['', [Validators.required]],
      ftpImportPath: ['', [Validators.required]],
      magentoRootPath: ['', [Validators.required]],
      active: ['', [Validators.required]],
      msi: ['', [Validators.required]],
      id: ['']
    });

  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');

      if (this.id) {
        this.title = "Aggiorna cliente";

        this.customerService.getCustomer(this.id)
          .subscribe((data: customerWithBatchStatus) => {
            this.customerForm.patchValue({
              name: data.customer.name,
              magentoStoreCode: data.customer.magentoStoreCode,
              msi: data.customer.msi,
              heronFtp: data.customer.heronFtp,
              heronFtpFolder: data.customer.heronFtpFolder,
              heronUsername: data.customer.heronUsername,
              heronPassword: data.customer.heronPassword,
              baseUrl: data.customer.magento.baseUrl,
              token: data.customer.magento.token,
              ftpHost: data.customer.magento.ftpHost,
              ftpUser: data.customer.magento.ftpUser,
              ftpPassword: data.customer.magento.ftpPassword,
              ftpImportPath: data.customer.magento.ftpImportPath,
              magentoRootPath: data.customer.magento.magentoRootPath,
              active: data.customer.active,
              id: this.id,
            });
          });
      }
    });

  }

  returnBack(){
    this.router.navigate(["/customers"]);
  }

  
  onSubmit() {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;

      const w: customers = {
        id: '',
        code: formValue.magentoStoreCode,
        name: formValue.name,
        magentoStoreCode: formValue.magentoStoreCode,
        heronFolder: formValue.magentoStoreCode,
        heronFtpFolder: formValue.heronFtpFolder,
        heronFtp: formValue.heronFtp,
        heronUsername: formValue.heronUsername,
        heronPassword: formValue.heronPassword,
        active: formValue.active ?? true,
        msi: formValue.msi ?? true,
        createdAt: new Date(),
        magento: {
          baseUrl: formValue.baseUrl,
          token: formValue.token,
          ftpHost: formValue.ftpHost,
          ftpUser: formValue.ftpUser,
          ftpPassword: formValue.ftpPassword,
          ftpImportPath: formValue.ftpImportPath,
          magentoRootPath: formValue.magentoRootPath,
          cronDelayMilliseconds: 20000,
          websiteId: 1,
          attributeSetId: 4
        }
      };

      console.log(w);

      if(this.id)
      {
        w.id = this.id;
        this.customerService.updateCustomer(w)
        .subscribe((data: boolean) => {
          if(data)
            this.router.navigate(["/customers"]);
          else
            console.log("errore");
        })
      }
      else
      {
        this.customerService.setCustomer(w)
        .subscribe((data: customers) => {
          if(data)
            this.router.navigate(["/customers"]);
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
