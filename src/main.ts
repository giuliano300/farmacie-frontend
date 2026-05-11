import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


// Definisci l'URL globale dell'API
export const API_URL = 'https://api.plumasync.it/api/';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideAuth(() => getAuth()), provideAnimationsAsync()
  ]
}).catch(err => console.error(err));