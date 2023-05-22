import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';



@Injectable()
export class ServicioConsultaGuiasDet{
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

Get(FiltrosConsultaGuiasDet: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    .set("Access-Control-Allow-Methods", "GET")
                                    .set("Auth", this.sToken)
                                    .set("Access-Control-Allow-Credentials", "true");


                          this.sFiltros='';


                          if(FiltrosConsultaGuiasDet.TipoUsuario)
                          {
                              this.sFiltros += '&TipoUsuario=' + FiltrosConsultaGuiasDet.TipoUsuario;
                          }

                          if(FiltrosConsultaGuiasDet.ClienteCodigo)
                          {
                              this.sFiltros += '&ClienteCodigo=' + FiltrosConsultaGuiasDet.ClienteCodigo;
                          }
                      
                          if(FiltrosConsultaGuiasDet.ClienteFilial || FiltrosConsultaGuiasDet.ClienteFilial==0)
                          {
                              this.sFiltros += '&ClienteFilial=' + FiltrosConsultaGuiasDet.ClienteFilial;
                          }

                          if(FiltrosConsultaGuiasDet.Usuario)
                          {
                            this.sFiltros += '&Usuario=' + FiltrosConsultaGuiasDet.Usuario;
                          }
                     

    return this._http.get(this.API_URL+this.API + 'reportes/DetallePedidosGuias.php?'+this.sFiltros,{headers:headers});
}


}