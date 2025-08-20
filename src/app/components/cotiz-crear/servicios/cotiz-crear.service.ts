import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracion } from 'src/app/models/configuraciones';
import { environment } from 'src/environments/environment';
import { CotizacDocum } from '../modelos/cotizac-docum';

@Injectable({
  providedIn: 'root'
})
export class CotizCrearService {
  private apiUrl = 'assets/datatest/testcotizac.json'

  constructor(private _http: HttpClient) { }

  guardarCotizac(cotizac: CotizacDocum): Observable<CotizacDocum> {
    return this._http.post<CotizacDocum>(this.apiUrl, cotizac);
  }
}
