import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { suppliers } from '../interfaces/supplier';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

    private apiUrl = API_URL + "admin/suppliers";
    
    constructor(private http: HttpClient) {}

     getSupplier (id?: string): Observable<suppliers> {
      return this.http.get<suppliers>(this.apiUrl + "/" + id);
    }

    getSuppliers(): Observable<suppliers[]> {
      return this.http.get<suppliers[]>(this.apiUrl);
    }

    delete(id: string):Observable<boolean>{
      return this.http.delete<boolean>(this.apiUrl + "/" + id);
    }
  
    setSupplier(c: suppliers):Observable<suppliers>{
      return this.http.post<suppliers>(this.apiUrl, c);
    }

    updateSupplier(c: suppliers):Observable<boolean>{
      return this.http.put<boolean>(this.apiUrl + "/" + c.id, c);
    }

    sync(c: suppliers):Observable<boolean>{
      return this.http.get<boolean>(this.apiUrl + "/sync?code=" + c.code);
    }

}
