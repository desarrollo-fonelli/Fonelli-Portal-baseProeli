import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracion } from 'src/app/models/configuraciones';
import { environment } from 'src/environments/environment';

import { CalcPrecParam } from 'src/app/models/calc-prec-param';
//import { } from 'src/app/models/calc-prec-response';
import { Usuario } from '../../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class CotizacArticuloService {

  public API: string;
  public API_URL: string;
  public sToken: string;
  //public sFiltros: string;

  constructor(private _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    //this.sFiltros = '';
    this.sToken = '';
  }

  getArticulo(filtrosArtic: any): Observable<any> {

    let _Filtros = '';
    this.sToken = sessionStorage.getItem('token');

    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      .set('Access-Control-Allow-Methods', 'GET')
      .set('Auth', this.sToken)
      .set('Access-Control-Allow-Credentials', 'true');

    if (filtrosArtic.TipoUsuario) {
      _Filtros += '&TipoUsuario=' + filtrosArtic.TipoUsuario;
    }
    if (filtrosArtic.Usuario) {
      _Filtros += '&Usuario=' + filtrosArtic.Usuario;
    }
    if (filtrosArtic.ClienteCodigo && filtrosArtic.ClienteCodigo != 0) {
      _Filtros += '&ClienteCodigo=' + filtrosArtic.ClienteCodigo;

      if (filtrosArtic.ClienteFilial && filtrosArtic.ClienteFilial != 0) {
        _Filtros += '&ClienteFilial=' + filtrosArtic.ClienteFilial;
      } else {
        _Filtros += '&ClienteFilial=0';
      }
    }

    _Filtros += '&ItemLinea=' + filtrosArtic.ItemLinea;
    _Filtros += '&ItemCode=' + filtrosArtic.ItemCode;
    _Filtros += '&ListaPrecCode=' + filtrosArtic.ListaPrecCode;
    _Filtros += '&ParidadTipo=' + filtrosArtic.ParidadTipo;
    _Filtros += '&PiezasCosto=' + filtrosArtic.PiezasCosto;
    _Filtros += '&GramosCosto=' + filtrosArtic.GramosCosto;

    //console.log('🔸 _Filtros:' + _Filtros);

    return this._http.get(this.API_URL + this.API + 'catalogos/ArticuloPrecio.php?' +
      _Filtros, { headers: headers });

  }
}
