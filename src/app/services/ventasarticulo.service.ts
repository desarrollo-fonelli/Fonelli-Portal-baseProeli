import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioVentasArticulo{
    public API: string;
    public API_URL: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;

}

Get(FiltrosVentasArticulo: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");



    return this._http.get(this.API_URL+this.API + 'Reportes/VentasArticulo.php?'+
                        'OficinaDesde=' + FiltrosVentasArticulo.OficinaDesde +
                        '&OficinaHasta=' + FiltrosVentasArticulo.OficinaHasta +
                        '&FechaDesde=' + FiltrosVentasArticulo.FechaDesde +
                        '&FechaHasta=' + FiltrosVentasArticulo.FechaHasta +
                        '&LineaDesde=' + FiltrosVentasArticulo.LineaDesde +
                        '&LineaHasta=' + FiltrosVentasArticulo.LineaHasta +
                        '&ClaveDesde=' + FiltrosVentasArticulo.ClaveDesde +
                        '&ClaveHasta=' + FiltrosVentasArticulo.ClaveHasta +
                        '&FamiliaDesde=' + FiltrosVentasArticulo.FamiliaDesde +
                        '&FamiliaHasta=' + FiltrosVentasArticulo.FamiliaHasta +
                        '&TipoArticulo=' + FiltrosVentasArticulo.TipoArticulo +
                        '&TipoOrigen=' + FiltrosVentasArticulo.TipoOrigen +
                        '&Orden=' + FiltrosVentasArticulo.Orden +
                        '&Presentacion=' + FiltrosVentasArticulo.Presentacion +
                        '&Pagina=' + FiltrosVentasArticulo.Pagina
                          ,{headers:headers});
}


}