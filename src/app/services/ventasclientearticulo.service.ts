import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";



@Injectable()
export class ServicioVentasClienteArticulo{
    public API: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;

}

Get(FiltrosVentasClienteArticulo: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");



    return this._http.get(this.API + 'Reportes/VentasClienteArticulo.php?'+
                        'OficinaDesde=' + FiltrosVentasClienteArticulo.OficinaDesde +
                        '&OficinaHasta=' + FiltrosVentasClienteArticulo.OficinaHasta +
                        '&FechaDesde=' + FiltrosVentasClienteArticulo.FechaDesde +
                        '&FechaHasta=' + FiltrosVentasClienteArticulo.FechaHasta +
                        '&ClienteDesde=' + FiltrosVentasClienteArticulo.ClienteDesde +
                        '&FilialDesde=' + FiltrosVentasClienteArticulo.FilialDesde +
                        '&ClienteHasta=' + FiltrosVentasClienteArticulo.ClienteDesde +
                        '&FilialHasta=' + FiltrosVentasClienteArticulo.FilialHasta +
                        '&LineaDesde=' + FiltrosVentasClienteArticulo.LineaDesde +
                        '&LineaHasta=' + FiltrosVentasClienteArticulo.LineaHasta +
                        '&ClaveDesde=' + FiltrosVentasClienteArticulo.ClaveDesde +
                        '&ClaveHasta=' + FiltrosVentasClienteArticulo.ClaveHasta +
                        '&FamiliaDesde=' + FiltrosVentasClienteArticulo.FamiliaDesde +
                        '&FamiliaHasta=' + FiltrosVentasClienteArticulo.FamiliaHasta +
                        '&TipoArticulo=' + FiltrosVentasClienteArticulo.TipoArticulo +
                        '&TipoOrigen=' + FiltrosVentasClienteArticulo.TipoOrigen +
                        '&Orden=' + FiltrosVentasClienteArticulo.Orden +
                        '&Presentacion=' + FiltrosVentasClienteArticulo.Presentacion +
                        '&Pagina=' + FiltrosVentasClienteArticulo.Pagina 
                          ,{headers:headers});
}


}