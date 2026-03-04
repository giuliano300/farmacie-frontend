import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { customers } from '../interfaces/customer';
import { Observable } from 'rxjs';
import { customerWithBatchStatus } from '../interfaces/customerWithBatchStatus';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

    private apiUrl = API_URL + "admin/customers";
    
    constructor(private http: HttpClient) {}

     getCustomer(id?: string): Observable<customerWithBatchStatus> {
      return this.http.get<customerWithBatchStatus>(this.apiUrl + "/" + id);
    }

    getCustomers(): Observable<customerWithBatchStatus[]> {
      return this.http.get<customerWithBatchStatus[]>(this.apiUrl);
    }

    delete(id: string):Observable<boolean>{
      return this.http.delete<boolean>(this.apiUrl + "/" + id);
    }
  
    setCustomer(c: customers):Observable<customers>{
      return this.http.post<customers>(this.apiUrl, c);
    }

    updateCustomer(c: customers):Observable<boolean>{
      return this.http.put<boolean>(this.apiUrl + "/" + c.id, c);
    }

}
