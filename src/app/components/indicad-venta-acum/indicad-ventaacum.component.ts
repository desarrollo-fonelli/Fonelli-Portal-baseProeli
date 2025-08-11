import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

//Modelos
import { FiltroIndicadoresVenta } from './modelos/indicadoresventa.filtros'
import { IndicadoresVenta, ImporteVentas } from './modelos/indicadoresventa'
import { FiltrosAgente } from 'src/app/models/agentes.filtros';
import { Agentes, Contenido as AgentesCon } from 'src/app/models/agentes';

//Servicios
import { ServicioIndicadoresVenta } from './servicios/indicadoresventa.service';
import { ServicioAgentes } from 'src/app/services/agentes.service';
import { concat } from 'rxjs';

@Component({
  selector: 'app-indicadventaacum',
  templateUrl: './indicad-ventaacum.component.html',
  styleUrls: ['./indicad-ventaacum.component.css'],
  providers: [DecimalPipe, ServicioAgentes, ServicioIndicadoresVenta],
})
export class IndicadVentaacumComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;

  searchtext = '';

  sCodigo: number | null;
  sTipo: string | null;
  sFilial: number | null;
  sNombre: string | null;

  public bCliente: boolean;

  oBuscar: FiltroIndicadoresVenta;
  oIndVentaRes: IndicadoresVenta;
  oImporteVentasRes: ImporteVentas;

  public bError: boolean = false;
  public sMensaje: string = '';
  bBandera = false;

  fechaHoy: String;

  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  page = 1;
  pageSize = 4;
  collectionSize = 0;
  //countries: Country[];

  closeResult = '';
  public ModalActivo?: NgbModalRef;

  mobileQuery: MediaQueryList;

  public oBuscarAgentes: FiltrosAgente;
  public oAgentes: Agentes;
  public oAgentesCon: AgentesCon[];

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioAgentes: ServicioAgentes,
    private _servicioIndicadoresVenta: ServicioIndicadoresVenta

  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');

    this.oBuscarAgentes = new FiltrosAgente(0, '', 'A', 0, '', '')
    this.oAgentes = {} as Agentes;

    this.bCliente = false;

    //Inicializamos variables consulta pedidos
    this.oBuscar = new FiltroIndicadoresVenta(0, 0, '', 0, '', '');
    this.oIndVentaRes = {} as IndicadoresVenta;

  }

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);

    //Se agrega validacion control de sesion distribuidores
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
      //  console.log("Ya tenemos agentes");
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


  //Funcion para consultar los pedidos
  consultaIndVenta() {

    this.bBandera = false;
    //console.log('consulta indicadores de venta');
    this.bCargando = true;

    //Realizamos llamada al servicio de indicador de ventas
    this._servicioIndicadoresVenta.Get(this.oBuscar).subscribe(
      (Response: IndicadoresVenta) => {
        this.oIndVentaRes = Response

        if (this.oIndVentaRes.Codigo != 0) {
          this.bError = true;
          this.sMensaje = 'No se encontraron datos.';
          this.bBandera = false;
          this.bCargando = false;
          return;
        }

        //console.log("Respuesta : " + JSON.stringify(this.oIndVentaRes));
        // this.oImporteVentasRes = this.oIndVentaRes.Contenido
        this.sMensaje = '';
        this.bBandera = true;
        this.bCargando = false;

        for (var ven of this.oIndVentaRes.Contenido) {
          //lineas
          ven.ImporteVentas.VentaDiariaAux = this.formatoMoneda(ven.ImporteVentas.VentaDiaria);
          ven.ImporteVentas.VentasAcumuladasAux = this.formatoMoneda(ven.ImporteVentas.VentasAcumuladas);
          ven.ImporteVentas.LimiteInferiorAux = this.formatoMoneda(ven.ImporteVentas.LimiteInferior);
          ven.ImporteVentas.DiferenciaLimiteInferiorAux = this.formatoMoneda(ven.ImporteVentas.DiferenciaLimiteInferior);
          ven.ImporteVentas.MinimoAux = this.formatoMoneda(ven.ImporteVentas.Minimo);
          ven.ImporteVentas.DiferenciaMinimoAux = this.formatoMoneda(ven.ImporteVentas.DiferenciaMinimo);
          ven.ImporteVentas.MetaAux = this.formatoMoneda(ven.ImporteVentas.Meta);
          ven.ImporteVentas.DiferenciaMetaAux = this.formatoMoneda(ven.ImporteVentas.DiferenciaMeta);
          ven.ImporteVentas.ImportePedidosAux = this.formatoMoneda(ven.ImporteVentas.ImportePedidos);

          ven.ImporteVentas.DiariaBrutoAux = this.formatoMoneda(ven.ImporteVentas.DiariaBruto);
          ven.ImporteVentas.AcumuladaBrutoAux = this.formatoMoneda(ven.ImporteVentas.AcumuladaBruto);
          ven.ImporteVentas.PedidosBrutoAux = this.formatoMoneda(ven.ImporteVentas.PedidosBruto);
        }

        //Totales generales
        this.oIndVentaRes.TotalVentaDiaria = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'VentaDiaria'));
        this.oIndVentaRes.TotalVentasAcumuladas = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'VentasAcumuladas'));
        this.oIndVentaRes.TotalLimiteInferior = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'LimiteInferior'));
        this.oIndVentaRes.TotalDiferenciaLimiteInferior = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'DiferenciaLimiteInferior'));
        this.oIndVentaRes.TotalMinimo = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'Minimo'));
        this.oIndVentaRes.TotalDiferenciaMinimo = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'DiferenciaMinimo'));
        this.oIndVentaRes.TotalMeta = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'Meta'));
        this.oIndVentaRes.TotalDiferenciaMeta = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'DiferenciaMeta'));
        this.oIndVentaRes.TotalImportePedidos = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'ImportePedidos'));

        this.oIndVentaRes.TotalDiariaBruto = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'DiariaBruto'));
        this.oIndVentaRes.TotalAcumuladaBruto = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'AcumuladaBruto'));
        this.oIndVentaRes.TotalPedidosBruto = this.formatoMoneda(this.getTotalImpVenta(this.oIndVentaRes, 'PedidosBruto'));
      },
      (error: IndicadoresVenta) => {
        this.oIndVentaRes = error;
        this.sMensaje = 'No se encontraron datos';
        console.log('error');
        console.log(this.oIndVentaRes);
        this.bCargando = false;
      }
    );
  }

  // #### Obten totales por SubCategoria ####
  getTotalImpVenta(indVen: IndicadoresVenta, sValor: string): number {
    let Total: number = 0;

    switch (sValor) {
      case 'VentaDiaria': {

        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.VentaDiaria;
        }
        break;
      }
      case 'VentasAcumuladas': {

        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.VentasAcumuladas;
        }
        break;
      }
      case 'LimiteInferior': {

        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.LimiteInferior;
        }
        break;
      }
      case 'DiferenciaLimiteInferior': {

        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.DiferenciaLimiteInferior;
        }
        break;
      }
      case 'Minimo': {

        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.Minimo;
        }
        break;
      }
      case 'DiferenciaMinimo': {

        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.DiferenciaMinimo;
        }
        break;
      }
      case 'Meta': {

        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.Meta;
        }
        break;
      }
      case 'DiferenciaMeta': {

        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.DiferenciaMeta;
        }
        break;
      }
      case 'ImportePedidos': {

        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.ImportePedidos;
        }
        break;
      }
      case 'DiariaBruto': {
        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.DiariaBruto;
        }
        break;
      }
      case 'AcumuladaBruto': {
        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.AcumuladaBruto;
        }
        break;
      }
      case 'PedidosBruto': {
        for (var detCon of indVen.Contenido) {
          Total += detCon.ImporteVentas.PedidosBruto;
        }
        break;
      }
    }

    Total = Number(Total.toFixed(2));
    return Total;
  }
  // #### Obten totales por SubCategoria ####

  formatoMoneda(number) {
    return new Intl.NumberFormat('en-US', { currency: 'USD', maximumFractionDigits: 2 }).format(number);
  };

  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);
  }
}


