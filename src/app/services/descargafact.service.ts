import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DescargafactService {

  public API: string;
  public sFiltros: string;
  public API_URL: string;
  public sToken: string;

  constructor(
    public _http: HttpClient
  ) {
    this.API = Configuracion.API;
    this.sFiltros = '';
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');

  }

  descargarFactura(oCliente, mes, anio, serie, folio) {

    let headers = new HttpHeaders().set('Content-Type', 'application-pdf')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    //const mes: string = oCfdi.Fecha.getMonth() + 1;   // enero=0
    //const anio: string = oCfdi.Fecha.getFullYear();
    //let clterfc = oCliente.ClienteRfc.replace(/-/g, "").trim();
    let clterfc = oCliente.ClienteRfc.replace(/[-\s]/g, "");  // quita guiones y espacios del rfc
    const fileName: string = clterfc + '_' + serie.trim() + '_' + folio.trim();

    const params = new HttpParams()
      .set('TipoUsuario', 'G')
      .set('Usuario', '1')
      .set('ClienteCodigo', oCliente.ClienteCodigo.trim())
      .set('ClienteFilial', oCliente.ClienteFilial.trim())
      .set('ClienteRfc', clterfc)
      .set('year', anio.toString())
      .set('mes', mes.toString().padStart(2, "0"))
      .set('fileName', fileName)
      ;

    return this._http.get(this.API_URL + this.API + 'reportes/DescargarCFDI.php', {
      params,
      responseType: 'blob',    // para que devuelva el PDF como Blob      
      headers: headers
    })

  }

}
