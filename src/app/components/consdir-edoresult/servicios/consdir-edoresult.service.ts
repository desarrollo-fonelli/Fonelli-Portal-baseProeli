import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { EdoResultFiltros } from './../modelos/consdir-edoresult.filtros';
import { EdoResultResponse } from './../modelos/consdir-edoresult.model';

@Injectable({
  providedIn: 'root'
})
export class ConsdirEdoresultService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  GetConsdirEdoResult(Filtros: EdoResultFiltros): Observable<EdoResultResponse> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set("Auth", this.sToken);

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    _filtros += '&FechaDesde=' + Filtros.FechaDesde;
    _filtros += '&FechaHasta=' + Filtros.FechaHasta;

    return this.http.get<EdoResultResponse>(
      this.API_URL + this.API + 'reportes/ConsDirEdoResult.php?' + _filtros,
      { headers: headers });
  }
}
