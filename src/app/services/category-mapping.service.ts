import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryMapping } from '../interfaces/category-mapping';
import { API_URL } from '../../main';
import { CustomerMagentoCategory } from '../interfaces/CustomerMagentoCategory';
import { CustomerManagementCategory } from './CustomerManagementCategory';

@Injectable({
  providedIn: 'root'
})
export class CategoryMappingService  {

    private apiUrl = API_URL + "category-mappings";
    
    constructor(private http: HttpClient) {}

    getAll(customerId: string): Observable<CategoryMapping[]>{
      return this.http.get<CategoryMapping[]>(this.apiUrl + "?customerId=" + customerId);
    }

    getMagentoCategories(customerId: string): Observable<CustomerMagentoCategory[]>{
      return this.http.get<CustomerMagentoCategory[]>(this.apiUrl + "/GetMagentoCategories?customerId=" + customerId);
    }

    getManagementCategories(customerId: string): Observable<CustomerManagementCategory[]>{
      return this.http.get<CustomerManagementCategory []>(this.apiUrl + "/GetManagementCategories?customerId=" + customerId);
    }

    getById(id: string): Observable<CategoryMapping> {
      return this.http.get<CategoryMapping>(`${this.apiUrl}/${id}`);
    }

    SetMagentoManagementCategories(customerId: string): Observable<CustomerMagentoCategory[]> {
      return this.http.get<CustomerMagentoCategory[]>(`${this.apiUrl}/SetMagentoManagementCategories?customerId=${customerId}`);
    }

    create(category: CategoryMapping): Observable<CategoryMapping> {
      return this.http.post<CategoryMapping>(this.apiUrl, category);
    }

    setMultipleMapping(customerId: string, category: CategoryMapping[]): Observable<CategoryMapping[]> {
      return this.http.post<CategoryMapping[]>(this.apiUrl + "/SetMultipleMapping?customerId=" + customerId, category);
    }

    update(id: string, category: CategoryMapping): Observable<boolean> {
      return this.http.put<boolean>(`${this.apiUrl}/${id}`, category);
    }

    delete(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    }

}
