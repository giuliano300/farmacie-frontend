import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { batchStatusResponse } from '../interfaces/batchStatusResponse';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {

    private apiUrl = API_URL + "admin/batches";
    
    constructor(private http: HttpClient) {}

    create(customerId: string):Observable<string>{
      return this.http.post<string>(this.apiUrl + "/create?customerId=" + customerId, null);
    }

    start(batchId: string):Observable<string>{
      return this.http.post<string>(this.apiUrl + "/" + batchId + "/start", null);
    }

    restart(batchId: string, stepId: string):Observable<string>{
      return this.http.post<string>(this.apiUrl + "/" + batchId + "/" + stepId + "/restart", null);
    }

    status(customerId: string):Observable<batchStatusResponse>{
      return this.http.post<batchStatusResponse>(this.apiUrl + "/status/" + customerId, null);
    }

}
