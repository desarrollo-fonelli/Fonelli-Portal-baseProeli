/**
 * Servicio que llama la API REST que devuelve las ubicaciones
 * de distribuidores sobresalientes activos.
 */
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

import { UbicacDistrib } from './mapa-distrib.modelos';

@Injectable({
  providedIn: 'root'
})
export class MapaDistribService {

  // constructor(private http: HttpClient) { }
  // // Propuesta para obtener los datos de una API REST real
  // getDistribuidoresFromApi(): Observable<Distribuidor[]> {
  // const url = 'miapi/ubicaciones.php';
  // return this.http.get<Distribuidor[]>(url);

  //private distribuidores: UbicacDistrib[] = [];     aqui iban los datos JSON que pasé al archivo distribuidores.json
  private dataUrl = 'assets/data/distribuidores.json';

  constructor(private http: HttpClient) { }

  /***
   * Obtiene la lista de distribuidores sobresalientes activos.
   * @return Observable con el array de distribuidores.
   * 
   * Se añade un parámetro de timestamp a la URL para evitar
   * problemas de caché del navegador.
   */
  getDistribuidores(): Observable<UbicacDistrib[]> {
    //return of(this.distribuidores); anterior

    // 1. Creamos un timestamp actual. Ej: 167889923123
    const timestamp = new Date().getTime().toString();

    // 2. Configuramos los parámetros de la petición HTTP
    // Esto generará una URL tipo: assets/data/distribuidores.json?v=167889923123
    const params = new HttpParams().set('v', timestamp);

    //return this.http.get<UbicacDistrib[]>(this.dataUrl);

    return this.http.get<UbicacDistrib[]>(this.dataUrl, { params }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        console.error('Error al obtener los distribuidores:', error);
        return throwError(() => new Error('Error obteniendo datos de ubicación.'));
      })
    );

  }

}
