import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DocvtaDetalleService {
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

  Get(PedclteListaFiltros: any, DocSerie: string, DocFolio: string): Observable<any> {

    // Este servicio usa los mismos filtros indicados al iniciar la consulta
    // y adicionalmente debe recibir la serie y folio del documento de venta

    let headers = new HttpHeaders().set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    //console.table(PedclteListaFiltros);

    this.sFiltros = '';
    if (PedclteListaFiltros.Usuario) {
      this.sFiltros += 'Usuario=' + PedclteListaFiltros.Usuario;
    }
    this.sFiltros += '&TipoUsuario=' + PedclteListaFiltros.TipoUsuario;
    this.sFiltros += '&ClienteCodigo=' + PedclteListaFiltros.ClienteCodigo;
    this.sFiltros += '&ClienteFilial=' + PedclteListaFiltros.ClienteFilial;
    this.sFiltros += '&DocSerie=' + DocSerie;
    this.sFiltros += '&DocFolio=' + DocFolio;

    return this._http.get(this.API_URL + this.API +
      'reportes/DocVentaDetalle.php?' + this.sFiltros,
      { headers: headers });
  }

}
