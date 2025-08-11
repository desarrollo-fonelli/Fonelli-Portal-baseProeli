import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { IndicVentaFiltros } from './../modelos/indic-venta.filtros';
import { IndicVentaResponse } from './../modelos/indic-venta';

@Injectable({
  providedIn: 'root'
})
export class IndicVentaService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  CreaIndicadores(Filtros: IndicVentaFiltros): Observable<IndicVentaResponse> {
    let headers = new HttpHeaders().set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    _filtros += '&AgenteDesde=' + Filtros.AgenteDesde;
    _filtros += '&AgenteHasta=' + Filtros.AgenteHasta;
    _filtros += '&FechaCorte=' + Filtros.FechaCorte;

    return this._http.get<IndicVentaResponse>(
      this.API_URL + this.API + 'reportes/IndicadVenta2025.php?' + _filtros,
      { headers: headers });
  }
}
