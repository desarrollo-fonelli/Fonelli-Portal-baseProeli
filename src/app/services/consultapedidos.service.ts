import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";



@Injectable()
export class ServicioConsultaPedidos{
    public API: string;
    public sFiltros: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.sFiltros = '';

}

Get(FiltrosConPedidos: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");



    /*return this._http.get(this.API + 'reportes/ConsultaPedidos.php?'+
                          'ClienteCodigo='+ FiltrosConPedidos. ClienteCodigo +
                          '&ClienteFilial='+ FiltrosConPedidos. ClienteFilial +
                          '&Estatus='+ FiltrosConPedidos.Estatus +
                          '&Pagina='+ FiltrosConPedidos.Pagina,
                          {headers:headers});*/

                          this.sFiltros='';


                          if(FiltrosConPedidos.TipoUsuario)
                          {
                              this.sFiltros += '&TipoUsuario=' + FiltrosConPedidos.TipoUsuario;
                          }


                          if(FiltrosConPedidos.ClienteCodigo)
                          {
                              this.sFiltros += '&ClienteCodigo=' + FiltrosConPedidos.ClienteCodigo;
                          }
                      
                          if(FiltrosConPedidos.ClienteFilial || FiltrosConPedidos.ClienteFilial==0)
                          {
                              this.sFiltros += '&ClienteFilial=' + FiltrosConPedidos.ClienteFilial;
                          }

                          if(FiltrosConPedidos.Status != 'T')
                          {
                              this.sFiltros += '&Status=' + FiltrosConPedidos.Status;
                          }

                     

    return this._http.get(this.API + 'reportes/ConsultaPedidos.php?'+this.sFiltros,{headers:headers});
}


}