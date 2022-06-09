import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";



@Injectable()
export class ServicioOficinas{
    public API: string;
    public sFiltros: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.sFiltros = '';


}

Get(FiltrosOficinas: any): Observable<any>{
    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");


                                    console.log(FiltrosOficinas);
  
            
                                    if(FiltrosOficinas.OficinaCodigo)
                                    {
                                        this.sFiltros += 'OficinaCodigo=' + FiltrosOficinas.OficinaCodigo;
                                    }
                                    if(FiltrosOficinas.Pagina)
                                    {
                                        this.sFiltros += '&Pagina' + FiltrosOficinas.Pagina;
                                    }

                                    console.log(this.sFiltros);


                        return this._http.get(this.API + 'catalogos/OficinasFonelli.php?'+this.sFiltros,{headers:headers});
            
            


    //return this._http.get(this.API + 'catalogos/OficinasFonelli.php',{headers:headers});
}


}