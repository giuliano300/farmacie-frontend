import { Injectable } from '@angular/core';
import { DashboardResponse } from '../interfaces/Dashboard';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private apiUrl = API_URL + "dashboard";
    
    constructor(private http: HttpClient) {}
    
    getDashboard() {
        return this.http.get<DashboardResponse>(this.apiUrl + '');
    }
}