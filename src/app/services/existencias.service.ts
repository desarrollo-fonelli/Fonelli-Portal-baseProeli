import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';
import { FiltrosExistencias } from "../models/existencias.filtros";

@Injectable()
export class ServicioExistencias {
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

    Get(FiltrosExist: FiltrosExistencias): Observable<any> {
        let llamada: string;

        //let params = JSON.stringify(nuevoContacto);
        let headers = new HttpHeaders().set('Content-Type', 'application-json')
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            .set("Access-Control-Allow-Methods", "GET")
            .set("Auth", this.sToken)
            .set("Access-Control-Allow-Credentials", "true");

        let zeroAlmacDesde = FiltrosExist.AlmacDesde.replace(/ /g, '0');    // reemplaza espacios con ceros
        let zeroAlmacHasta = FiltrosExist.AlmacHasta.replace(/ /g, '0');

        this.sFiltros = '';
        this.sFiltros += '&TipoUsuario=' + FiltrosExist.TipoUsuario;
        this.sFiltros += '&Usuario=' + FiltrosExist.Usuario;
        this.sFiltros += '&OficinaDesde=' + FiltrosExist.OficinaDesde;
        this.sFiltros += '&OficinaHasta=' + FiltrosExist.OficinaHasta;
        this.sFiltros += '&LineaPTDesde=' + FiltrosExist.LineaPTDesde;
        this.sFiltros += '&LineaPTHasta=' + FiltrosExist.LineaPTHasta;
        //this.sFiltros += '&AlmacDesde=' + FiltrosExist.AlmacDesde;
        //this.sFiltros += '&AlmacHasta=' + FiltrosExist.AlmacHasta;
        this.sFiltros += '&AlmacDesde=' + zeroAlmacDesde;
        this.sFiltros += '&AlmacHasta=' + zeroAlmacHasta;

        if (FiltrosExist.SoloExist) {
            if (FiltrosExist.SoloExist == 'S') {
                this.sFiltros += '&SoloExist=' + FiltrosExist.SoloExist;
            }
        }

        //console.log(this.sFiltros);

        return this._http.get(this.API_URL + this.API + 'reportes/ExistenciasPT.php?' +
            this.sFiltros, { headers: headers });
    }
}