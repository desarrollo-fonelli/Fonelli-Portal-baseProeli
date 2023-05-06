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
    public sToken: string;

constructor(
    public _http:HttpClient
    
){

    this.API = Configuracion.API;
    this.sFiltros = '';
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');

}

GetLista(FiltrosClientes: any): Observable<any>{
      let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    .set("Access-Control-Allow-Methods", "GET")
                                    .set("Auth", this.sToken)
                                    .set("Access-Control-Allow-Credentials", "true");

    return this._http.get(this.API + 'catalogos/CatalogoClientes.php?Pagina='+FiltrosClientes.Pagina ,{headers:headers});
}


GetCliente(FiltrosClientes: any): Observable<any>{
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                  .set("Access-Control-Allow-Origin","*")
                                  .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                  .set("Access-Control-Allow-Methods", "GET")
                                  .set("Auth", this.sToken)
                                  .set("Access-Control-Allow-Credentials", "true");

    console.log(FiltrosClientes);
    this.sFiltros = '';   



    if(FiltrosClientes.TipoUsuario)
    {
        this.sFiltros += 'TipoUsuario=' + FiltrosClientes.TipoUsuario;
    }
    
  this.sFiltros += '&Usuario=' + FiltrosClientes.Usuario;
    

  if(FiltrosClientes.TipoUsuario =='A')
  {
      this.sFiltros += '&AgenteCodigo=' + FiltrosClientes.Usuario;
  }


    if(FiltrosClientes.ClienteCodigo)
    {
        this.sFiltros += '&ClienteCodigo=' + FiltrosClientes.ClienteCodigo;
    }

    if(FiltrosClientes.ClienteFilial)
    {
        this.sFiltros += '&ClienteFilial=' + FiltrosClientes.ClienteFilial;
    }
        
  
    
    //this.sFiltros += '&Pagina=' + FiltrosClientes.Pagina;
                              
console.log("resumen filtros:"+this.sFiltros);


  return this._http.get(this.API_URL+this.API + 'catalogos/CatalogoClientes.php?'+this.sFiltros,{headers:headers});
}




}