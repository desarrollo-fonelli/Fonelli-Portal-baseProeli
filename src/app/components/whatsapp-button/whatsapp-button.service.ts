import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WhatsappConfig } from './whatsapp-config';


@Injectable({
  providedIn: 'root'
})
export class WhatsappButtonService {

  private configUrl = 'assets/data/whatsapp-button.json';

  constructor(private _http: HttpClient) { }

  /**
   * En esta etapa obtengo la configuración del chat desde un archivo JSON
   * @return Un observable con la configuración
   */
  getConfig(): Observable<WhatsappConfig> {
    return this._http.get<WhatsappConfig>(this.configUrl);
  }

}
