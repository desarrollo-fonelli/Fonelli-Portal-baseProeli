import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";


@Injectable()
export class ServicioLoginDistribuidor{
    public url: string;

constructor(
    public _http:HttpClient
){

    console.log(Configuracion.API);
    this.url = Configuracion.API;

    console.log(this.url);

}

Login(distribuidor: any): Observable<any>{
    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");

    return this._http.get('fonapi/catalogos/catalogoclientes.php?ClienteCodigo='+ distribuidor.codigo +'&ClienteFilial='+distribuidor.filial+'&Password='+ distribuidor.password,{headers:headers});
}


}