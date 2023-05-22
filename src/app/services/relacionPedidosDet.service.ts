import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioRelacionPedidoDet{
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

Get(FiltrosRelPedido: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    .set("Access-Control-Allow-Methods", "GET")
                                    .set("Auth", this.sToken)
                                    .set("Access-Control-Allow-Credentials", "true");


                    console.log(FiltrosRelPedido);

                    this.sFiltros = '';
    
                        this.sFiltros = 'TipoUsuario=' + FiltrosRelPedido.TipoUsuario;

           
                        this.sFiltros += '&Usuario=' + FiltrosRelPedido.Usuario;
                        

                        
                        //Obligatorios
                        this.sFiltros += '&Usuario=' + FiltrosRelPedido.Usuario;
                        this.sFiltros += '&OficinaDesde=' + FiltrosRelPedido.OficinaDesde;
                        this.sFiltros += '&OficinaHasta=' + FiltrosRelPedido.OficinaHasta;
                        this.sFiltros += '&ClienteDesde=' + FiltrosRelPedido.ClienteDesde;
                        this.sFiltros += '&FilialDesde=' + FiltrosRelPedido.FilialDesde;
                        this.sFiltros += '&ClienteHasta=' + FiltrosRelPedido.ClienteHasta;
                        this.sFiltros += '&FilialHasta=' + FiltrosRelPedido.FilialHasta;
                        this.sFiltros += '&FechaPedidoDesde=' + FiltrosRelPedido.FechaPedidoDesde;
                        this.sFiltros += '&FechaPedidoHasta=' + FiltrosRelPedido.FechaPedidoHasta;
                        this.sFiltros += '&FechaCancelacDesde=' + FiltrosRelPedido.FechaCancelacDesde;
                        this.sFiltros += '&FechaCancelacHasta=' + FiltrosRelPedido.FechaCancelacHasta;
                        

                        if(FiltrosRelPedido.Status !='T')
                        {
                        this.sFiltros += '&Status=' + FiltrosRelPedido.Status;
                        }

                        
                        if(FiltrosRelPedido.TipoPedido!='T')
                        {
                        this.sFiltros += '&TipoPedido=' + FiltrosRelPedido.TipoPedido;
                        }


                        if(FiltrosRelPedido.TipoOrigen !='T')
                        {
                        this.sFiltros += '&TipoOrigen=' + FiltrosRelPedido.TipoOrigen;
                        }


                        if(FiltrosRelPedido.SoloAtrasados !='T')
                        {
                        this.sFiltros += '&SoloAtrasados=' + FiltrosRelPedido.SoloAtrasados;
                        }




                        
                        console.log("Filtros detalle");
                        console.log(this.sFiltros);


                        return this._http.get(this.API_URL+this.API + 'reportes/RelacionPedidosDet.php?'+this.sFiltros,{headers:headers});

}


}