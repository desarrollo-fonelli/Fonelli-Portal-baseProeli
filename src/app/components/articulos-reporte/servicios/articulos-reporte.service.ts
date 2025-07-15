import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { FiltrosArticulosReporte } from '../modelos/articulos-reporte.filtros';

@Injectable({
  providedIn: 'root'
})
export class ArticulosReporteService {
  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  Get(FiltrosReporte: FiltrosArticulosReporte): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    let sFiltros = '';

    sFiltros += '&TipoUsuario=' + FiltrosReporte.TipoUsuario;
    sFiltros += '&Usuario=' + FiltrosReporte.Usuario;
    sFiltros += '&LineaPTDesde=' + FiltrosReporte.LineaPTDesde;
    sFiltros += '&LineaPTHasta=' + FiltrosReporte.LineaPTHasta;
    sFiltros += '&ClienteCodigo=' + FiltrosReporte.ClienteCodigo;
    sFiltros += '&ClienteFilial=' + FiltrosReporte.ClienteFilial;
    if (FiltrosReporte.ItemCode) {
      sFiltros += '&ItemCode=' + FiltrosReporte.ItemCode;
    }
    sFiltros += '&Status=' + FiltrosReporte.Status;

    if (FiltrosReporte.BuscarSemejantes) {
      sFiltros += '&BuscarSemejantes=S';
    } else {
      sFiltros += '&BuscarSemejantes=N';
    }

    return this._http.get(this.API_URL + this.API + 'reportes/ArticulosLista.php?' +
      sFiltros, { headers: headers }
    )
  }
}
