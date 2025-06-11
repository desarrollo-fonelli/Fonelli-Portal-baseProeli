import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumArticulosService {

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

  Get(oFiltrosDocum: any): Observable<any> {

    let headers = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Acces-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    this.sFiltros = '';

    if (oFiltrosDocum.Usuario) {
      this.sFiltros += 'Usuario=' + oFiltrosDocum.Usuario;
    }
    this.sFiltros += '&TipoUsuario=' + oFiltrosDocum.TipoUsuario;
    this.sFiltros += '&ClienteCodigo=' + oFiltrosDocum.ClienteCodigo;
    this.sFiltros += '&ClienteFilial=' + oFiltrosDocum.ClienteFilial;
    this.sFiltros += '&DocTipo=' + oFiltrosDocum.DocTipo;
    this.sFiltros += '&DocSerie=' + oFiltrosDocum.DocSerie;
    this.sFiltros += '&DocFolio=' + oFiltrosDocum.DocFolio;
    this.sFiltros += '&DocFecha=' + oFiltrosDocum.DocFecha;

    return this._http.get(this.API_URL + this.API +
      'reportes/DocumArticulos.php?' + this.sFiltros,
      { headers: headers });

  }
}
