import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// Modelos
import { ConsdirComercialFiltros } from './modelos/consdir-comercial.filtros';
import { ConsdirComercialResponse, GruposDocum, Pedidos } from './modelos/consdir-comercial.model';

// Servicios
import { ConsdirComercialService } from './servicios/consdir-comercial.service';
import { FuncFechasService } from 'src/app/core/services/func-fechas.service';
import { FuncStringsService } from 'src/app/core/services/func-strings.service';



/*******************************************************************************
 * Clase principal del componente
 */
@Component({
  selector: 'app-consdir-comercial',
  templateUrl: './consdir-comercial.component.html',
  styleUrls: ['./consdir-comercial.component.css'],
  providers: [DecimalPipe, ConsdirComercialService, FuncFechasService,
    FuncStringsService, NgbCollapseModule]
})
export class ConsdirComercialComponent implements OnInit {
  //#region Propiedades del componente
  sCodigo: number | null;
  sTipo: string | null;

  isCollapsed = false;
  bCliente: boolean;
  bError: boolean = false;
  sMensaje: string = '';
  bMostrarTabla = false;
  bMostrarDetalle: boolean = false;
  sTextoBotonDetalle: string = 'Mostrar Detalle';
  bCargando: boolean = false;
  fechaHoy: String;
  page = 1;
  pageSize = 4;
  collectionSize = 0;

  oBuscar: ConsdirComercialFiltros = {
    TipoUsuario: '', Usuario: 0, FechaDesde: '', FechaHasta: '', Pagina: 1
  };

  oConsdirComercialResponse: ConsdirComercialResponse;
  oGruposFilas: GruposDocum[];
  oPedidos: Pedidos;

  nTotalVentasImporte: number = 0;
  nTotalVentasValorAgregado: number = 0;
  nGranTotalImporte: number = 0;
  nGranTotalValorAgregado: number = 0;

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
    private _servicioConsdirComercial: ConsdirComercialService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.bCliente = false;

    this.oConsdirComercialResponse = {} as ConsdirComercialResponse;
    this.oGruposFilas = [] as GruposDocum[];
    this.oPedidos = {} as Pedidos;
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

  /********************************************************************************
   * Llama al servicio que hace el request a la API REST para
   * obtener los datos del reporte
   */
  ConsultaComercial() {
    this.sMensaje = '';
    this.bMostrarTabla = false;
    this.bMostrarDetalle = false;
    this.bError = false;
    this.isCollapsed = false;
    this.oGruposFilas = [] as GruposDocum[];

    // En caso necesario, en este espacio se pueden agregar validaciones
    // en los filtros antes de realizar la consulta a la API REST, por ejemplo:
    // if (!this.oBuscar.FechaDesde || !this.oBuscar.FechaHasta) {
    //   this.bError = true;
    //   this.sMensaje = 'Debe ingresar ambas fechas para realizar la consulta';
    //   return;
    // }

    // Carga de datos por medio del servicio
    this.bCargando = true;

    // Llamada al servicio para obtener los datos del reporte
    // y hace transformación de los datos recibidos para adaptarlos a la vista
    this._servicioConsdirComercial.GetConsdirComercial(this.oBuscar)
      .pipe(finalize(() => { this.bCargando = false }))
      .subscribe({
        next: (response: ConsdirComercialResponse) => {

          this.oConsdirComercialResponse = response;

          if (this.oConsdirComercialResponse.Codigo == 0) {
            this.bError = false;
            this.sMensaje = '';
            this.isCollapsed = true;

            this.oGruposFilas = this.oConsdirComercialResponse.Contenido?.GruposFilas || [];
            //console.dir(this.oGruposFilas);
            this.CalcTotalVentas();
            this.oPedidos = this.oConsdirComercialResponse.Contenido?.Pedidos || {} as Pedidos;
            this.CalcGranTotal();

            this.bMostrarTabla = true;
            //
          } else {
            this.bError = true;
            this.isCollapsed = false;
            this.sMensaje = this.oConsdirComercialResponse.Mensaje || 'No se obtuvieron datos para los filtros seleccionados';
          }
        },
        error: (err) => {

          console.error('Error en la petición:', err);

          this.bError = true;
          this.isCollapsed = false;
          this.bMostrarTabla = false;
          this.bMostrarDetalle = false;

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
   * Calcula totales de los documentos de venta
   */
  CalcTotalVentas(): void {
    this.nTotalVentasImporte = this.oGruposFilas.reduce(
      (total, item) => total + Number(item.GrupoImporte), 0
    );

    this.nTotalVentasValorAgregado = this.oGruposFilas.reduce(
      (total, item) => total + Number(item.GrupoValorAgregado), 0
    );
  }

  /**
  * Calcula Gran Total del reporte
  */
  CalcGranTotal(): void {
    this.nGranTotalImporte = this.nTotalVentasImporte + this.oPedidos.Importe;
    this.nGranTotalValorAgregado = this.nTotalVentasValorAgregado + this.oPedidos.ValorAgregado;
  }

  /**
   * Función para mostrar/ocultar detalle de los grupos de documentos
   */
  ToggleDetalle(): void {
    this.bMostrarDetalle = !this.bMostrarDetalle;
    this.sTextoBotonDetalle = this.bMostrarDetalle ? 'Ocultar Detalle' : 'Mostrar Detalle';
  }
}
