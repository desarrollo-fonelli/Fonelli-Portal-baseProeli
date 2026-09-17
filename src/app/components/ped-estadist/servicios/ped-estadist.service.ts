import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { PedEstadistFiltros } from './../modelos/ped-estadist.filtros';
import { PedEstadistResponse } from './../modelos/ped-estadist.response';

@Injectable({
  providedIn: 'root'
})
export class PedEstadistService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  GetPedEstadist(Filtros: PedEstadistFiltros): Observable<PedEstadistResponse> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set("Auth", this.sToken);

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    _filtros += '&FechaDesde=' + Filtros.FechaDesde;
    _filtros += '&FechaHasta=' + Filtros.FechaHasta;
    _filtros += '&OficinaDesde=' + Filtros.OficinaDesde;
    _filtros += '&OficinaHasta=' + Filtros.OficinaHasta;
    _filtros += '&ClienteDesde=' + Filtros.ClienteDesde;
    _filtros += '&FilialDesde=' + Filtros.FilialDesde;
    _filtros += '&ClienteHasta=' + Filtros.ClienteHasta;
    _filtros += '&FilialHasta=' + Filtros.FilialHasta;
    _filtros += '&LineaDesde=' + Filtros.LineaDesde;
    _filtros += '&LineaHasta=' + Filtros.LineaHasta;
    _filtros += '&ClaveDesde=' + Filtros.ClaveDesde;
    _filtros += '&ClaveHasta=' + Filtros.ClaveHasta;
    _filtros += '&TipoPedDesde=' + Filtros.TipoPedDesde;
    _filtros += '&TipoPedHasta=' + Filtros.TipoPedHasta;
    _filtros += '&InternoExterno=' + Filtros.InternoExterno;

    return this.http.get<PedEstadistResponse>(
      this.API_URL + this.API + 'reportes/EstadisticaPedidos.php?' + _filtros,
      { headers: headers });
  }

}
