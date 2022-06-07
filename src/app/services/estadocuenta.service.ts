import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { TipoCliente } from '../models/tipocliente';



@Injectable()
export class ServicioEstadoCuenta{
    public API: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;

}


Get(FiltrosEstadoCuenta: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");



    return this._http.get(this.API + 'Reportes/EstadoCuenta.php?'+
                        'TipoUsuario=' + FiltrosEstadoCuenta.TipoUsuario +                        
                        '&ClienteDesde=' + FiltrosEstadoCuenta.ClienteDesde +
                        '&FilialDesde=' + FiltrosEstadoCuenta.FiliadDesde +
                        '&ClienteHasta=' + FiltrosEstadoCuenta.ClienteHasta +
                        '&FilialHasta=' + FiltrosEstadoCuenta.FilialHasta +
                        '&CarteraDesde=' + FiltrosEstadoCuenta.CarteraDesde +
                        '&CarteraHasta=' + FiltrosEstadoCuenta.CarteraHasta 
                        //'&Pagina=' + FiltrosEstadoCuenta.Pagina
                          ,{headers:headers});
}


}