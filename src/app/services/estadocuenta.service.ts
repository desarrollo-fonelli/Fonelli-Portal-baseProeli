import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { TipoCliente } from '../models/tipocliente';
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioEstadoCuenta{
    public API: string;
    public API_URL: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;

}


Get(FiltrosEstadoCuenta: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");



    return this._http.get(this.API_URL+this.API + 'reportes/EstadoCuenta.php?'+
                        'TipoUsuario=' + FiltrosEstadoCuenta.TipoUsuario +                        
                        '&ClienteDesde=' + FiltrosEstadoCuenta.ClienteDesde +
                        '&FilialDesde=' + FiltrosEstadoCuenta.FilialDesde +
                        '&ClienteHasta=' + FiltrosEstadoCuenta.ClienteHasta +
                        '&FilialHasta=' + FiltrosEstadoCuenta.FilialHasta +
                        '&CarteraDesde=' + FiltrosEstadoCuenta.CarteraDesde +
                        '&CarteraHasta=' + FiltrosEstadoCuenta.CarteraHasta 
                        //'&Pagina=' + FiltrosEstadoCuenta.Pagina
                          ,{headers:headers});
}


}