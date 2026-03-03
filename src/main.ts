import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const firebaseConfig = {
  apiKey: "AIzaSyCl8x88d0Zawh6Z48XP0mr0dgiyZxyHO3E",
  authDomain: "oktariffa.firebaseapp.com",
  projectId: "oktariffa",
  storageBucket: "oktariffa.firebasestorage.app",
  messagingSenderId: "180384875258",
  appId: "1:180384875258:web:667c1636cac4940c22ff43",
  measurementId: "G-1WHYMPGW9P"
};

// Definisci l'URL globale dell'API
export const API_URL = 'http://localhost:5273/api/';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()), provideAnimationsAsync()
  ]
}).catch(err => console.error(err));