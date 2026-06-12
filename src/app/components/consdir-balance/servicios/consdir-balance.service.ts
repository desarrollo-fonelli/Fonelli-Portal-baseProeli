import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { BalanceFiltros } from './../modelos/consdir-balance.filtros';
import { BalanceResponse } from './../modelos/consdir-balance.model';

@Injectable({
  providedIn: 'root'
})
export class ConsdirBalanceService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  GetConsdirBalance(Filtros: BalanceFiltros): Observable<BalanceResponse> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set("Auth", this.sToken);

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    _filtros += '&FechaCorte=' + Filtros.FechaCorte;
    _filtros += '&TipoCambioMN=' + Filtros.TipoCambioMN;
    _filtros += '&TipoCambioUSD=' + Filtros.TipoCambioUSD;
    _filtros += '&TipoCambioORO=' + Filtros.TipoCambioORO;
    _filtros += '&TipoCambioPLATA=' + Filtros.TipoCambioPLATA;

    return this.http.get<BalanceResponse>(
      this.API_URL + this.API + 'reportes/ConsDirBalance.php?' + _filtros,
      { headers: headers });
  }
}
