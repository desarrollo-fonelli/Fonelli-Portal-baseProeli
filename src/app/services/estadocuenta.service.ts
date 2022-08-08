import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { TipoCliente } from '../models/tipocliente';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';



@Injectable()
export class ServicioEstadoCuenta{
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


Get(FiltrosEstadoCuenta: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");

                                    this.sFiltros='';
                        
                        //Obligatorios
                        this.sFiltros += 'TipoUsuario=' + FiltrosEstadoCuenta.TipoUsuario;

                        if(FiltrosEstadoCuenta.Usuario)
                        {
                            this.sFiltros += '&Usuario=' + FiltrosEstadoCuenta.Usuario;
                        }

                        //Obligatorios
                        this.sFiltros += '&ClienteDesde=' + FiltrosEstadoCuenta.ClienteDesde;
                        this.sFiltros += '&FilialDesde=' + FiltrosEstadoCuenta.FilialDesde;
                        this.sFiltros += '&ClienteHasta=' + FiltrosEstadoCuenta.ClienteHasta;
                        this.sFiltros += '&FilialHasta=' + FiltrosEstadoCuenta.FilialHasta;
                        this.sFiltros += '&CarteraDesde=' + FiltrosEstadoCuenta.CarteraDesde;
                        this.sFiltros += '&CarteraHasta=' + FiltrosEstadoCuenta.CarteraHasta;

                        return this._http.get(this.API_URL+this.API + 'reportes/EstadoCuenta.php?'+this.sFiltros,{headers:headers});


}


}