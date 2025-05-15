import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
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
import { FiltrosClientes } from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';
import { PedclteListaFiltros } from 'src/app/models/pedclte-lista.filtros';
//import { PedclteLista, FilaPedido, ContenidoPedclteLista } from 'src/app/models/pedclte-lista';
import { ConsultaPedido, Pedido, Contenido as ConPed } from 'src/app/models/pedclte-lista';

// Servicios
import { ServicioClientes } from 'src/app/services/clientes.service';
import { PedclteListaService } from 'src/app/services/pedclte-lista.service';

// Datatables
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

// --------------------------------------------------- detalle de pedidos
import { FiltrosPedclteDetalle } from 'src/app/models/pedclte-detalle.filtros';
import { PedclteDetalle } from 'src/app/models/pedclte-detalle';
import { PedclteDetalleService } from 'src/app/services/pedclte-detalle.service';
import { PedidoArticulo } from 'src/app/models/pedclte-detalle';
import { PedclteMedidasComponent } from '../pedclte-medidas/pedclte-medidas.component';
import { PedclteGuias, PedidoGuia } from 'src/app/models/pedclte-guias';
import { PedclteGuiasService } from '../../services/pedclte-guias.service';
// ---------------------------------------------------


/**
 * Clase principal del Componente
 */
@Component({
  selector: 'app-pedclte-lista',
  templateUrl: './pedclte-lista.component.html',
  styleUrls: ['./pedclte-lista.component.css'],
  providers: [DecimalPipe, ServicioClientes,
    PedclteListaService,
    PedclteDetalleService,
    PedclteGuiasService]
})
export class PedclteListaComponent implements OnInit, OnDestroy {
  @ViewChild('pdfTable') pdfTable: ElementRef;

  searchtext = '';
  sCodigo: number | null;
  sTipo: string | null;
  sFilial: number | null;
  sNombre: string | null;
  sWidth: number;
  sHeight: number;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public isCollapsed = false;
  public bCliente: boolean;
  public bError: boolean = false;
  public sMensaje: string = '';
  bBandera = false;   // indica si se muestra la tabla con la lista de pedidos
  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;
  public ModalActivo?: NgbModalRef;
  mobileQuery: MediaQueryList;

  fechaHoy: String;
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  closeResult = '';

  oFiltros: PedclteListaFiltros;
  oPedclteListaResult: ConsultaPedido;
  // oFilaPedido: FilaPedido[];
  pedido: Pedido[];

  public Buscar: FiltrosClientes;
  public oCliente: Clientes;
  public oContenido: Contenido;
  public oCondiciones: Condiciones;
  public oDatosGenerales: DatosGenerales;
  public oContacto: Contactos;

  private _mobileQueryListener: () => void;

  // ------------------------------------------------------- detalle de pedidos
  public MostrarArticulos: boolean = false;
  public oFiltrosPedclteDetalle: FiltrosPedclteDetalle;
  public oPedclteDetalleResult: PedclteDetalle;
  public pedidoDet: PedidoArticulo[];
  public pedidoGuias: PedidoGuia[];
  public oPedclteGuiasResult: PedclteGuias;

  sPedidoFolio: string;
  sPedidoFecha: string;

  // -------------------------------------------------------

  /**
   * Constructor de la clase
   * @param cangeDetectorRef 
   * @param media 
   * @param modalService 
   * @param _route 
   * @param _router 
   * @param _servicioCClientes 
   * @param _pedclteListaService 
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private modalService: NgbModal,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioCClientes: ServicioClientes,
    private _pedclteListaService: PedclteListaService,
    private _pedclteDetalleService: PedclteDetalleService,
    private _pedclteGuiasService: PedclteGuiasService

  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');
    this.bCliente = false;

    // Consulta de clientes
    this.Buscar = new FiltrosClientes(0, 0, 0, '', 0);
    this.oCliente = {} as Clientes;
    this.oContenido = {} as Contenido;
    this.oCondiciones = {} as Condiciones;
    this.oDatosGenerales = {} as DatosGenerales;
    this.oContacto = {} as Contactos;

    // Consulta lista de pedidos
    this.oFiltros = new PedclteListaFiltros('', 0, 0, 0, 0, '', '');
    this.oPedclteListaResult = {} as ConsultaPedido;
    this.oPedclteListaResult.Contenido = {} as ConPed;
    //this.oFilaPedido = [];
    this.pedido = [];

    // Consulta detalle de pedidos ------------------------
    this.oFiltrosPedclteDetalle = new FiltrosPedclteDetalle('', 0, '', 0, 0, 0);
    this.oPedclteDetalleResult = {} as PedclteDetalle;
    this.pedidoDet = [];
    this.oPedclteGuiasResult = {} as PedclteGuias;
    this.pedidoGuias = [];
    // ----------------------------------------------------

    this.refreshCountries();

  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [],
      ordering: false,
      dom: 'flBtip',
      language: { url: "cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json" },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Consulta de Pedidos',
          text: '<p style="color: #f9f9f9; height: 9px;">Excel</p>',
          className: 'btnExcel btn',
        }
      ]
    };

    this.mobileQuery.removeListener(this._mobileQueryListener);

    // se agrega validación control de sesión distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    switch (this.sTipo) {
      case 'C': {
        //Tipo cliente                  
        this.bCliente = true;
        this.oFiltros.Usuario = this.sCodigo + '-' + this.sFilial;
        this.oFiltros.ClienteCodigo = this.sCodigo;
        this.oFiltros.ClienteFilial = this.sFilial;
        break;
      }
      case 'A': {
        //Agente; 
        this.bCliente = false;
        this.oFiltros.Usuario = this.sCodigo;
        break;
      }
      default: {
        //Gerente; 
        this.bCliente = false;
        this.oFiltros.Usuario = this.sCodigo;
        break;
      }
    }

    this.oFiltros.PedidoBuscar = 0;
    this.oFiltros.OrdCompBuscar = '';
    this.oFiltros.Status = 'A';

    this.Buscar.TipoUsuario = this.sTipo;
    this.Buscar.Usuario = this.sCodigo;

    let date: Date = new Date();
    let mes;

    //Valida mes
    if (date.getMonth().toString.length == 1) {
      mes = '0' + (date.getMonth() + 1);
    }
    this.fechaHoy = date.getDate() + '-' + mes + '-' + date.getFullYear();


    //Realizamos llamada al servicio de clientes 
    if (!sessionStorage.getItem('Clientes')) {

      //console.log("no tenemos  Clientes");

      this._servicioCClientes
        .GetCliente(this.Buscar)
        .subscribe(
          (Response: Clientes) => {
            this.oCliente = Response;
            //console.log("Respuesta cliente" + JSON.stringify(this.oCliente));
            if (this.oCliente.Codigo != 0) {
              return false;
            }

            sessionStorage.setItem('Clientes', JSON.stringify(this.oCliente));

            this.oContenido = this.oCliente.Contenido[0];
            this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
            this.oDatosGenerales = this.oCliente.Contenido[0].DatosGenerales;
            this.oContacto = this.oCliente.Contenido[0].Contactos;
            return true;
          },
          (error: Clientes) => {
            this.oCliente = error;
            console.log(this.oCliente);
            return false;
          }

        );
      //console.log("Termina carga Clientes");

    } else {
      //console.log("Ya tenemos  Clientes");
      this.oCliente = JSON.parse(sessionStorage.getItem('Clientes'));
      this.oContenido = this.oCliente.Contenido[0];
      this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
      this.oDatosGenerales = this.oCliente.Contenido[0].DatosGenerales;
      this.oContacto = this.oCliente.Contenido[0].Contactos;
    }

  }

  /**
   * Función que controla la consulta para obtener la Lista de Pedidos
   */
  ListaPedidos() {

    this.oFiltros.TipoUsuario = this.sTipo;
    if (this.oFiltros.ClienteCodigo == 0) {
      return;
    }

    this.bBandera = false;
    this.bCargando = true;

    // Llamada al servicio que obtiene la lista de pedidos
    this._pedclteListaService.Get(this.oFiltros).subscribe(
      (Response: ConsultaPedido) => {
        this.oPedclteListaResult = Response;
        //this.oFilaPedido = this.oPedclteListaResult.Contenido.ListaPedidos;
        this.pedido = this.oPedclteListaResult.Contenido.Pedidos;

        //this.refreshCountries();

        if (this.oPedclteListaResult.Codigo != 0) {
          this.bError = true;
          this.sMensaje = "No se encontraron pedidos";
          this.bBandera = false;
          this.bCargando = false;
          return;
        }

        console.dir(this.pedido);

        this.oPedclteListaResult.Contenido.CantidadPedida =
          this.getTotal(this.pedido, 'CantidadPedida');
        this.oPedclteListaResult.Contenido.DiferenciaPedidosSurtido =
          this.getTotal(this.pedido, 'DiferenciaPedidosSurtido');

        this.sMensaje = '';
        this.bBandera = true;
        this.bCargando = false;
        this.isCollapsed = true;


        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // destruye la tabla primero
          dtInstance.destroy();
          // llama el dtTrigger para renderizar otra vez
          this.dtTrigger.next("");
        });

      },
      (error: ConsultaPedido) => {
        this.oPedclteListaResult = error;
        this.sMensaje = 'No se encontraron pedidos';
        console.log("error");
        console.log(this.oPedclteListaResult);
        this.bCargando = false;
        return;
      }
    );

  }

  /**
   * Modal para Lista de Clientes
   */
  openClientes(Clientes: any) {
    this.bCargandoClientes = true;
    var result;

    try {
      result = true;

      if (result) {
        this.ModalActivo = this.modalService.open(Clientes,
          {
            ariaLabelledBy: 'Clientes',
            size: 'xl',
            scrollable: true
          }
        );

        this.ModalActivo.result.then(
          (result) => { },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log('reason: ' + reason);
            this.Buscar = new FiltrosClientes(0, 0, 0, '', 0);
          }
        )
      }

      this.bCargandoClientes = false;

    } catch (error) {

    }
  }

  /**
   * Funcion para seleccionar cliente
   * @param sCodigo 
   * @param sFilial 
   */
  obtenCliente(sCodigo: string, sFilial: string) {

    this.oFiltros.ClienteCodigo = Number(sCodigo);
    this.oFiltros.ClienteFilial = Number(sFilial);

    this.ModalActivo.dismiss('Cross click');
  }

  /**
   * Busca clientes
   * @returns 
   */
  BuscaClientes(): boolean {

    this._servicioCClientes
      .GetCliente(this.Buscar)
      .subscribe(
        (Response: Clientes) => {

          this.oCliente = Response;
          //console.log("Respuesta cliente" + JSON.stringify(this.oCliente));
          this.bCargandoClientes = false;

          if (this.oCliente.Codigo != 0) {
            this.bError = true;
            this.sMensaje = "No se encontraron datos del cliente";

            return false;
          }

          this.oContenido = this.oCliente.Contenido[0];
          this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
          this.oDatosGenerales = this.oCliente.Contenido[0].DatosGenerales;
          this.oContacto = this.oCliente.Contenido[0].Contactos;
          return true;

        },
        (error: Clientes) => {
          this.oCliente = error;
          console.log("error");
          console.log(this.oCliente);
          this.bCargandoClientes = false;
          return false;
        }
      );
    return true;
  }

  /**
   * Obtiene Nombre del Cliente
   * @param cliente 
   * @param filial 
   * @returns 
   */
  obtenNombreCliente(cliente: number, filial: number): string {
    let nombre: string = '';

    for (var cliCon of this.oCliente.Contenido) {
      if (cliCon.ClienteCodigo == String(cliente) && cliCon.ClienteFilial == String(filial)) {
        nombre = cliCon.RazonSocial;
        break;
      }
    }
    return nombre;
  }


  /**
  * Funcion para actualizar los valores de la tabla de acuerdo a los registros a mostrar
  */
  refreshCountries() {
    //this.countries = COUNTRIES
    console.log('Inicio');
    console.dir(this.pedido);

    this.pedido
      .map((c, i) => ({ id: i + 1, ...c }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
    console.log('Termina');
  }

  /**
   * Totaliza todas las filas de la tabla
   * @param oPedido 
   * @param idCol 
   * @returns 
   */
  getTotal(oFila: Pedido[], idCol: string): number {
    //console.log("Entra total-------");
    let Total: number = 0;

    switch (idCol) {
      case 'CantidadPedida': {

        for (var detPed of oFila) {
          Total += detPed.CantidadPedida;
        }
        break;
      }
      case 'DiferenciaPedidosSurtido': {

        for (var detPed of oFila) {
          Total += detPed.DiferenciaPedidosSurtido;
        }
        break;
      }

    }

    Total = Number(Total.toFixed(2));
    return Total;
  }

  /**
   * 
   * @param reason 
   * @returns 
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //this.pedidoDet = [];
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //this.pedidoDet = [];
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**
   * Consulta detalle del pedido seleccionado
   * @param ped - objeto que representa la fila del pedido elegido
   */
  ConsultaPedidoDetalle(ped: any) {

    this.sPedidoFolio = ped.PedidoFolio;
    this.sPedidoFecha = ped.FechaPedido;

    //Inicializamos datos de encabezado requeridos para consultar detalle
    this.oFiltrosPedclteDetalle.TipoUsuario = this.oFiltros.TipoUsuario;
    this.oFiltrosPedclteDetalle.Usuario = this.oFiltros.Usuario;
    this.oFiltrosPedclteDetalle.ClienteCodigo = this.oFiltros.ClienteCodigo;
    this.oFiltrosPedclteDetalle.ClienteFilial = this.oFiltros.ClienteFilial;
    this.oFiltrosPedclteDetalle.PedidoLetra = 'C';
    this.oFiltrosPedclteDetalle.PedidoFolio = Number(this.sPedidoFolio);

    this.pedidoDet = [];
    this.pedidoGuias = [];

    //Realizamos llamada al servicio de pedidos
    this._pedclteDetalleService.Get(this.oFiltrosPedclteDetalle).subscribe(
      (Response: PedclteDetalle) => {
        this.oPedclteDetalleResult = Response;
        this.pedidoDet = this.oPedclteDetalleResult.Contenido.PedidoArticulos;

        //console.log( this.collectionSize);
        //console.log(this.oPedclteDetalleResult);
        //console.log(this.pedidoDet);

        if (this.oPedclteDetalleResult.Codigo != 0) {
          this.bError = true;
          this.sMensaje = 'No se encontro detalle de pedido';
          this.MostrarArticulos = false;
          this.pedidoDet = [];
          return;
        }

        //Se calculan totales pedido
        this.oPedclteDetalleResult.Contenido.CantidadPedida = this.getTotalPedido(this.pedidoDet, 'CantidadPedida');

        this.oPedclteDetalleResult.Contenido.CantidadPedidoProduccion = this.getTotalPedido(this.pedidoDet, 'CantidadPedidoProduccion');
        this.oPedclteDetalleResult.Contenido.CantidadProducida = this.getTotalPedido(this.pedidoDet, 'CantidadProducida');
        this.oPedclteDetalleResult.Contenido.CantidadSurtida = this.getTotalPedido(this.pedidoDet, 'CantidadSurtida');
        this.oPedclteDetalleResult.Contenido.DiferenciaProducido = this.getTotalPedido(this.pedidoDet, 'DiferenciaProducido');

        this.MostrarArticulos = true;
        this.sMensaje = '';
        //this.collectionSize = this.oPedidoRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos

        // Ahora llamamos al servicio para obtener los paquete enviados (Guias) asociados al pedido
        this._pedclteGuiasService.Get(this.oFiltrosPedclteDetalle).subscribe(
          (Response: PedclteGuias) => {
            this.oPedclteGuiasResult = Response;
            this.pedidoGuias = this.oPedclteGuiasResult.Contenido.PedidoGuias;

            if (this.oPedclteGuiasResult.Codigo != 0) {
              this.sMensaje = 'No se encontraron Guias asociadas al pedido';
              this.pedidoGuias = [];
              return;
            }

            this.sMensaje = '';

          }
        );

      },
      (error: PedclteDetalle) => {
        this.oPedclteDetalleResult = error;
        this.sMensaje = 'No se encontro detalle de pedido';
        //console.log('error');
        console.log(this.oPedclteDetalleResult);
      }
    );

  }

  getTotalPedido(oDetallePed: PedidoArticulo[], idCol: string): number {
    //console.log("Entra ---------");
    let Total: number = 0;

    switch (idCol) {
      case 'CantidadPedida': {

        for (var detPed of oDetallePed) {
          Total += detPed.CantidadPedida;
        }
        break;
      }
      case 'CantidadPedidoProduccion': {

        for (var detPed of oDetallePed) {
          Total += detPed.CantidadPedidoProduccion;
        }
        break;
      }
      case 'CantidadProducida': {

        for (var detPed of oDetallePed) {
          Total += detPed.CantidadProducida;
        }
        break;
      }
      case 'CantidadSurtida': {

        for (var detPed of oDetallePed) {
          Total += detPed.CantidadSurtida;
        }
        break;
      }
      case 'DiferenciaProducido': {

        for (var detPed of oDetallePed) {
          Total += detPed.DiferenciaProducido;
        }
        break;
      }
    }

    Total = Number(Total.toFixed(2));
    return Total;
  }

  /** 
   * OnDestroy
   */
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit(): void {
    this.dtTrigger.next("");
  }

  /**
   * Muestra detalle del pedido seleccionado
   * @param ped - objeto que representa la fila del pedido elegido
   */
  clicDetallePed(ped: any): void {

    console.log(ped.PedidoFolio);
    //this.pedidoDet = [];
    this.ConsultaPedidoDetalle(ped);

    this.bBandera = false;
    this.MostrarArticulos = true;

  }

  /**
   * Oculta detalle de pedido y muestra lista de pedidos
   */
  clicCerrarDetallePed(): void {
    this.MostrarArticulos = false;
    this.bBandera = true;
  }

  openModalMedidasPedclte(articulo: any) {
    const modalRef = this.modalService.open(PedclteMedidasComponent, { size: 'sm' });
    modalRef.componentInstance.articulo = articulo;
  }

}
