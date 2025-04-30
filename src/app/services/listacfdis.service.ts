import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { FiltrosListaCFDIS } from '../models/listacfdis.filtros';
import { Pedido } from 'src/app/models/consultapedidos';

@Injectable()
export class ServicioListaCfdis {
    public API: string;
    public API_URL: string;
    public sToken: string;
    public sFiltros: string;

    constructor(
        public _http: HttpClient
    ) {

        this.API = Configuracion.API;
        this.API_URL = environment.API_URL;
        this.sToken = sessionStorage.getItem('token');
        this.sFiltros = '';
    }

    Get(FiltrosListaCFDIS: any): Observable<any> {
        let llamada: string;

        //let params = JSON.stringify(nuevoContacto);
        let headers = new HttpHeaders().set('Content-Type', 'application-json')
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            .set("Access-Control-Allow-Methods", "GET")
            .set("Auth", this.sToken)
            .set("Access-Control-Allow-Credentials", "true");

        this.sFiltros = '';

        if (FiltrosListaCFDIS.TipoUsuario) {
            this.sFiltros += '&TipoUsuario=' + FiltrosListaCFDIS.TipoUsuario;
        }
        if (FiltrosListaCFDIS.ClienteCodigo) {
            this.sFiltros += '&ClienteCodigo=' + FiltrosListaCFDIS.ClienteCodigo;
        }
        if (FiltrosListaCFDIS.ClienteFilial || FiltrosListaCFDIS.ClienteFilial == 0) {
            this.sFiltros += '&ClienteFilial=' + FiltrosListaCFDIS.ClienteFilial;
        }
        if (FiltrosListaCFDIS.FechaInicial) {
            this.sFiltros += '&FechaInic=' + FiltrosListaCFDIS.FechaInicial;
        }
        if (FiltrosListaCFDIS.Pedido) {
            this.sFiltros += '&Pedido=' + FiltrosListaCFDIS.Pedido;
        }

        //if (FiltrosListaCFDIS.Status != 'T') {
        //    this.sFiltros += '&Status=' + FiltrosListaCFDIS.Status;
        //}

        this.sFiltros += '&Usuario=' + FiltrosListaCFDIS.Usuario;

        //console.log('🔸' + this.sFiltros);

        return this._http.get(this.API_URL + this.API + 'reportes/ListaCFDIS.php?' +
            this.sFiltros, { headers: headers });
    }


}