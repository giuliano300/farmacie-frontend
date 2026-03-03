import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/Login';
import { administrator } from '../interfaces/administrator';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

    private apiUrl = API_URL + "Administrator";
    
    constructor(private http: HttpClient) {}

     // Metodo per ottenere l'amministratore
    login(login: Login): Observable<administrator> {
      let admin =  this.http.post<administrator>(this.apiUrl + "/Login", login);
      return admin;
    }

}
