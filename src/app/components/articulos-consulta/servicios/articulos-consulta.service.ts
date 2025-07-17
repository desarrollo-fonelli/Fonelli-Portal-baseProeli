import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { FiltrosItemsConsulta, ItemsResponse, ContenidoItem } from '../modelos/articulos-consulta.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArticulosConsultaService {
  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  Get(Filtros: FiltrosItemsConsulta): Observable<ItemsResponse> {
    let headers = new HttpHeaders().set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    _filtros += '&ItemCode=' + Filtros.ItemCode;
    _filtros += '&MetodoBusqueda=' + Filtros.MetodoBusqueda;


    return this._http.get<ItemsResponse>(
      this.API_URL + this.API + 'reportes/ArticulosBusqueda.php?' + _filtros, { headers: headers });
  }
}
