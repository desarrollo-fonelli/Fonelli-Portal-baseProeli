import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Configuracion } from 'src/app/models/configuraciones';
import { environment } from 'src/environments/environment';

// Modelos
import { OrdenVenta, OrdenFila } from './orden-venta.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenVentaService {

  public API: string;
  public API_URL: string;
  public sToken: string;

  constructor(public _http: HttpClient) {
    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');
  }

  crearOrdenVenta(ordenVenta: OrdenVenta): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application-json')
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      .set("Access-Control-Allow-Methods", "POST")
      .set("Auth", this.sToken)
      .set("Access-Control-Allow-Credentials", "true");

    return this._http.post(
      this.API_URL + this.API + 'docventa/DocTest.php', ordenVenta, { headers: headers });
  }
}
