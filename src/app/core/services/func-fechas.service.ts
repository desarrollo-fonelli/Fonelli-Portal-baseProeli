import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncFechasService {

  constructor() { }

  /** --------------------------------------------------------------------------
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

  /** --------------------------------------------------------------------------
  * Devuelve la fecha de ayer en formato YYYY-MM-DD
  * Uso esta rutina para utilizar la fecha local, en vez de la fecha
  * que se apega al horario UTC que, la cual es devuelta por otras 
  * funciones de js como: toISOString()
  */
  obtenerFechaAyer(): string {

    const fecha = new Date();

    // Restar un día
    fecha.setDate(fecha.getDate() - 1);

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /** --------------------------------------------------------------------------
   * Devuelve el primer día del mes de la fecha recibida.
   * @param fecha Fecha base
   * @returns string con el primer día del mes en formato aaaa-mm-dd
   */
  obtenerPrimerDiaMes(fecha: Date): string {

    const primerDia = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      1
    );

    const year = primerDia.getFullYear();
    const month = String(primerDia.getMonth() + 1).padStart(2, '0');
    const day = String(primerDia.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

}

