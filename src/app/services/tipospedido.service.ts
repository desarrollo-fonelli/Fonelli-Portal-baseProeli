import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { TiposPedidoList } from "src/app/models/tipospedido";

@Injectable({
  providedIn: 'root'
})
export class TipospedidoService {
  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  GetTiposPedido(Filtros: any): Observable<TiposPedidoList> {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set("Auth", this.sToken);

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    //console.log("Filtros: ", Filtros); no se aplican filtros

    return this._http.get(this.API_URL + this.API +
      'catalogos/ListaTiposPedido.php?' + _filtros, { headers: headers });

  }
}
