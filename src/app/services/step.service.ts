import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { runStepRequest } from "../interfaces/runStepRequest";

@Injectable({
  providedIn: 'root'
})
export class StepService {

    private apiUrl = API_URL + "admin/steps";
    
    constructor(private http: HttpClient) {}

    run(runStepRequest: runStepRequest){
      return this.http.post(this.apiUrl + "/run-pipeline", runStepRequest);
    }

    retry(runStepRequest: runStepRequest){
      return this.http.post<string>(this.apiUrl + "/retry", runStepRequest);
    }

}
