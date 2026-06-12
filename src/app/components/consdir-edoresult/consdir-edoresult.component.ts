import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { finalize } from 'rxjs/operators';

// Modelos
import { EdoResultFiltros } from './modelos/consdir-edoresult.filtros';
import { EdoResultResponse, Seccion } from './modelos/consdir-edoresult.model';

// Servicios
import { ConsdirEdoresultService } from './servicios/consdir-edoresult.service';
import { FuncFechasService } from 'src/app/core/services/func-fechas.service';
import { FuncStringsService } from 'src/app/core/services/func-strings.service';

@Component({
  selector: 'app-consdir-edoresult',
  templateUrl: './consdir-edoresult.component.html',
  styleUrls: ['./consdir-edoresult.component.css'],
  providers: [DecimalPipe, FuncFechasService, FuncStringsService, ConsdirEdoresultService]
})
export class ConsdirEdoresultComponent implements OnInit {

  //#region Propiedades del componente
  sCodigo: number | null;
  sTipo: string | null;

  isCollapsed = false;
  bCliente: boolean;
  bError: boolean = false;
  sMensaje: string = '';
  bMostrarTabla = false;
  bCargando: boolean = false;
  fechaHoy: String;
  page = 1;
  pageSize = 4;
  collectionSize = 0;

  oBuscar: EdoResultFiltros = {
    TipoUsuario: '', Usuario: 0, FechaDesde: '', FechaHasta: '', Pagina: 1
  };

  oEdoResultResponse: EdoResultResponse;
  oEdoResultSecciones: Seccion[];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  //#endregion

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private _funcFechasService: FuncFechasService,
    private _funcStringsService: FuncStringsService,
    private _consdirEdoresultService: ConsdirEdoresultService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.bCliente = false;

    this.oEdoResultResponse = {} as EdoResultResponse;
    this.oEdoResultSecciones = [] as Seccion[];
  }

  /**
  * Inicialización de los elementos del componente
  */
  ngOnInit(): void {
    // se agrega validación control de sesión
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    this.oBuscar.TipoUsuario = this.sTipo;
    if (this.sTipo != 'G') {
      this.sMensaje = 'Usuario no autorizado para acceder a este reporte';
      this._router.navigate(['/']);
    }
    this.oBuscar.Usuario = this.sCodigo;
    this.bCliente = false;

    let date: Date = new Date();

    //this.fechaHoy = date.getDate() + '-' + mes + '-' + date.getFullYear();
    this.fechaHoy = this._funcFechasService.fechaHoy_aaaammdd();
    let fechaAyer = this._funcFechasService.obtenerFechaAyer();
    let primerDiaMes = this._funcFechasService.obtenerPrimerDiaMes(date);

    this.oBuscar.FechaDesde = primerDiaMes;
    this.oBuscar.FechaHasta = fechaAyer;

  }

  /** --------------------------------------------------------------------------
  * Llama al servicio que hace el request a la API REST para
  * obtener los datos del reporte
  */
  ConsultaEdoResult() {
    this.sMensaje = '';
    this.bMostrarTabla = false;
    this.bError = false;
    this.isCollapsed = false;
    this.oEdoResultSecciones = [] as Seccion[];

    // En caso necesario, en este espacio se pueden agregar validaciones
    // en los filtros antes de realizar la consulta a la API REST, por ejemplo:
    // if (!this.oBuscar.FechaDesde || !this.oBuscar.FechaHasta) {
    //   this.bError = true;
    //   this.sMensaje = 'Debe ingresar ambas fechas para realizar la consulta';
    //   return;
    // }

    // Carga de datos por medio del servicio
    this.bCargando = true;

    console.log('🔸Filtros enviados:', this.oBuscar);

    // Llamada al servicio para obtener los datos del reporte
    // y hace transformación de los datos recibidos para adaptarlos a la vista
    this._consdirEdoresultService.GetConsdirEdoResult(this.oBuscar)
      .pipe(finalize(() => { this.bCargando = false }))
      .subscribe({
        next: (response: EdoResultResponse) => {

          this.oEdoResultResponse = response;

          if (this.oEdoResultResponse.Codigo == 0) {
            this.bError = false;
            this.sMensaje = '';
            this.isCollapsed = true;

            this.oEdoResultSecciones = this.oEdoResultResponse.Contenido?.EdoResultSecciones || [];
            console.dir(this.oEdoResultSecciones);
            //this.CalcularTotalesEdoResult();   todavia no existe esta funcion

            this.bMostrarTabla = true;
            //
          } else {
            this.bError = true;
            this.isCollapsed = false;
            this.sMensaje = this.oEdoResultResponse.Mensaje || 'No se obtuvieron datos para los filtros seleccionados';
          }
        },
        error: (err) => {

          console.error('Error en la petición:', err);

          this.bError = true;
          this.isCollapsed = false;
          this.bMostrarTabla = false;

          // Mensaje amigable para UI
          this.sMensaje =
            err?.error?.Mensaje ||
            err?.message ||
            'Ocurrió un error al consultar la información';
        }
      });


  }

  /**
  * Formatea un texto a Title Case utilizando el servicio FuncStringsService
  * @param texto 
  * @returns 
  */
  FormatoTitleCase(texto: string): string {
    return this._funcStringsService.toTitleCase(texto);
  }


}
