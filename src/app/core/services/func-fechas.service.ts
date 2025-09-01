import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncFechasService {

  constructor() { }

  /**
   * Devuelve una string con la fecha de hoy en el formato aaaa-mm-dd
   * 
   * Uso esta rutina para utilizar la fecha local, en vez de la fecha
   * que se apega al horario UTC que, la cual es devuelta por otras 
   * funciones de js como: toISOString()
   */

  fechaHoy_aaaammdd(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoy.getDate().toString().padStart(2, '0');
    const fechaLocal = `${anio}-${mes}-${dia}`; // Siempre será la fecha local

    return fechaLocal;
  }
}
