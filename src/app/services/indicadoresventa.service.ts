import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioIndicadoresVenta{
    public API: string;
    public API_URL: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;

}


Get(FiltroIndicadoresVenta: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");



    return this._http.get(this.API_URL+this.API + 'reportes/IndicadoresVenta.php?'+
                        'AgenteDesde=' + FiltroIndicadoresVenta.AgenteDesde +                        
                        '&AgenteHasta=' + FiltroIndicadoresVenta.AgenteHasta +
                        '&FechaCorte=' + FiltroIndicadoresVenta.FechaCorte                         
                        //'&Pagina=' + FiltrosEstadoCuenta.Pagina
                          ,{headers:headers});
}


}