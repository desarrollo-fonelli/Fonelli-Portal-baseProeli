import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { GuiasFiltros } from '../modelos/guias.filtros';

@Injectable()
export class GuiasServicio {

  public API: string;
  public API_URL: string
  public sFiltros: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sFiltros = '';
    this.sToken = sessionStorage.getItem('token');
  }

  /**
   * Devuelve lista de Paquetes, datos generales (header)
   */
  GetPaquetes(Filtros: GuiasFiltros): Observable<any> {

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

    this.sFiltros += '&OficinaDesde=' + Filtros.OficinaDesde;
    this.sFiltros += '&OficinaHasta=' + Filtros.OficinaHasta;

    if (Filtros.PaqueteBuscar) {
      this.sFiltros += '&Paquete=' + Filtros.PaqueteBuscar;
    }

    this.sFiltros += '&DocTipo=' + Filtros.DocTipoBuscar;
    if (Filtros.DocTipoBuscar != 'Todos') {
      if (Filtros.DocSerieBuscar) {
        this.sFiltros += '&DocSerie=' + Filtros.DocSerieBuscar;
      }
      if (Filtros.DocFolioBuscar) {
        this.sFiltros += '&DocFolio=' + Filtros.DocFolioBuscar;
      }
    }

    if (Filtros.PedLetraBuscar) {
      if (Filtros.PedidoBuscar) {
        this.sFiltros += '&PedLetra=' + Filtros.PedLetraBuscar;
        this.sFiltros += '&Pedido=' + Filtros.PedidoBuscar;
      }
    }
    if (Filtros.OrdCompBuscar) {
      this.sFiltros += '&OrdenCompra=' + Filtros.OrdCompBuscar;
    }
    if (Filtros.CarrierBuscar) {
      this.sFiltros += '&Carrier=' + Filtros.CarrierBuscar;
    }

    if (Filtros.FechaDesdeBuscar) {
      this.sFiltros += '&FechaDesde=' + Filtros.FechaDesdeBuscar;
    }

    if (Filtros.DocumSinGuia) {
      this.sFiltros += '&DocumSinGuia=S';
    } else {
      this.sFiltros += '&DocumSinGuia=N';
    }

    return this._http.get(this.API_URL + this.API +
      'reportes/ConsultaGuias2025.php?' + this.sFiltros,
      { headers: headers }
    );
  }

}
