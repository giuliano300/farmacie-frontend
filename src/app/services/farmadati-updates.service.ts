import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FarmadatiUpdates } from '../interfaces/farmadati-updates';

@Injectable({
  providedIn: 'root'
})
export class FarmadatiUpdatesService {

    private apiUrl = API_URL + "farmadati-updates";
    
    constructor(private http: HttpClient) {}

    get():Observable<FarmadatiUpdates[]>{
      return this.http.get<FarmadatiUpdates[]>(this.apiUrl);
    }

    create(farmadatiUpdates: FarmadatiUpdates){
      return this.http.post(this.apiUrl, farmadatiUpdates);
    }

    delete(id: string):Observable<boolean>{
      return this.http.delete<boolean>(this.apiUrl + "/" + id);
    }

}
