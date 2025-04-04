import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { FiltrosOrdnretorno } from '../models/ordnretorno.filtros';

@Injectable()

export class ServicioDetalleOrdenRetorno {
  public API: string;
  public API_URL: string;
  public sFiltros: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sFiltros = '';
    this.sToken = sessionStorage.getItem('token');
  }

  Get(FiltrosOrdRet: any): Observable<any> {
    let llamada: string;

    //let params = JSON.stringify(nuevoContacto);
    let headers = new HttpHeaders().set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    this.sFiltros = '';

    this.sFiltros += 'TipoUsuario=' + FiltrosOrdRet.TipoUsuario;
    if (FiltrosOrdRet.Usuario) {
      this.sFiltros += '&Usuario=' + FiltrosOrdRet.Usuario;
    }
    if (FiltrosOrdRet.ClienteCodigo) {
      this.sFiltros += '&ClienteCodigo=' + FiltrosOrdRet.ClienteCodigo;
      this.sFiltros += '&ClienteFilial=' + FiltrosOrdRet.ClienteFilial;
    }
    this.sFiltros += '&Folio=' + FiltrosOrdRet.Folio;

    return this._http.get(this.API_URL + this.API +
      'reportes/DetalleOrdenRetorno.php?' + this.sFiltros, { headers: headers });
  }

}

