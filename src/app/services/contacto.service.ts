import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";


@Injectable()
export class ServicioContacto{
    public url: string;

constructor(
    public _http:HttpClient
){

    console.log(Configuracion.API);
    this.url = Configuracion.API;

    console.log(this.url);

}

addContacto(nuevoContacto: any): Observable<any>{
    let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json');

    return this._http.post(this.url + 'api/contacto',params,{headers:headers});

}


}