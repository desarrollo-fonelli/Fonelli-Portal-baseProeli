import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';


@Injectable()
export class ServicioLoginEjecutivo{
    public API: string;
    public API_URL: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;

}

login(ejecutivo: any): Observable<any>{
    //let params = JSON.stringify(nuevoContacto);
    //let headers =  new HttpHeaders().set('Content-Type','application-json');
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");

    if(ejecutivo.puesto == 'Agente')
    {
        console.log("Servicio agente");
        return this._http.get(this.API_URL+this.API + 'catalogos/ListaAgentes.php?AgenteCodigo='+ ejecutivo.codigo +'&Password='+ejecutivo.password,{headers:headers});
    }
    else{
        console.log("Servicio  gerente");
        console.log("url"+this.API_URL);
        console.log("url"+this.API);
        return this._http.get(this.API_URL+this.API + 'catalogos/ListaGerentes.php?GerenteCodigo='+ ejecutivo.codigo +'&Password='+ejecutivo.password,{headers:headers});
    }

    


    
   

}


}