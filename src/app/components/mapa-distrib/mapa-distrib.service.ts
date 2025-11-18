/**
 * Servicio que llama la API REST que devuelve las ubicaciones
 * de distribuidores sobresalientes activos.
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  getDistribuidores(): Observable<UbicacDistrib[]> {
    //return of(this.distribuidores); anterior

    return this.http.get<UbicacDistrib[]>(this.dataUrl);
  }

}
