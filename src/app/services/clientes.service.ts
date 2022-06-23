import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioClientes{
    public API: string;
    public sFiltros: string;
    public API_URL: string;

constructor(
    public _http:HttpClient
    
){

    this.API = Configuracion.API;
    this.sFiltros = '';
    this.API_URL = environment.API_URL;

}

GetLista(FiltrosClientes: any): Observable<any>{
      let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");

    return this._http.get(this.API + 'catalogos/catalogoclientes.php?Pagina='+FiltrosClientes.Pagina ,{headers:headers});
}


GetCliente(FiltrosClientes: any): Observable<any>{
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                  .set("Access-Control-Allow-Origin","*")
                                  .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                  . set("Access-Control-Allow-Methods", "GET")
                                  .set("Access-Control-Allow-Credentials", "true");

    console.log(FiltrosClientes);
    
                                  this.sFiltros = 'Pagina=' + FiltrosClientes.Pagina;

    if(FiltrosClientes.ClienteCodigo)
    {
        this.sFiltros += '&ClienteCodigo=' + FiltrosClientes.ClienteCodigo;
    }

    if(FiltrosClientes.ClienteFilial)
    {
        this.sFiltros += '&ClienteFilial=' + FiltrosClientes.ClienteFilial;
    }



    if(FiltrosClientes.Usuario != -1)
    {
        this.sFiltros +='&Usuario=' + FiltrosClientes.Usuario;
    }

                              
console.log(this.sFiltros);


  return this._http.get(this.API_URL+this.API + 'catalogos/catalogoclientes.php?'+this.sFiltros,{headers:headers});
}




}