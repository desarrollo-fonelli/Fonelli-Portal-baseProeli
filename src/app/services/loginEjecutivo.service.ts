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
    let headers =  new HttpHeaders().set('Content-Type','application-json');

    if(ejecutivo.puesto == 'agente')
    {
        return this._http.get(this.API_URL+this.API + '/agente?codigo='+ejecutivo.codigo +'&password='+ejecutivo.password,{headers:headers});
    }
    else{
        return this._http.get(this.API_URL+this.API + 'gerente?codigo='+ejecutivo.codigo +'&password='+ejecutivo.password,{headers:headers});
    }

   

}


}