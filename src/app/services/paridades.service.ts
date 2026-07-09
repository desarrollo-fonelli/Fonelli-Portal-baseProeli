import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { ParidadesResponse } from 'src/app/models/paridades.model'

@Injectable({
  providedIn: 'root'
})
export class ParidadesService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  GetParidades(Filtros: any): Observable<ParidadesResponse> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set("Auth", this.sToken);

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;

    return this.http.get<ParidadesResponse>(
      this.API_URL + this.API + 'catalogos/GetParidades.php?' + _filtros,
      { headers: headers });
  }
}
