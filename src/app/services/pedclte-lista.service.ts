import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { PedclteListaFiltros } from '../models/pedclte-lista.filtros';

//@Injectable({
//  providedIn: 'root'
//})
@Injectable()
export class PedclteListaService {
  public API: string;
  public sFiltros: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.sFiltros = '';
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  Get(Filtros: PedclteListaFiltros): Observable<any> {
    let llamada: string;

    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    this.sFiltros = '';

    if (Filtros.TipoUsuario) {
      this.sFiltros += '&TipoUsuario=' + Filtros.TipoUsuario;
    }
    this.sFiltros += '&Usuario=' + Filtros.Usuario;

    if (Filtros.ClienteCodigo) {
      this.sFiltros += '&ClienteCodigo=' + Filtros.ClienteCodigo;
    }
    if (Filtros.ClienteFilial || Filtros.ClienteFilial == 0) {
      this.sFiltros += '&ClienteFilial=' + Filtros.ClienteFilial;
    }
    if (Filtros.Status != 'T') {
      this.sFiltros += '&Status=' + Filtros.Status;
    }
    if (Filtros.PedidoBuscar) {
      this.sFiltros += '&FolioPedido=' + Filtros.PedidoBuscar;
    }
    if (Filtros.OrdCompBuscar) {
      this.sFiltros += '&OrdenCompra=' + Filtros.OrdCompBuscar;
    }

    return this._http.get(this.API_URL + this.API +
      'reportes/ConsultaPedidos.php?' + this.sFiltros,
      { headers: headers }
    );
  }
}
