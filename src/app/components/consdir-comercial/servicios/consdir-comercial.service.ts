import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { ConsdirComercialFiltros } from './../modelos/consdir-comercial.filtros';
import { ConsdirComercialResponse } from './../modelos/consdir-comercial.model';

@Injectable({
  providedIn: 'root'
})
export class ConsdirComercialService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  GetConsdirComercial(Filtros: ConsdirComercialFiltros): Observable<ConsdirComercialResponse> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set("Auth", this.sToken);

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    _filtros += '&FechaDesde=' + Filtros.FechaDesde;
    _filtros += '&FechaHasta=' + Filtros.FechaHasta;

    return this._http.get<ConsdirComercialResponse>(
      this.API_URL + this.API + 'reportes/ConsDirComercial.php?' + _filtros,
      { headers: headers });
  }
}
