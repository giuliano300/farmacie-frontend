import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './pages/home/home.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { AddCustomerComponent } from './pages/customers/add/add-customer.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { AddSupplierComponent } from './pages/suppliers/add/add-supplier.component';
import { ProducersComponent } from './pages/customers/producer/producers.component';
import { CategoriesComponent } from './pages/customers/categories/categories.component';

export const routes: Routes = [
    { path: '', redirectTo : '/authentication', pathMatch: 'full' },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent}
        ]
    },
    {path: 'home', component: HomeComponent},
    {path: 'customers/add', component: AddCustomerComponent},
    {path: 'customers/add/:id', component: AddCustomerComponent},
    {path: 'customers', component: CustomersComponent},
    {path: 'suppliers/add', component: AddSupplierComponent},
    {path: 'suppliers/add/:id', component: AddSupplierComponent},
    {path: 'suppliers', component: SuppliersComponent},
    {path: 'customer/categories/:id', component: CategoriesComponent},
    {path: 'customer/producers/:id', component: ProducersComponent},
    { path: '**', component:NotFoundComponent}
];
