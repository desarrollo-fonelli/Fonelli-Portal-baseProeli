import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';


@Injectable()
export class ServicioLoginDistribuidor{
    public API: string;
    public API_URL: string;
    public sToken: string;

constructor(
    public _http:HttpClient,
    //public _httpHeaders:HttpHeaders
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');

}

Login(Datos: FormData): Observable<any>{           
    return this._http.post(this.API_URL+this.API +'reportes/Login.php',Datos);    
}

ObtenRazon(cliente: any,auth: any): Observable<any>{           
      let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    .set("Access-Control-Allow-Methods", "GET")
                                    .set("Auth", auth )
                                    .set("Access-Control-Allow-Credentials", "true");

                                    return this._http.get(this.API_URL+this.API +'catalogos/CatalogoClientes.php?ClienteCodigo='+ cliente.codigo +'&ClienteFilial='+cliente.filial+'&TipoUsuario='+ cliente.TipoUsuario+'&Usuario='+ cliente.Usuario,{headers:headers});
}


}

function get_headers(arg0: Observable<Object>): any {
    throw new Error("Function not implemented.");
}
