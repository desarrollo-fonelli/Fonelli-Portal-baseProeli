import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Configuracion } from 'src/app/models/configuraciones';
import { environment } from 'src/environments/environment';

// Modelos e interfaces
import { CotizacDocum } from '../modelos/cotizac-docum';
import { Usuario } from '../../../models/usuario';

@Injectable()
export class CotizCrearService {

  public API: string;
  public API_URL: string;
  public sToken: string;
  public sFiltros: string;

  sTipoUsuario: string;
  sUsuario: number | string;
  sClienteCodigo: number;
  sClienteFilial: number;
  //  sAgenteCodigo: number;

  constructor(
    public _http: HttpClient
  ) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  /**
   * Petición HTTP que llama el servicio API REST para crear los registros del documento
   */
  guardarCotizac(oFiltros: any, cotizac: any): Observable<any> {

    if (!this.sToken) {
      console.error('Token no encontrado en sessionStorage');
      return throwError(() => 'Error de autenticación. Por favor, inicie sesión nuevamente.');
    }

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("Auth", this.sToken);

    /* Estas son cabeceras de respuesta, no se deben enviar, deben indicarse en el backend.    
       El navegador las ignora.
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth")
      .set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
      .set("Access-Control-Allow-Credentials", "true"
    */

    this.sFiltros = '&TipoUsuario=' + oFiltros.TipoUsuario + '&Usuario=' + oFiltros.Usuario;

    if (oFiltros.ClienteCodigo && oFiltros.ClienteCodigo != 0) {
      this.sFiltros += '&ClienteCodigo=' + oFiltros.ClienteCodigo;

      if (oFiltros.ClienteFilial && oFiltros.ClienteFilial != 0) {
        this.sFiltros += '&ClienteFilial=' + oFiltros.ClienteFilial;
      } else {
        this.sFiltros += '&ClienteFilial=0';
      }
    }
    if (oFiltros.AgenteCodigo && oFiltros.AgenteCodigo != 0) {
      this.sFiltros += '&AgenteCodigo=' + oFiltros.AgenteCodigo;
    }

    //    console.log(this.sFiltros + ' --- ' + this.sToken);

    return this._http.post(this.API_URL + this.API +
      'docventa/CotizCrear.php?' + this.sFiltros,
      cotizac, { headers: headers })
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
