import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioTemplate{
    public API: string;
    public API_URL: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;

}

Get(): Observable<any>{
    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true")
                                    .set("Accept","*/*");

console.log("Llamada");
    return this._http.get(this.API_URL+this.API + 'catalogos/template.php',{headers:headers});
   //return this._http.get("http://localhost:8080/med_fonelli_apiportal/catalogos/template.php",{headers:headers});
}


Update(Datos: FormData): Observable<any>{

     return this._http.post(this.API_URL+this.API + 'catalogos/template.php',Datos);
     //return this._http.post('http://localhost:8080/med_fonelli_apiportal/catalogos/template.php',Datos);
}


}