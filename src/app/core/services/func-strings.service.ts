import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncStringsService {

  constructor() { }

  /**
   * Convierte una cadena en mayúsculas o minúsculas a algo aproximado a "Title Case", 
   * es decir, con la primera letra de cada palabra en mayúscula y el resto en minúscula.
   * @param str La cadena a convertir.
   * @returns La cadena convertida a "Title Case".
   */
  toTitleCase(str: string): string {
    return str.toLowerCase().split(' ').map(word => {
      if (word.length === 0) return word; // Maneja palabras vacías
      return word[0].toUpperCase() + word.slice(1);
    }).join(' ');
  }

}