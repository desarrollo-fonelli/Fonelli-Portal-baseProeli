import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";



@Injectable()
export class ServicioRelacionPedido{
    public API: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;

}

Get(FiltrosRelPedido: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    . set("Access-Control-Allow-Methods", "GET")
                                    .set("Access-Control-Allow-Credentials", "true");



    return this._http.get(this.API + 'Reportes/RelacionPedidos.php?'+
                        'OficinaDesde=' +FiltrosRelPedido.OficinaDesde +
                        '&OficinaHasta='  +FiltrosRelPedido.OficinaHasta +
                        '&ClienteDesde=' +FiltrosRelPedido.ClienteDesde +
                        '&FilialDesde=' +FiltrosRelPedido.FilialDesde +
                        '&ClienteHasta=' +FiltrosRelPedido.ClienteHasta +
                        '&Filialhasta='+FiltrosRelPedido.FilialHasta +
                        '&FechaPedidoDesde='+FiltrosRelPedido.FechaPedidoDesde +
                        '&FechaPedidoHasta='+FiltrosRelPedido.FechaPedidoHasta +
                        '&FechaCancelacionDesde='+FiltrosRelPedido.FechaCancelacionDesde +
                        '&FechaCancelacionHasta='+FiltrosRelPedido.FechaCancelacionHasta +
                        '&Estatus='+FiltrosRelPedido.Estatus +
                        '&TipoPedido='+FiltrosRelPedido.TipoPedido +
                        '&TipoOrigen='+FiltrosRelPedido.TipoOrigen +
                        '&Atrasados='+FiltrosRelPedido.Atrasados +
                        '&Pagina='+FiltrosRelPedido.Pagina 
                          ,{headers:headers});
}


}