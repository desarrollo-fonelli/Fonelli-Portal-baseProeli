import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { PrepedDetalleFiltros } from '../modelos/preped.filtros';
import { PrepedDetalleResponse } from '../modelos/preped-repo-detalle.response';

@Injectable({
  providedIn: 'root'
})
export class PrepedRepoDetalleService {
  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(
    public _http: HttpClient
  ) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  /**
   * Artículos incluidos en el Prepedido
   */
  GetDetallePreped(Filtros: PrepedDetalleFiltros): Observable<PrepedDetalleResponse> {

    // Este servicio usa los mismos filtro que el detalle de pedidos

    let headers = new HttpHeaders().set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    let _filtros = '';
    _filtros = '';
    _filtros += 'TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&ClienteCodigo=' + Filtros.ClienteCodigo;
    _filtros += '&ClienteFilial=' + Filtros.ClienteFilial;
    _filtros += '&PedidoLetra=' + Filtros.PedidoLetra;
    _filtros += '&PedidoFolio=' + Filtros.PedidoFolio;

    if (Filtros.Usuario) {
      _filtros += '&Usuario=' + Filtros.Usuario;
    }
    //console.log(_filtros);

    return this._http.get<PrepedDetalleResponse>(this.API_URL + this.API +
      'reportes/PrepedRepoDetalle.php?' + _filtros,
      { headers: headers });
  }

}