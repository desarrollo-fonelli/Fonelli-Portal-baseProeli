import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";


@Injectable()
export class ServicioContacto{
    public API: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;

}

addContacto(nuevoContacto: any): Observable<any>{
    let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json');

    return this._http.post(this.API + 'contacto',params,{headers:headers});

}


}