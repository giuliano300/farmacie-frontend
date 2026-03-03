import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { administrator } from '../interfaces/administrator';
import { AdministratorService } from './administrator.service';

@Injectable({
  providedIn: 'root',
})
export class AuthAdminService {
  private adminSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public admin$: Observable<any> = this.adminSubject.asObservable(); // Observable che i componenti possono sottoscrivere

  constructor(private router: Router, private sessionService: SessionService, private adminService: AdministratorService) {
    // Recupera l'utente dal sessionStorage se presente
    const storedAdmin = sessionStorage.getItem('admin');
    if (storedAdmin) {
      this.adminSubject.next(JSON.parse(storedAdmin)); // Invia i dati admin iniziali
    }
  }

  login(admin: administrator): void {
    this.sessionService.saveAdmin(admin); 
    this.adminSubject.next(admin); // Notifica ai sottoscrittori che admin è loggato
  }

  logout(): void {
    this.sessionService.clearAdmin();
    this.adminSubject.next(null);
  }
}
