import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioReporteVentas{
    public API: string;
    public API_URL: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;

}

Get(FiltrosReporteVentas: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");



    return this._http.get(this.API_URL+this.API + 'reportes/ReporteVentas.php?'+
                        'AgenteCodigo=' + FiltrosReporteVentas.AgenteCodigo +
                        '&ClienteDesde=' + FiltrosReporteVentas.ClienteDesde +
                        '&FilialDesde=' + FiltrosReporteVentas.FilialDesde +
                        '&ClienteHasta=' + FiltrosReporteVentas.ClienteHasta +
                        '&FilialHasta=' + FiltrosReporteVentas.FilialHasta +
                        '&FamiliaDesde=' + FiltrosReporteVentas.FamiliaDesde +
                        '&FamiliaHasta=' + FiltrosReporteVentas.FamiliaHasta +
                        '&Fecha1Desde=' + FiltrosReporteVentas.Fecha1Desde +
                        '&Fecha1Hasta=' + FiltrosReporteVentas.Fecha1Hasta +
                        '&Fecha2Desde=' + FiltrosReporteVentas.Fecha2Desde +
                        '&Fecha2Hasta=' + FiltrosReporteVentas.Fecha2Hasta +
                        '&TipoClienteDesde=' + FiltrosReporteVentas.TipoClienteDesde +
                        '&TipoClienteHasta=' + FiltrosReporteVentas.TipoClienteHasta +
                        '&Orden=' + FiltrosReporteVentas.Orden +
                        '&DesglosaCliente=' + FiltrosReporteVentas.DesglosaCliente +
                        '&DesglosaFamilia=' + FiltrosReporteVentas.DesglosaFamilia +
                        '&TipoOrigen=' + FiltrosReporteVentas.TipoOrigen +
                        '&Pagina=' + FiltrosReporteVentas.Pagina 
                          ,{headers:headers});
}


}