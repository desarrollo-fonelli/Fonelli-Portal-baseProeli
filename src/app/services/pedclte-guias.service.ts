import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable()
export class PedclteGuiasService {
  public API: string;
  public API_URL: string;
  public sFiltros: string;
  public sToken: string;

  constructor(
    public _http: HttpClient
  ) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sFiltros = '';
    this.sToken = sessionStorage.getItem('token');
  }

  Get(FiltrosPedclteDetallePedido: any): Observable<any> {

    // Este servicio usa los mismos filtro que el detalle de pedidos

    let headers = new HttpHeaders().set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    this.sFiltros = '';
    this.sFiltros += 'TipoUsuario=' + FiltrosPedclteDetallePedido.TipoUsuario;
    this.sFiltros += '&ClienteCodigo=' + FiltrosPedclteDetallePedido.ClienteCodigo;
    this.sFiltros += '&ClienteFilial=' + FiltrosPedclteDetallePedido.ClienteFilial;
    this.sFiltros += '&PedidoLetra=' + FiltrosPedclteDetallePedido.PedidoLetra;
    this.sFiltros += '&PedidoFolio=' + FiltrosPedclteDetallePedido.PedidoFolio;

    if (FiltrosPedclteDetallePedido.Usuario) {
      this.sFiltros += '&Usuario=' + FiltrosPedclteDetallePedido.Usuario;
    }

    return this._http.get(this.API_URL + this.API +
      'reportes/DetallePedGuias.php?' + this.sFiltros,
      { headers: headers });
  }

}