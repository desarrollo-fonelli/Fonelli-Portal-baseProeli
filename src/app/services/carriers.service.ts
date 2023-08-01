import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioCarriers{
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

GetCarrier(): Observable<any>{
      let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    .set("Access-Control-Allow-Methods", "GET")
                                    .set("Auth", this.sToken)
                                    .set("Access-Control-Allow-Credentials", "true");

    return this._http.get(this.API + 'catalogos/CatalogoCarries.php' ,{headers:headers});
}


}