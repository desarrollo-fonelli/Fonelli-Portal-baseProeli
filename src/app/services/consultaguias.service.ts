import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';



@Injectable()
export class ServicioConsultaGuias{
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

Get(FiltrosConsultaGuias: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    .set("Access-Control-Allow-Methods", "GET")
                                    .set("Auth", this.sToken)
                                    .set("Access-Control-Allow-Credentials", "true");


                          this.sFiltros='';


                          if(FiltrosConsultaGuias.TipoUsuario)
                          {
                              this.sFiltros += '&TipoUsuario=' + FiltrosConsultaGuias.TipoUsuario;
                          }

                          if(FiltrosConsultaGuias.ClienteCodigo)
                          {
                              this.sFiltros += '&ClienteCodigo=' + FiltrosConsultaGuias.ClienteCodigo;
                          }
                      
                          if(FiltrosConsultaGuias.ClienteFilial || FiltrosConsultaGuias.ClienteFilial==0)
                          {
                              this.sFiltros += '&ClienteFilial=' + FiltrosConsultaGuias.ClienteFilial;
                          }

                          if(FiltrosConsultaGuias.Usuario)
                          {
                            this.sFiltros += '&Usuario=' + FiltrosConsultaGuias.Usuario;
                          }
                     

    return this._http.get(this.API_URL+this.API + 'reportes/ConsultaGuias.php?'+this.sFiltros,{headers:headers});
}


}