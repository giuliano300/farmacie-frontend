import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryMapping } from '../interfaces/category-mapping';
import { API_URL } from '../../main';

@Injectable({
  providedIn: 'root'
})
export class CategoryMappingService  {

    private apiUrl = API_URL + "category-mappings";
    
    constructor(private http: HttpClient) {}

    getAll(customerId: string): Observable<CategoryMapping[]>{
      return this.http.get<CategoryMapping[]>(this.apiUrl + "?customerId=" + customerId);
    }

    getById(id: string): Observable<CategoryMapping> {
      return this.http.get<CategoryMapping>(`${this.apiUrl}/${id}`);
    }

    create(category: CategoryMapping): Observable<CategoryMapping> {
      return this.http.post<CategoryMapping>(this.apiUrl, category);
    }

    update(id: string, category: CategoryMapping): Observable<boolean> {
      return this.http.put<boolean>(`${this.apiUrl}/${id}`, category);
    }

    delete(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    }

}
