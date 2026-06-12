import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { FlujoFiltros } from './../modelos/consdir-flujo.filtros';
import { FlujoResponse } from './../modelos/consdir-flujo.model';

@Injectable({
  providedIn: 'root'
})
export class ConsdirFlujoService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  GetConsdirFlujo(Filtros: FlujoFiltros): Observable<FlujoResponse> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set("Auth", this.sToken);

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    _filtros += '&FechaDesde=' + Filtros.FechaDesde;
    _filtros += '&FechaHasta=' + Filtros.FechaHasta;

    return this.http.get<FlujoResponse>(
      this.API_URL + this.API + 'reportes/ConsDirFlujo.php?' + _filtros,
      { headers: headers });
  }

}
