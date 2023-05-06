import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';


@Injectable()
export class ServicioContacto{
    public API: string;
    public API_URL: string;
    public sToken: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');

}

addContacto(nuevoContacto: any): Observable<any>{

    let params = JSON.stringify(nuevoContacto);

    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Auth", this.sToken);



    const form =  new FormData;

    form.append('DatosForm',params)

    return this._http.post(this.API_URL+this.API + 'reportes/Contacto.php',form);



}


}