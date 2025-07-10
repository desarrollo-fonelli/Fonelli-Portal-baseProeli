import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracion } from 'src/app/models/configuraciones';
import { environment } from 'src/environments/environment';
import { CotzClteFiltros, CotzClteResponse } from '../modelos/cotizac-cliente';

@Injectable({
  providedIn: 'root'
})
export class CotizacClienteService {

  public API: string;
  public API_URL: string;
  public sToken: string;
  public sFiltros: string;

  constructor(
    public _http: HttpClient
  ) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sFiltros = '';
    this.sToken = '';
  }

  getCliente(filtrosClte: any): Observable<any> {

    this.sFiltros = '';
    this.sToken = sessionStorage.getItem('token');

    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      .set('Access-Control-Allow-Methods', 'GET')
      .set('Auth', this.sToken)
      .set('Access-Control-Allow-Credentials', 'true');

    if (filtrosClte.TipoUsuario) {
      this.sFiltros += '&TipoUsuario=' + filtrosClte.TipoUsuario;
    }
    if (filtrosClte.Usuario) {
      this.sFiltros += '&Usuario=' + filtrosClte.Usuario;
    }

    if (filtrosClte.ClienteCodigo && filtrosClte.ClienteCodigo != 0) {
      this.sFiltros += '&ClienteCodigo=' + filtrosClte.ClienteCodigo;

      if (filtrosClte.ClienteFilial && filtrosClte.ClienteFilial != 0) {
        this.sFiltros += '&ClienteFilial=' + filtrosClte.ClienteFilial;
      } else {
        this.sFiltros += '&ClienteFilial=0';
      }
    }
    if (filtrosClte.AgenteCodigo && filtrosClte.AgenteCodigo.trim() != '' &&
      filtrosClte.AgenteCodigo != '0') {
      this.sFiltros += '&AgenteCodigo=' + filtrosClte.AgenteCodigo;
    }

    //console.log(this.sToken, this.sFiltros)

    return this._http.get(this.API_URL + this.API + 'catalogos/CltesDocVenta.php?' +
      this.sFiltros, { headers: headers });

  }

}
