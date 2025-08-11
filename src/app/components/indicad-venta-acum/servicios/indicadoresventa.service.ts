import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from 'src/environments/environment';

@Injectable()
export class ServicioIndicadoresVenta {
    public API: string;
    public API_URL: string;
    public sToken: string;

    constructor(
        public _http: HttpClient
    ) {
        this.API = Configuracion.API;
        this.API_URL = environment.API_URL;
        this.sToken = sessionStorage.getItem('token');
    }

    Get(FiltroIndicadoresVenta: any): Observable<any> {
        let llamada: string;

        //let params = JSON.stringify(nuevoContacto);
        let headers = new HttpHeaders().set('Content-Type', 'application-json')
            .set("Access-Control-Allow-Origin", "*")
            .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            .set("Access-Control-Allow-Methods", "GET")
            .set("Auth", this.sToken)
            .set("Access-Control-Allow-Credentials", "true");

        return this._http.get(this.API_URL + this.API + 'reportes/IndicadVentaAcum.php?' +
            'AgenteDesde=' + FiltroIndicadoresVenta.AgenteDesde +
            '&AgenteHasta=' + FiltroIndicadoresVenta.AgenteHasta +
            '&FechaCorte=' + FiltroIndicadoresVenta.FechaCorte +
            '&TipoUsuario=' + FiltroIndicadoresVenta.TipoUsuario +
            '&Usuario=' + FiltroIndicadoresVenta.Usuario,
            { headers: headers });
    }

}