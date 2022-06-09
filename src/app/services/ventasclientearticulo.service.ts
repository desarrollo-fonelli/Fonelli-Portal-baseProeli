import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";



@Injectable()
export class ServicioVentasClienteArticulo{
    public API: string;
    public sFiltros: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.sFiltros = '';

}

Get(FiltrosVentasClienteArticulo: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");


    
                                    console.log(FiltrosVentasClienteArticulo);
    
                                    this.sFiltros = 'TipoUsuario=' + FiltrosVentasClienteArticulo.TipoUsuario;
            
                                    if(FiltrosVentasClienteArticulo.Usuario)
                                    {
                                    this.sFiltros += '&Usuario=' + FiltrosVentasClienteArticulo.Usuario;
                                    }

                                    //Obligatorios
                                    this.sFiltros += '&OficinaDesde=' + FiltrosVentasClienteArticulo.OficinaDesde;
                                    this.sFiltros += '&OficinaHasta=' + FiltrosVentasClienteArticulo.OficinaHasta;
                                    this.sFiltros += '&FechaDesde=' + FiltrosVentasClienteArticulo.FechaDesde;
                                    this.sFiltros += '&FechaHasta=' + FiltrosVentasClienteArticulo.FechaHasta;
                                    this.sFiltros += '&ClienteDesde=' + FiltrosVentasClienteArticulo.ClienteDesde;
                                    this.sFiltros += '&FilialDesde=' + FiltrosVentasClienteArticulo.FilialDesde;
                                    this.sFiltros += '&ClienteHasta=' + FiltrosVentasClienteArticulo.ClienteHasta;
                                    this.sFiltros += '&FilialHasta=' + FiltrosVentasClienteArticulo.FilialHasta;
                                    this.sFiltros += '&LineaDesde=' + FiltrosVentasClienteArticulo.LineaDesde;
                                    this.sFiltros += '&LineaHasta=' + FiltrosVentasClienteArticulo.LineaHasta;
                                    this.sFiltros += '&ClaveDesde=' + FiltrosVentasClienteArticulo.ClaveDesde;
                                    this.sFiltros += '&ClaveHasta=' + FiltrosVentasClienteArticulo.ClaveHasta;
                                    this.sFiltros += '&CategoriaDesde=' + FiltrosVentasClienteArticulo.CategoriaDesde;
                                    this.sFiltros += '&SubcategoDesde=' + FiltrosVentasClienteArticulo.SubcategoriaDesde;
                                    this.sFiltros += '&CategoriaHasta=' + FiltrosVentasClienteArticulo.CategoriaHasta;
                                    this.sFiltros += '&SubcategoHasta=' + FiltrosVentasClienteArticulo.SubcategoriaHasta;
                                    
                                    if(FiltrosVentasClienteArticulo.TipoArticulo)
                                    {
                                        this.sFiltros += '&TipoArticulo=' + FiltrosVentasClienteArticulo.TipoArticulo;
                                    }

                                    if(FiltrosVentasClienteArticulo.TipoOrigen)
                                    {
                                        this.sFiltros += '&TipoOrigen=' + FiltrosVentasClienteArticulo.TipoOrigen;
                                    }

                                    this.sFiltros += '&OrdenReporte=' + FiltrosVentasClienteArticulo.OrdenReporte;
                                    this.sFiltros += '&Presentacion=' + FiltrosVentasClienteArticulo.Presentacion;

                                    if(FiltrosVentasClienteArticulo.Pagina)
                                    {
                                        this.sFiltros += '&Pagina=' + FiltrosVentasClienteArticulo.Pagina;
                                    }


                                    console.log(this.sFiltros);


                        return this._http.get(this.API + 'Reportes/VentasClienteArticulo.php?'+this.sFiltros,{headers:headers});



}


}