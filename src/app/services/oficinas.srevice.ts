import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioOficinas{
    public API: string;
    public sFiltros: string;
    public API_URL: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.sFiltros = '';
    this.API_URL = environment.API_URL;


}

Get(FiltrosOficinas: any): Observable<any>{
    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");


                                    console.log(FiltrosOficinas);

                                    this.sFiltros = '';
  
            
                                    if(FiltrosOficinas.OficinaCodigo)
                                    {
                                        this.sFiltros += 'OficinaCodigo=' + FiltrosOficinas.OficinaCodigo;
                                    }
                                    if(FiltrosOficinas.Pagina)
                                    {
                                        this.sFiltros += '&Pagina' + FiltrosOficinas.Pagina;
                                    }

                                    console.log(this.sFiltros);


                        return this._http.get(this.API_URL+this.API + 'catalogos/OficinasFonelli.php?'+this.sFiltros,{headers:headers});
            
            


    //return this._http.get(this.API + 'catalogos/OficinasFonelli.php',{headers:headers});
}


}