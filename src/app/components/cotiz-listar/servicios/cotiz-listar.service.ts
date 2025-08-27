import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Configuracion } from 'src/app/models/configuraciones';
import { environment } from 'src/environments/environment';

@Injectable()
export class CotizListarService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');

  }

  /**
   * Petición http GET que llama el servicio API REST para crear los registros del documento
   */
  GetCotizac(_filtros: any): Observable<any> {

    if (!this.sToken) {
      console.error('Token no encontrado en sessionStorage');
      return throwError(() => 'Error de autenticación. Por favor, inicie sesión nuevamente.');
    }

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Auth', this.sToken)

    let sFiltros = '';

    if (_filtros.TipoUsuario) {
      sFiltros += 'TipoUsuario=' + _filtros.TipoUsuario;
    }
    if (_filtros.Usuario) {
      sFiltros += '&Usuario=' + _filtros.Usuario;
    }
    if (_filtros.ClienteCodigo && _filtros.ClienteCodigo != 0) {
      sFiltros += '&ClienteCodigo=' + _filtros.ClienteCodigo;

      if (_filtros.ClienteFilial && _filtros.ClienteFilial != 0) {
        sFiltros += '&ClienteFilial=' + _filtros.ClienteFilial;
      } else {
        sFiltros += '&ClienteFilial=0';
      }
    }
    if (_filtros.AgenteCodigo && _filtros.AgenteCodigo != 0) {
      sFiltros += '&AgenteCodigo=' + _filtros.AgenteCodigo;
    }
    sFiltros += '&FechaDesde=' + _filtros.FechaDesde;
    sFiltros += '&FechaHasta=' + _filtros.FechaHasta;
    sFiltros += '&FolioDesde=' + _filtros.FolioDesde;
    sFiltros += '&FolioHasta=' + _filtros.FolioHasta;
    if (_filtros.Status && _filtros.Status != 'T') {
      sFiltros += '&Status=' + _filtros.Status;
    }

    return this._http.get(this.API_URL + this.API + 'reportes/CotizListar.php?' +
      sFiltros, { headers: headers }).pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Ocurrio un error en la red o en el cliente:', error.error);
      return throwError(() => 'Error conectando con el servidor. Verifiquesu conexión o la configuración de CORS.');
    } else {
      console.error(`Backend error código ${error.status}:`, error.error);
    }
    return throwError(() => 'Error en la operación, intente más tarde...');
  }

}
