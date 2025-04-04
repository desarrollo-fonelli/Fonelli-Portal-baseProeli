import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';

@Injectable()
export class ServicioConsultaGuias {
    public API: string;
    public sFiltros: string;
    public API_URL: string;
    public sToken: string;

    constructor(
        public _http: HttpClient
    ) {
        this.API = Configuracion.API;
        this.sFiltros = '';
        this.API_URL = environment.API_URL;
        this.sToken = sessionStorage.getItem('token');
    }

    Get(FiltrosConsultaGuias: any): Observable<any> {
        let llamada: string;

        //let params = JSON.stringify(nuevoContacto);
        let headers = new HttpHeaders()
            .set('Content-Type', 'application-json')
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            .set("Access-Control-Allow-Methods", "GET")
            .set("Auth", this.sToken)
            .set("Access-Control-Allow-Credentials", "true");

        this.sFiltros = '';
        if (FiltrosConsultaGuias.TipoUsuario) {
            this.sFiltros += 'TipoUsuario=' + FiltrosConsultaGuias.TipoUsuario;
        }
        if (FiltrosConsultaGuias.Usuario) {
            this.sFiltros += '&Usuario=' + FiltrosConsultaGuias.Usuario;
        }

        if (FiltrosConsultaGuias.OficinaDesde && FiltrosConsultaGuias.OficinaDesde.trim() != '') {
            this.sFiltros += '&OficinaDesde=' + FiltrosConsultaGuias.OficinaDesde;
        }
        if (FiltrosConsultaGuias.OficinaHasta) {
            this.sFiltros += '&OficinaHasta=' + FiltrosConsultaGuias.OficinaHasta;
        } else {
            this.sFiltros += '&OficinaHasta=zz';
        }

        if (FiltrosConsultaGuias.ClienteCodigo && FiltrosConsultaGuias.ClienteCodigo != 0) {
            this.sFiltros += '&ClienteCodigo=' + FiltrosConsultaGuias.ClienteCodigo;

            if (FiltrosConsultaGuias.ClienteFilial && FiltrosConsultaGuias.ClienteFilial != 0) {
                this.sFiltros += '&ClienteFilial=' + FiltrosConsultaGuias.ClienteFilial;
            } else {
                this.sFiltros += '&ClienteFilial=0';
            }
        }
        if (FiltrosConsultaGuias.ClteCredito && FiltrosConsultaGuias.ClteCredito != '3') {
            this.sFiltros += '&ClteCredito=' + FiltrosConsultaGuias.ClteCredito;
        }
        if (FiltrosConsultaGuias.Paquete && FiltrosConsultaGuias.Paquete.trim() != '') {
            this.sFiltros += '&Paquete=' + FiltrosConsultaGuias.Paquete;
        }
        if (FiltrosConsultaGuias.FactSerie && FiltrosConsultaGuias.FactSerie.trim() != '') {
            this.sFiltros += '&FactSerie=' + FiltrosConsultaGuias.FactSerie
        }
        if (FiltrosConsultaGuias.Factura && FiltrosConsultaGuias.Factura.trim() != '') {
            this.sFiltros += '&Factura=' + FiltrosConsultaGuias.Factura;
        }
        if (FiltrosConsultaGuias.Remision && FiltrosConsultaGuias.Remision.trim() != '') {
            this.sFiltros += '&Remision=' + FiltrosConsultaGuias.Remision;
        }
        if (FiltrosConsultaGuias.PrefaSerie && FiltrosConsultaGuias.PrefaSerie.trim() != '') {
            this.sFiltros += '&PrefaSerie=' + FiltrosConsultaGuias.PrefaSerie
        }
        if (FiltrosConsultaGuias.Prefactura && FiltrosConsultaGuias.Prefactura.trim() != '') {
            this.sFiltros += '&Prefactura=' + FiltrosConsultaGuias.Prefactura;
        }
        if (FiltrosConsultaGuias.Pedido && FiltrosConsultaGuias.Pedido.trim() != '') {
            this.sFiltros += '&Pedido=' + FiltrosConsultaGuias.Pedido;
        }
        if (FiltrosConsultaGuias.Traspaso && FiltrosConsultaGuias.Traspaso.trim() != '') {
            this.sFiltros += '&Traspaso=' + FiltrosConsultaGuias.Traspaso;
        }
        if (FiltrosConsultaGuias.OrdenRetorno && FiltrosConsultaGuias.OrdenRetorno.trim() != '') {
            this.sFiltros += '&OrdenRetorno=' + FiltrosConsultaGuias.OrdenRetorno;
        }
        if (FiltrosConsultaGuias.Carrier && FiltrosConsultaGuias.Carrier.trim() != '') {
            this.sFiltros += '&Carrier=' + FiltrosConsultaGuias.Carrier;
        }
        if (FiltrosConsultaGuias.OrdenCompra && FiltrosConsultaGuias.OrdenCompra.trim() != '') {
            this.sFiltros += '&OrdenCompra=' + FiltrosConsultaGuias.OrdenCompra;
        }

        // Llama a la API de consulta de guías y devuelve el resultado
        return this._http.get(this.API_URL + this.API + 'reportes/ConsultaGuias.php?' +
            this.sFiltros, { headers: headers });
    }

}