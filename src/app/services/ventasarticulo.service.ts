import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioVentasArticulo{
    public API: string;
    public API_URL: string;
    public sFiltros: string;
    public sToken: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sFiltros = '';
    this.sToken = sessionStorage.getItem('token');

}

Get(FiltrosVentasArticulo: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    .set("Access-Control-Allow-Methods", "GET")
                                    .set("Auth", this.sToken)
                                    .set("Access-Control-Allow-Credentials", "true");



                                    
    console.log(FiltrosVentasArticulo);

    this.sFiltros = '';

    this.sFiltros += 'TipoUsuario=' + FiltrosVentasArticulo.TipoUsuario;
            

    this.sFiltros += '&Usuario=' + FiltrosVentasArticulo.Usuario;
 

    this.sFiltros += '&OficinaDesde=' + FiltrosVentasArticulo.OficinaDesde;
    this.sFiltros += '&OficinaHasta=' + FiltrosVentasArticulo.OficinaHasta;
    this.sFiltros += '&FechaDesde=' + FiltrosVentasArticulo.FechaDesde;
    this.sFiltros += '&FechaHasta=' + FiltrosVentasArticulo.FechaHasta;
    this.sFiltros += '&LineaDesde=' + FiltrosVentasArticulo.LineaDesde;
    this.sFiltros += '&LineaHasta=' + FiltrosVentasArticulo.LineaHasta;
    this.sFiltros += '&ClaveDesde=' + FiltrosVentasArticulo.ClaveDesde;
    this.sFiltros += '&ClaveHasta=' + FiltrosVentasArticulo.ClaveHasta;
    this.sFiltros += '&CategoriaDesde=' + FiltrosVentasArticulo.CategoriaDesde;
    this.sFiltros += '&SubcategoDesde=' + FiltrosVentasArticulo.SubcategoDesde;
    this.sFiltros += '&CategoriaHasta=' + FiltrosVentasArticulo.CategoriaHasta;
    this.sFiltros += '&SubcategoHasta=' + FiltrosVentasArticulo.SubcategoHasta;

    if(FiltrosVentasArticulo.TipoArticulo !='T')
    {
    this.sFiltros += '&TipoArticulo=' + FiltrosVentasArticulo.TipoArticulo;
    }
    if(FiltrosVentasArticulo.TipoOrigen != 'T')
    {
    this.sFiltros += '&TipoOrigen=' + FiltrosVentasArticulo.TipoOrigen;
    }

    this.sFiltros += '&OrdenReporte=' + FiltrosVentasArticulo.OrdenReporte;
    this.sFiltros += '&Presentacion=' + FiltrosVentasArticulo.Presentacion;



    return this._http.get(this.API_URL+this.API + 'reportes/VentasArticulo.php?'+this.sFiltros,{headers:headers});

}


}