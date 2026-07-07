import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { batchStatusResponse } from '../interfaces/batchStatusResponse';
import { CompleteBatchesItem } from '../interfaces/CompleteBatchesItem';
import { PagedResult } from '../interfaces/PagedResult';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {

    private apiUrl = API_URL + "admin/batches";
    private apiUrlHistory = API_URL + "batches-report";
    
    constructor(private http: HttpClient) {}

    create(customerId: string, type?: number):Observable<string>{
      return this.http.post<string>(this.apiUrl + "/create?customerId=" + customerId + "&type=" + type, null);
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

    history(customerId: string, pageIndex: number, pageSize: number):Observable<PagedResult<CompleteBatchesItem>>{
      return this.http.get<PagedResult<CompleteBatchesItem>>(
        this.apiUrlHistory + "/history?customerId=" + customerId + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize
      );
    }

    today():Observable<CompleteBatchesItem[]>{
      return this.http.get<CompleteBatchesItem[]>(this.apiUrlHistory + "/today");
    }

    delete(id: string):Observable<boolean>{
      return this.http.delete<boolean>(this.apiUrlHistory + "/" + id);
    }

}
