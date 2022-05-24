import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";


@Injectable()
export class ServicioLoginEjecutivo{
    public url: string;

constructor(
    public _http:HttpClient
){

    console.log(Configuracion.API);
    this.url = Configuracion.API;

    console.log(this.url);

}

login(ejecutivo: any): Observable<any>{
    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json');

    if(ejecutivo.puesto == 'agente')
    {
        return this._http.get(this.url + 'api/agente?codigo='+ejecutivo.codigo +'&password='+ejecutivo.password,{headers:headers});
    }
    else{
        return this._http.get(this.url + 'api/gerente?codigo='+ejecutivo.codigo +'&password='+ejecutivo.password,{headers:headers});
    }

   

}


}