import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Configuracion } from 'src/app/models/configuraciones';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotizEditarService {

  public API: string;
  public API_URL: string;
  public sToken: string;
  public sFiltros: string;

  sTipoUsuario: string;
  sUsuario: number | string;
  sClienteCodigo: number;
  sClienteFilial: number;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  /**
  * Petición HTTP que llama el servicio API REST para UPDATE/DELETE/INSERT 
  * los registros del documento
  */
  updateCotizac(oFiltros: any, cotizac: any): Observable<any> {
    // console.log('Token: ' + this.sToken);
    // console.dir(oFiltros);
    // console.dir(cotizac);

    if (!this.sToken) {
      console.error('Token no encontrado en sessionStorage');
      return throwError(() => 'Error de autenticación. Por favor, inicie sesión nuevamente.');
    }

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("Auth", this.sToken);

    let sFiltros = '&TipoUsuario=' + oFiltros.TipoUsuario + '&Usuario=' + oFiltros.Usuario;

    if (oFiltros.ClienteCodigo && oFiltros.ClienteCodigo != 0) {
      sFiltros += '&ClienteCodigo=' + oFiltros.ClienteCodigo;

      if (oFiltros.ClienteFilial && oFiltros.ClienteFilial != 0) {
        sFiltros += '&ClienteFilial=' + oFiltros.ClienteFilial;
      } else {
        sFiltros += '&ClienteFilial=0';
      }
    }
    if (oFiltros.AgenteCodigo && oFiltros.AgenteCodigo != 0) {
      sFiltros += '&AgenteCodigo=' + oFiltros.AgenteCodigo;
    }

    sFiltros += '&docId=' + oFiltros.DocId

    //    console.log(this.sFiltros + ' --- ' + this.sToken);

    return this._http.put(this.API_URL + this.API +
      'docventa/CotizUpdate.php?' + sFiltros, cotizac, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Ocurrio un error en la red o en el cliente:', error.error);
      return throwError(() => 'Error conectando con el servidor. Verifiquesu conexión o la configuración de CORS.');
    } else {
      console.error(`Backend retornó el código ${error.status}, body:`, error.error);
    }
    return throwError(() => 'Error en la operación, intente más tarde...');
  }

}
