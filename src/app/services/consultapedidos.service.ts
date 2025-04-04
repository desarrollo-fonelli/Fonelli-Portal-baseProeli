import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';

@Injectable()
export class ServicioConsultaPedidos {
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

    Get(FiltrosConPedidos: any): Observable<any> {
        let llamada: string;

        //let params = JSON.stringify(nuevoContacto);
        let headers = new HttpHeaders().set('Content-Type', 'application-json')
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            .set("Access-Control-Allow-Methods", "GET")
            .set("Auth", this.sToken)
            .set("Access-Control-Allow-Credentials", "true");

        this.sFiltros = '';


        if (FiltrosConPedidos.TipoUsuario) {
            this.sFiltros += '&TipoUsuario=' + FiltrosConPedidos.TipoUsuario;
        }
        if (FiltrosConPedidos.ClienteCodigo) {
            this.sFiltros += '&ClienteCodigo=' + FiltrosConPedidos.ClienteCodigo;
        }
        if (FiltrosConPedidos.ClienteFilial || FiltrosConPedidos.ClienteFilial == 0) {
            this.sFiltros += '&ClienteFilial=' + FiltrosConPedidos.ClienteFilial;
        }
        if (FiltrosConPedidos.Status != 'T') {
            this.sFiltros += '&Status=' + FiltrosConPedidos.Status;
        }
        this.sFiltros += '&Usuario=' + FiltrosConPedidos.Usuario;


        return this._http.get(this.API_URL + this.API + 'reportes/ConsultaPedidos.php?' +
            this.sFiltros, { headers: headers });
    }


}