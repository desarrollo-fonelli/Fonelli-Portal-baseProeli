import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { finalize } from 'rxjs/operators';

// Modelos
import { BalanceFiltros } from './modelos/consdir-balance.filtros';
import { BalanceResponse, Seccion } from './modelos/consdir-balance.model';
import { ParidadesResponse, Paridad } from 'src/app/models/paridades.model';

// Servicios
import { ConsdirBalanceService } from './servicios/consdir-balance.service';
import { ParidadesService } from 'src/app/services/paridades.service';
import { FuncFechasService } from 'src/app/core/services/func-fechas.service';
import { FuncStringsService } from 'src/app/core/services/func-strings.service';
import { forEach } from 'jszip';
import { ParidadesContenido } from '../../models/paridades.model';

/*******************************************************************************
 * Clase principal del componente
 */
@Component({
  selector: 'app-consdir-balance',
  templateUrl: './consdir-balance.component.html',
  styleUrls: ['./consdir-balance.component.css'],
  providers: [DecimalPipe, ConsdirBalanceService, ParidadesService,
    FuncFechasService, FuncStringsService]
})
export class ConsdirBalanceComponent implements OnInit {
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

  oBuscar: BalanceFiltros = {
    TipoUsuario: '', Usuario: 0, FechaCorte: '',
    TipoCambioMN: 1, TipoCambioUSD: 0, TipoCambioORO: 0, TipoCambioPLATA: 0,
    Pagina: 1
  };

  oParidFiltros = { TipoUsuario: '', Usuario: 0 };  // sin interface

  oBalanceResponse: BalanceResponse;
  oBalanceSecciones: Seccion[];

  oParidadesResponse: ParidadesResponse;
  oParidadesFilas: Paridad[];

  // // Importe Paridades
  // oParidades = {
  //   TipoCambioMN: 0.00,
  //   TipoCambioUSD: 0.00,
  //   TipoCambioORO: 0.00,
  //   TipoCambioPLATA: 0.00,
  // };

  // Totales columnas del balance
  oTotalesBalance = {
    TotalMN: 0.00,
    TotalUSD: 0.00,
    TotalORO: 0.00,
    TotalPLATA: 0.00,
    TotalGeneral: 0.00
  };

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  //#endregion

  /**
   * Constructor del componente ------------------------------
   */
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private _funcFechasService: FuncFechasService,
    private _funcStringsService: FuncStringsService,
    private _servicioConsdirBalance: ConsdirBalanceService,
    private _servicioParidades: ParidadesService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.bCliente = false;

    this.oBalanceResponse = {} as BalanceResponse;
    this.oBalanceSecciones = [] as Seccion[];
    this.oParidadesResponse = {} as ParidadesResponse;
    this.oParidadesFilas = [] as Paridad[];
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

    this.oParidFiltros.TipoUsuario = this.sTipo;
    this.oParidFiltros.Usuario = this.sCodigo;

    let date: Date = new Date();

    //this.fechaHoy = date.getDate() + '-' + mes + '-' + date.getFullYear();
    this.fechaHoy = this._funcFechasService.fechaHoy_aaaammdd();
    let fechaAyer = this._funcFechasService.obtenerFechaAyer();

    this.oBuscar.FechaCorte = fechaAyer;

    // Inicializa filtros con paridades del día
    this.GetParidades();

  }

  /** --------------------------------------------------------------------------
  * Llama al servicio que hace el request a la API REST para
  * obtener los datos del reporte
  */
  ConsultaBalance() {
    this.sMensaje = '';
    this.bMostrarTabla = false;
    this.bError = false;
    this.isCollapsed = false;
    this.oBalanceSecciones = [] as Seccion[];

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
    this._servicioConsdirBalance.GetConsdirBalance(this.oBuscar)
      .pipe(finalize(() => { this.bCargando = false }))
      .subscribe({
        next: (response: BalanceResponse) => {

          this.oBalanceResponse = response;

          if (this.oBalanceResponse.Codigo == 0) {
            this.bError = false;
            this.sMensaje = '';
            this.isCollapsed = true;

            this.oBalanceSecciones = this.oBalanceResponse.Contenido?.BalanceSecciones || [];
            console.dir(this.oBalanceSecciones);
            //this.CalcTotalVentas();
            this.CalcularTotalesBalance();

            this.bMostrarTabla = true;
            //
          } else {
            this.bError = true;
            this.isCollapsed = false;
            this.sMensaje = this.oBalanceResponse.Mensaje || 'No se obtuvieron datos para los filtros seleccionados';
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

  /**
  * Calcula Gran Total sumando las secciones del Balance
  */
  private CalcularTotalesBalance(): void {

    this.oTotalesBalance = this.oBalanceSecciones.reduce((acc, secc) => {

      const factor = secc.SeccionTipo === 'Activos' ? 1 : -1;

      acc.TotalMN += factor * Number(secc.SeccionMN || 0);
      acc.TotalUSD += factor * Number(secc.SeccionUSD || 0);
      acc.TotalORO += factor * Number(secc.SeccionORO || 0);
      acc.TotalPLATA += factor * Number(secc.SeccionPLATA || 0);
      acc.TotalGeneral += factor * Number(secc.SeccionTotal || 0);

      return acc;

    }, {
      TotalMN: 0,
      TotalUSD: 0,
      TotalORO: 0,
      TotalPLATA: 0,
      TotalGeneral: 0
    });
  }

  /** --------------------------------------------------------------------------
  * Llama al servicio que hace el request a la API REST para
  * obtener los datos del reporte
  */
  GetParidades() {
    this.sMensaje = '';
    //this.bMostrarTabla = false;
    this.bError = false;
    //this.isCollapsed = false;
    this.oParidadesFilas = [] as Paridad[];
    //console.log('🔸Filtros enviados:', this.oParidFiltros);

    this._servicioParidades.GetParidades(this.oParidFiltros)
      .pipe(finalize(() => { this.bCargando = false }))
      .subscribe({
        next: (response: ParidadesResponse) => {

          this.oParidadesResponse = response;
          // console.dir(this.oParidadesResponse);
          // console.dir(this.oParidadesResponse.Contenido);
          // console.dir(this.oParidadesResponse.Contenido.ParidadesFilas);

          if (this.oParidadesResponse.Codigo == 0) {
            this.bError = false;
            this.sMensaje = '';
            //this.isCollapsed = true;

            this.oParidadesFilas = this.oParidadesResponse.Contenido.ParidadesFilas || [];
            //console.log(this.oParidadesFilas);

            for (let paridad of this.oParidadesFilas) {
              if (paridad.Codigo == '1') {
                this.oBuscar.TipoCambioMN = paridad.ValorCapturado;
              }
              if (paridad.Codigo == '2') {
                this.oBuscar.TipoCambioORO = paridad.ValorCapturado;
              }
              if (paridad.Codigo == '3') {
                this.oBuscar.TipoCambioUSD = paridad.ValorCapturado;
              }
              if (paridad.Codigo == '7') {
                this.oBuscar.TipoCambioPLATA = paridad.ValorCapturado;
              }
            }

            //this.bMostrarTabla = true;
            //
          } else {
            this.bError = true;
            //this.isCollapsed = false;
            this.sMensaje = this.oParidadesResponse.Mensaje || 'No se obtuvieron datos para los filtros seleccionados';

            this.oBuscar.TipoCambioMN = 0.00;
            this.oBuscar.TipoCambioUSD = 0.00;
            this.oBuscar.TipoCambioORO = 0.00;
            this.oBuscar.TipoCambioPLATA = 0.00;
          }
        },
        error: (err) => {

          console.error('Error en la petición:', err);

          this.bError = true;
          //this.isCollapsed = false;
          //this.bMostrarTabla = false;

          // Mensaje amigable para UI
          this.sMensaje =
            err?.error?.Mensaje ||
            err?.message ||
            'Ocurrió un error al consultar la información';
        }
      });

  }

}

