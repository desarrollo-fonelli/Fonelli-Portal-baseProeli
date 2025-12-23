import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';
import { FiltrosItemsConsulta, ItemsResponse, ContenidoItem } from '../modelos/articulos-tabla.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArticulosTablaService {
  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  Get(Filtros: FiltrosItemsConsulta): Observable<ItemsResponse> {

    if (!this.sToken) {
      console.error('Token no encontrado en sessionStorage');
      return throwError(() => 'Error de autenticación. Por favor, inicie sesión nuevamente.');
    }

    let headers = new HttpHeaders()
      .set('Content-Type', 'application-json')
      .set("Auth", this.sToken);

    let _filtros = '';
    _filtros += '&TipoUsuario=' + Filtros.TipoUsuario;
    _filtros += '&Usuario=' + Filtros.Usuario;
    _filtros += '&ItemCode=' + Filtros.ItemCode;
    _filtros += '&MetodoBusqueda=' + Filtros.MetodoBusqueda;

    return this._http.get<ItemsResponse>(
      this.API_URL + this.API + 'reportes/ArticulosBusqueda.php?' + _filtros, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Ocurrio un error en la red o en el cliente:', error.error);
      return throwError(() => 'Error conectando con el servidor. Verifiquesu conexión o la configuración de CORS.');
    } else {
      console.error(`Error en Backend código ${error.status}:`, error.error);
    }
    return throwError(() => 'Error en la operación, intente más tarde...');
  }

}
