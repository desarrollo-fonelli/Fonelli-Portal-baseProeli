import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import * as crypto from 'crypto-js';
import { Usuario } from '../models/usuario';




export class LoginAdminAux {
    constructor(
        public usuario :string,
        public password: string    
    ){}
}

@Injectable()
export class ServicioLoginAdmin{
    public API: string;
    public API_URL: string;
    public LoginAdminAux: LoginAdminAux;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.LoginAdminAux = {}  as LoginAdminAux;

}

Login(admin: any): Observable<any>{

    this.LoginAdminAux.usuario = admin.usuario;
    this.LoginAdminAux.password = crypto.SHA256(admin.password).toString();

    let params = JSON.stringify(this.LoginAdminAux);
    
    let headers =  new HttpHeaders().set('Content-Type','application-json');

    const form =  new FormData;

    form.append('DatosForm',params)    

    return this._http.post(this.API_URL+this.API + 'reportes/Login.php',form);
    
}


}