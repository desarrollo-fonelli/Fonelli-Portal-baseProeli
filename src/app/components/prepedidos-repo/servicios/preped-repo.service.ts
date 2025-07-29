import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracion } from 'src/app/models/configuraciones';
import { environment } from 'src/environments/environment';
import { PrePedFiltros } from '../modelos/preped.filtros';
import { PrePedRepoResponse } from '../modelos/preped-repo.response';

@Injectable({
  providedIn: 'root'
})
export class PrepedRepoService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  /**
   * Obtiene conjunto de datos para lista resumida de prepedidos
   */
  GetListaPreped(Filtros: PrePedFiltros): Observable<PrePedRepoResponse> {
    let headers = new HttpHeaders().set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "GET")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    _filtros += '&OficinaDesde=' + Filtros.OficinaDesde;
    _filtros += '&OficinaHasta=' + Filtros.OficinaHasta;
    _filtros += '&AgenteDesde=' + Filtros.AgenteDesde;
    _filtros += '&AgenteHasta=' + Filtros.AgenteHasta;
    _filtros += '&ClienteDesde=' + Filtros.ClienteDesde;
    _filtros += '&FilialDesde=' + Filtros.FilialDesde;
    _filtros += '&ClienteHasta=' + Filtros.ClienteHasta;
    _filtros += '&FilialHasta=' + Filtros.FilialHasta;
    _filtros += '&FechaPrepDesde=' + Filtros.FechaPrepDesde;
    _filtros += '&FechaPrepHasta=' + Filtros.FechaPrepHasta;
    _filtros += '&FolioDesde=' + Filtros.FolioDesde;
    _filtros += '&FolioHasta=' + Filtros.FolioHasta;

    if (Filtros.OrdenCompra && Filtros.OrdenCompra.trim() != '') {
      _filtros += '&OrdenCompra=' + Filtros.OrdenCompra;
    }
    if (Filtros.Status && Filtros.Status != 'T') {
      _filtros += '&Status=' + Filtros.Status;
    }
    if (Filtros.Documentados && Filtros.Documentados != 'Todos') {
      if (Filtros.Documentados == 'Documentados') {
        _filtros += '&Documentados=S';
      }
      if (Filtros.Documentados == 'NoDocumentad') {
        _filtros += '&Documentados=N';
      }
    }
    if (Filtros.Autorizados && Filtros.Autorizados != 'Todos') {
      if (Filtros.Autorizados == 'Autorizados') {
        _filtros += '&Autorizados=S';
      }
      if (Filtros.Autorizados == 'NoAutorizad') {
        _filtros += '&Autorizados=N';
      }
    }

    return this._http.get<PrePedRepoResponse>(
      this.API_URL + this.API + 'reportes/PrepedidosRepo.php?' + _filtros, { headers: headers });
  }

}
