import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioAgentes{
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

Get(FiltrosClientes: any): Observable<any>{
    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    .set("Access-Control-Allow-Methods", "GET")
                                    .set("Auth", this.sToken)
                                    .set("Access-Control-Allow-Credentials", "true");

    this.sFiltros = '';

    console.log(1);
    console.log(FiltrosClientes.Status);
    

    if(FiltrosClientes.TipoUsuario){
        this.sFiltros += 'TipoUsuario=' + FiltrosClientes.TipoUsuario;    
        }


        if(FiltrosClientes.TipoUsuario=='A')
        {
            this.sFiltros += '&AgenteCodigo=' + FiltrosClientes.Usuario;  
        }

        if(FiltrosClientes.Usuario){
            this.sFiltros += '&Usuario=' + FiltrosClientes.Usuario;    
            }


    if(FiltrosClientes.Status){
    this.sFiltros += '&Status=' + FiltrosClientes.Status;    
    }

    return this._http.get(this.API_URL+this.API + 'catalogos/ListaAgentes.php?'+this.sFiltros,{headers:headers});

    
}


}