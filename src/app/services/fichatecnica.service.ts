import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Configuracion } from "src/app/models/configuraciones";
import { environment } from '../../environments/environment';



@Injectable()
export class ServicioFichaTecnica{
    public API: string;
    public API_URL: string;
    public sToken: string;

constructor(
    public _http:HttpClient
){

    this.API = Configuracion.API;
    this.API_URL = environment.API_URL;
    this.sToken = sessionStorage.getItem('token');

}

Get(FiltrosFichaTecnica: any): Observable<any>{
    let llamada:string;

    //let params = JSON.stringify(nuevoContacto);
    let headers =  new HttpHeaders().set('Content-Type','application-json')
                                    .set("Access-Control-Allow-Origin","*")
                                    .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                                    .set("Access-Control-Allow-Methods", "GET")
                                    .set("Auth", this.sToken)
                                    .set("Access-Control-Allow-Credentials", "true");



    return this._http.get(this.API_URL+this.API_URL+this.API + 'reportes/FichaTecnica.php?'+
                        'TipoUsuario=' + FiltrosFichaTecnica.TipoUsuario +   
                        '&Usuario=' + FiltrosFichaTecnica.Usuario +  
                        '&ClienteCodigo=' + FiltrosFichaTecnica.Cliente +
                        '&FilialDesde=' + FiltrosFichaTecnica.FilialDesde +
                        '&FilialHasta=' + FiltrosFichaTecnica.FilialHasta +
                        '&Fecha1Desde=' + FiltrosFichaTecnica.FechaDesdeAnterior +
                        '&Fecha1Hasta=' + FiltrosFichaTecnica.FechaHastaAnterior +
                        '&Fecha2Desde=' + FiltrosFichaTecnica.FechaDesdeActual +
                        '&Fecha2Hasta=' + FiltrosFichaTecnica.FechaHastaActual 
                          ,{headers:headers});
}


}