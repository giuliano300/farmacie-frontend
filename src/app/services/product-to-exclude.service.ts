import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../main';
import { ProductToExclude } from '../interfaces/Product-to-exclude';

@Injectable({
  providedIn: 'root'
})
export class ProductToExcludeService  {

    private apiUrl = API_URL + "product-to-exclude";
    
    constructor(private http: HttpClient) {}

    getAll(customerId: string): Observable<ProductToExclude[]>{
      return this.http.get<ProductToExclude[]>(this.apiUrl + "?customerId=" + customerId);
    }

    getById(id: string): Observable<ProductToExclude> {
      return this.http.get<ProductToExclude>(`${this.apiUrl}/${id}`);
    }

    create(p: ProductToExclude): Observable<ProductToExclude> {
      return this.http.post<ProductToExclude>(this.apiUrl, p);
    }

    setMultiple(p: ProductToExclude[]): Observable<ProductToExclude[]> {
      return this.http.post<ProductToExclude[]>(this.apiUrl + "/SetMultiple", p);
    }

    update(id: string, p: ProductToExclude): Observable<boolean> {
      return this.http.put<boolean>(`${this.apiUrl}/${id}`, p);
    }

    delete(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    }

}
