import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';

@Injectable()
export class ServicioAlmacenes {
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

    Get(FiltrosAlmacenes: any): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application-json')
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            .set("Access-Control-Allow-Methods", "GET")
            .set("Auth", this.sToken)
            .set("Access-Control-Allow-Credentials", "true");

        //console.log("FiltrosAlmacenes: ", FiltrosAlmacenes);
        this.sFiltros = '';
        if (FiltrosAlmacenes.AlmTipo) {
            this.sFiltros += '&AlmacenTipo=' + FiltrosAlmacenes.AlmTipo;
        }
        //console.log("🔸sFiltros: " + this.sFiltros);

        return this._http.get(this.API_URL + this.API +
            'catalogos/ListaAlmacenes.php?' + this.sFiltros, { headers: headers });
    }


}