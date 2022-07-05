import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';



@Injectable()
export class ServicioDetallePedido{
    public API: string;
    public API_URL: string;
    public sFiltros: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sFiltros = '';

}

Get(FiltrosDetPedido: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");



    /*return this._http.get(this.API + 'Reportes/DetallePedido.php?'+
                          'PedidoLetra='+ FiltrosDetPedido.PedidoLetra +
                          '&PedidoFolio=' + FiltrosDetPedido.PedidoFolio
                          ,{headers:headers});*/

                          this.sFiltros='';

                          

                          this.sFiltros += 'TipoUsuario=' + FiltrosDetPedido.TipoUsuario;
                          this.sFiltros += '&ClienteCodigo=' + FiltrosDetPedido.ClienteCodigo;
                          this.sFiltros += '&ClienteFilial=' + FiltrosDetPedido.ClienteFilial;
                          this.sFiltros += '&PedidoLetra=' + FiltrosDetPedido.PedidoLetra;
                          this.sFiltros += '&PedidoFolio=' + FiltrosDetPedido.PedidoFolio;

                          if(FiltrosDetPedido.Usuario)
                          {
                              this.sFiltros += '&Usuario=' + FiltrosDetPedido.Usuario;
                          }

    return this._http.get(this.API_URL+this.API + 'reportes/DetallePedido.php?'+this.sFiltros,{headers:headers});


}


}