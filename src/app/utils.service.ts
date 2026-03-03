import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

    // Funzione per capitalizzare una stringa
    capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
    // Altre funzioni generiche
    calculateSum(a: number, b: number): number {
      return a + b;
    }

    getEntries(obj: { [key: string]: string }): [string, string][] {
      return Object.entries(obj);
    }
}
