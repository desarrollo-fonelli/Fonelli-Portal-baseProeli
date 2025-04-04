import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracion } from '../models/configuraciones';
import { environment } from '../../environments/environment';

@Injectable()

export class ServicioOrdnretorno {
  public API: string;
  public API_URL: string;
  public sFiltros: string;
  public sToken: string;

  constructor(
    public _http: HttpClient
  ) {
    this.API = Configuracion.API;
    this.sFiltros = '';
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  Get(FiltrosOrdnretorno: any): Observable<any> {
    let llamada: string;

    // let params = JSON.stringify(nuevoContacto);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      .set('Access-Control-Allow-Methods', 'GET')
      .set('Auth', this.sToken)
      .set('Access-Control-Allow-Credentials', 'true');

    this.sFiltros = '';
    if (FiltrosOrdnretorno.TipoUsuario) {
      this.sFiltros += 'TipoUsuario=' + FiltrosOrdnretorno.TipoUsuario;
    }
    if (FiltrosOrdnretorno.Usuario) {
      this.sFiltros += '&Usuario=' + FiltrosOrdnretorno.Usuario;
    }
    if (FiltrosOrdnretorno.ClienteCodigo && FiltrosOrdnretorno.ClienteCodigo != 0) {
      this.sFiltros += '&ClienteCodigo=' + FiltrosOrdnretorno.ClienteCodigo;

      if (FiltrosOrdnretorno.ClienteFilial && FiltrosOrdnretorno.ClienteFilial != 0) {
        this.sFiltros += '&ClienteFilial=' + FiltrosOrdnretorno.ClienteFilial;
      } else {
        this.sFiltros += '&ClienteFilial=0';
      }
    }
    if (FiltrosOrdnretorno.AgenteCodigo && FiltrosOrdnretorno.AgenteCodigo != 0) {
      this.sFiltros += '&AgenteCodigo=' + FiltrosOrdnretorno.AgenteCodigo;
    }
    if (FiltrosOrdnretorno.Folio && FiltrosOrdnretorno.Folio != 0) {
      this.sFiltros += '&Folio=' + FiltrosOrdnretorno.Folio;
    }
    if (FiltrosOrdnretorno.Referencia && FiltrosOrdnretorno.Referencia != 0) {
      this.sFiltros += '&Referencia=' + FiltrosOrdnretorno.Referencia;
    }
    if (FiltrosOrdnretorno.Status != 'T') {
      this.sFiltros += '&Status=' + FiltrosOrdnretorno.Status;
    }

    return this._http.get(this.API_URL + this.API + 'reportes/OrdenesRetorno.php?' +
      this.sFiltros, { headers: headers });
  }
}
