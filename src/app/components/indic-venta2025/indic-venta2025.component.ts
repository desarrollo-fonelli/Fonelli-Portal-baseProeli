import {
  Component, OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

// Modelos
import { IndicVentaFiltros } from './modelos/indic-venta.filtros'
import { IndicVentaResponse, IndicadorAgente } from './modelos/indic-venta';
import { FiltrosAgente } from 'src/app/models/agentes.filtros';
import { Agentes, Contenido as AgentesCon } from 'src/app/models/agentes';

// Servicios
import { IndicVentaService } from './servicios/indic-venta.service';
import { ServicioAgentes } from 'src/app/services/agentes.service';

/*******************************************************************************
 * Clase principal del componente
 */
@Component({
  selector: 'app-indic-venta2025',
  templateUrl: './indic-venta2025.component.html',
  styleUrls: ['./indic-venta2025.component.css'],
  providers: [DecimalPipe,
    ServicioAgentes, IndicVentaService]
})
export class IndicVenta2025Component implements OnInit {

  sCodigo: number | null;
  sTipo: string | null;
  sFilial: number | null;
  sNombre: string | null;

  isCollapsed = false;
  bCliente: boolean;
  bError: boolean = false;
  sMensaje: string = '';
  bMostrarTabla = false;
  bMostrarMovil = false;
  bCargando: boolean = false;
  fechaHoy: String;
  page = 1;
  pageSize = 4;
  collectionSize = 0;

  oBuscarAgentes: FiltrosAgente;
  oAgentes: Agentes;
  oAgentesCon: AgentesCon[];

  oBuscar: IndicVentaFiltros;
  oIndicVentaResponse: IndicVentaResponse;
  oIndicadoresVenta: IndicadorAgente[];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  // ***************************************************************************
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioAgentes: ServicioAgentes,
    private _servicioIndicVenta: IndicVentaService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');
    this.bCliente = false;

    this.oBuscarAgentes = new FiltrosAgente(0, '', 'A', 0, '', '');
    this.oAgentes = {} as Agentes;

    this.oBuscar = {
      TipoUsuario: '', Usuario: 0, AgenteDesde: 1,
      AgenteHasta: 99, FechaCorte: '', Pagina: 1
    };

    this.oIndicVentaResponse = {} as IndicVentaResponse;
    this.oIndicadoresVenta = [];

  }

  //****************************************************************************
  ngOnInit(): void {
    // se agrega validación control de sesión distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    switch (this.sTipo) {
      case 'A': {
        //Agente; 
        this.oBuscar.AgenteDesde = this.sCodigo;
        this.oBuscar.AgenteHasta = this.sCodigo;
        this.bCliente = false;
        this.oBuscarAgentes.Status = "A";

        break;
      }
      default: {
        //Gerente; 
        this.oBuscar.AgenteDesde = 1;
        this.oBuscar.AgenteHasta = 99;
        this.bCliente = false;
        this.oBuscarAgentes.Status = "G";
        break;
      }
    }

    let date: Date = new Date();
    let mes;

    //Valida mes
    if ((date.getMonth() + 1).toString().length == 1) {
      mes = '0' + (date.getMonth() + 1);
    } else {
      mes = (date.getMonth() + 1);
    }

    this.fechaHoy = date.getDate() + '-' + mes + '-' + date.getFullYear();

    let fechaAyer: string;
    //validacion dia anterior inicio de mes
    if (date.getDate() == 1) {//es inicio de mes
      if (mes == '01') {
        mes = '12';
        fechaAyer = (date.getFullYear() - 1) + '-' + mes + '-' + '31';
      } else {
        mes = mes - 1;
        if (mes < 10) {
          fechaAyer = (date.getFullYear()) + '-0' + mes + '-' + '31';
        } else {
          fechaAyer = (date.getFullYear()) + '-' + mes + '-' + '31';
        }
      }
    } else {

      fechaAyer = (date.getFullYear()) + '-' + mes + '-' + (date.getDate().toString().length == 1 ? '0' + (date.getDate() - 1) : (date.getDate() - 1).toString().length == 1 ? '0' + (date.getDate() - 1) : date.getDate() - 1);
    }
    this.oBuscar.FechaCorte = fechaAyer;

    //Consulta agentes
    if (!sessionStorage.getItem('Agentes')) {
      this.oBuscarAgentes.TipoUsuario = sessionStorage.getItem('tipo');
      if (sessionStorage.getItem('tipo') == 'C') {
        this.oBuscarAgentes.Usuario = sessionStorage.getItem('codigo') + '-' + sessionStorage.getItem('filial');
      }
      else {
        this.oBuscarAgentes.Usuario = sessionStorage.getItem('codigo');
      }
      this.oBuscarAgentes.Status = "A";

      this._servicioAgentes
        .Get(this.oBuscarAgentes)
        .subscribe(
          (Response: Agentes) => {
            this.oAgentes = Response;
            if (this.oAgentes.Codigo != 0) {
              //this.bError= true;
              //this.sMensaje="No se encontraron agentes";   
              return false;
            }
            this.oAgentesCon = this.oAgentes.Contenido;
            sessionStorage.setItem('Agentes', JSON.stringify(this.oAgentesCon));
            return true;
          },
          (error: Agentes) => {
            this.oAgentes = error;
            console.log("error");
            console.log(this.oAgentes);
            return false;
          }
        );

    } else {//Ya tenemos agentes
      this.oAgentesCon = JSON.parse(sessionStorage.getItem('Agentes'));

      if (this.sTipo == 'A') {
        this.oBuscar.AgenteDesde = this.sCodigo;
        this.oBuscar.AgenteHasta = this.sCodigo;
        this.oBuscar.TipoUsuario = sessionStorage.getItem('tipo');
        this.oBuscar.Usuario = sessionStorage.getItem('codigo');
      } else {
        this.oBuscar.AgenteDesde = Number(this.oAgentesCon[0].AgenteCodigo);
        this.oBuscar.AgenteHasta = Number(this.oAgentesCon[this.oAgentesCon?.length - 1].AgenteCodigo);
        this.oBuscar.TipoUsuario = sessionStorage.getItem('tipo');
        this.oBuscar.Usuario = sessionStorage.getItem('codigo');
      }
    }

  }

  /*****************************************************************************
   * Llama el servicio que hace el request a la API REST para obtener
   * los indicadores de venta
   */
  CreaIndicVenta() {

    this.sMensaje = '';
    this.bMostrarTabla = false;
    this.bMostrarMovil = false;
    this.isCollapsed = false;
    this.bCargando = false;
    this.oIndicadoresVenta = [];

    // aqui pueden ir las comprobaciones en los criterios de filtro
    // antes de llamar el servicio

    this.bCargando = true;

    this._servicioIndicVenta.CreaIndicadores(this.oBuscar).subscribe(
      (response: IndicVentaResponse) => {
        this.oIndicVentaResponse = response;

        if (this.oIndicVentaResponse.Codigo != 0) {
          this.sMensaje = 'No se encontraron Prepedidos';
          this.bCargando = false;
          this.isCollapsed = false;
          return;
        }

        this.oIndicadoresVenta = this.oIndicVentaResponse.Contenido.IndicadoresVenta;
        //console.dir(this.oIndicadoresVenta);

        this.sMensaje = '';
        this.bCargando = false;
        this.isCollapsed = true;
        this.bMostrarTabla = true;
      },
      (error: IndicVentaResponse) => {
        this.oIndicVentaResponse = error;
        this.bCargando = false;
        this.sMensaje = 'Error recuperando registros...';
        console.log('🔸 --> Error al buscar artículos', error);
      }
    );

  }

  /*****************************************************************************
   * Devuelve una string con decimales o sin ellos, según el código del indicador
   * Los indicadores 4 y 5 no llevan decimales
   */
  FormatearImporteIndicador(indicadId: number, importe: number): string {

    if (indicadId == 4 || indicadId == 5) {
      return importe.toString();
    } else {
      //return importe.toFixed(2);
      return new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(importe);
    }
  }

  /**
  * Determina el color de fondo de la tarjeta principal según la eficiencia general del agente.
  * @param eficiencia El porcentaje de eficiencia general del agente (age.AgteEficienc).
  * @returns Una cadena de clases CSS de Bootstrap para el color de fondo.
  */
  getCardClass(eficiencia: number): string {
    if (eficiencia >= 80) {
      return 'border-success'; // Borde verde para los mejores
    } else if (eficiencia >= 60) {
      return 'border-primary'; // Borde azul para buen rendimiento
    } else if (eficiencia >= 50) {
      return 'border-warning'; // Borde amarillo para rendimiento regular
    } else {
      return 'border-danger';  // Borde rojo para bajo rendimiento
    }
  }

  /**
   * Determina el color del texto del porcentaje de cumplimiento para un indicador específico.
   * @param cumplimiento El porcentaje de cumplimiento del indicador (indic.PorcCump).
   * @returns Una cadena de clases CSS de Bootstrap para el color del texto.
   */
  getComplianceClass(cumplimiento: number): string {
    if (cumplimiento >= 80) {
      return 'text-success'; // Verde
    } else if (cumplimiento >= 60) {
      return 'text-primary'; // Azul
    } else if (cumplimiento >= 50) {
      return 'text-warning'; // Amarillo
    } else {
      return 'text-danger';  // Rojo
    }
  }

  alternarTablas(cualMostrar: string) {
    if (cualMostrar == 'Escritorio') {
      this.bMostrarTabla = true;
      this.bMostrarMovil = false;
    } else {
      this.bMostrarTabla = false;
      this.bMostrarMovil = true;
    }
  }

}

