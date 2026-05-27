import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MagentoService {

    private apiUrl = API_URL + "Magento";
    
    constructor(private http: HttpClient) {}

    massiveImport(batchId: string){
      return this.http.get(this.apiUrl + "?batchId=" + batchId);
    }

    updateStockBulk(batchId: string){
      return this.http.get(this.apiUrl + "/updateStockBulk?batchId=" + batchId);
    }

    deleteProducts(customerId: string): Observable<boolean>{
      return this.http.get<boolean>(this.apiUrl + "/DeleteProducts?customerId=" + customerId);
    }

    updateImageBulk(batchId: string){
      return this.http.get(this.apiUrl + "/updateImageBulk?batchId=" + batchId);
    }

    finalizeBatchAsync(batchId: string){
      return this.http.get(this.apiUrl + "/finalizeBatchAsync?batchId=" + batchId);
    }

}
