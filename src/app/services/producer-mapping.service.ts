import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProducerMapping } from '../interfaces/producer-mapping';
import { API_URL } from '../../main';

@Injectable({
  providedIn: 'root'
})
export class ProducerMappingService  {

    private apiUrl = API_URL + "Producer-mappings";
    
    constructor(private http: HttpClient) {}

    getAll(customerId: string): Observable<ProducerMapping[]>{
      return this.http.get<ProducerMapping[]>(this.apiUrl + "?customerId=" + customerId);
    }

    getById(id: string): Observable<ProducerMapping> {
      return this.http.get<ProducerMapping>(`${this.apiUrl}/${id}`);
    }

    create(producer: ProducerMapping): Observable<ProducerMapping> {
      return this.http.post<ProducerMapping>(this.apiUrl, producer);
    }

    update(id: string, producer: ProducerMapping): Observable<boolean> {
      return this.http.put<boolean>(`${this.apiUrl}/${id}`, producer);
    }

    delete(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    }

}
