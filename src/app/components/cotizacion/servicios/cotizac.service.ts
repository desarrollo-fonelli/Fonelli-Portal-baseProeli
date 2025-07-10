import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracion } from 'src/app/models/configuraciones';
import { environment } from 'src/environments/environment';
import { Cotizac } from '../modelos/cotizac';

@Injectable({
  providedIn: 'root'
})
export class CotizacService {
  private apiUrl = 'assets/datatest/testcotizac.json'

  constructor(private _http: HttpClient) { }

  guardarCotizac(cotizac: Cotizac): Observable<Cotizac> {
    return this._http.post<Cotizac>(this.apiUrl, cotizac);
  }
}
