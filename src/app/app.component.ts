import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ToggleService } from './common/header/toggle.service';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'oktariffa-frontend';

  constructor(public router: Router,  public toggleService: ToggleService, private sessionService: SessionService) {}
  
    routerSubscription: any;
    location: any;

   // Toggle Service
   isToggled = false;

   // Dark Mode
   toggleTheme() {
       this.toggleService.toggleTheme();
   }

   // Settings Button Toggle
   toggle() {
       this.toggleService.toggle();
   }

   // ngOnInit
   ngOnInit(){
     if (!this.sessionService.getAdmin()) {
         this.router.navigate(['/authentication']);
     }
   }
}
