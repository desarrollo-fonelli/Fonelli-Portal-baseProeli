import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioReporteVentas{
    public API: string;
    public API_URL: string;
    public sFiltros: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sFiltros = '';

}

Get(FiltrosReporteVentas: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");


    this.sFiltros = '';
    console.log("-------");

    this.sFiltros += 'TipoUsuario=' + FiltrosReporteVentas.TipoUsuario;
            
    if(FiltrosReporteVentas.Usuario)
    {
    this.sFiltros += '&Usuario=' + FiltrosReporteVentas.Usuario;
    }

    if(FiltrosReporteVentas.AgenteCodigo)
    {
    this.sFiltros += '&AgenteCodigo=' + FiltrosReporteVentas.AgenteCodigo;
    }


    this.sFiltros += '&ClienteDesde=' + FiltrosReporteVentas.ClienteDesde;
    this.sFiltros += '&FilialDesde=' + FiltrosReporteVentas.FilialDesde;
    this.sFiltros += '&ClienteHasta=' + FiltrosReporteVentas.ClienteHasta;
    this.sFiltros += '&FilialHasta=' + FiltrosReporteVentas.FilialHasta;
    this.sFiltros += '&CategoriaDesde=' + FiltrosReporteVentas.CategoriaDesde;
    this.sFiltros += '&SubcategoDesde=' + FiltrosReporteVentas.SubcategoDesde;
    this.sFiltros += '&CategoriaHasta=' + FiltrosReporteVentas.CategoriaHasta;
    this.sFiltros += '&SubcategoHasta=' + FiltrosReporteVentas.SubcategoHasta;
    this.sFiltros += '&Fecha1Desde=' + FiltrosReporteVentas.Fecha1Desde;
    this.sFiltros += '&Fecha1Hasta=' + FiltrosReporteVentas.Fecha1Hasta;
    this.sFiltros += '&Fecha2Desde=' + FiltrosReporteVentas.Fecha2Desde;
    this.sFiltros += '&Fecha2Hasta=' + FiltrosReporteVentas.Fecha2Hasta;
    this.sFiltros += '&TipoClienteDesde=' + FiltrosReporteVentas.TipoClienteDesde;
    this.sFiltros += '&TipoClienteHasta=' + FiltrosReporteVentas.TipoClienteHasta;
    this.sFiltros += '&OrdenReporte=' + FiltrosReporteVentas.OrdenReporte;
    this.sFiltros += '&DesglosaCliente=' + FiltrosReporteVentas.DesglosaCliente;
    this.sFiltros += '&DesglosaCategoria=' + FiltrosReporteVentas.DesglosaCategoria;

     if(FiltrosReporteVentas.TipoOrigen  != 'T')
    {
        this.sFiltros += '&TipoOrigen=' + FiltrosReporteVentas.TipoOrigen;
    }

    return this._http.get(this.API_URL+this.API + 'reportes/ReporteVentas.php?'+this.sFiltros,{headers:headers});
}


}