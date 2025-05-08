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


/**
 * Clase principal del Componente
 */
@Component({
  selector: 'app-pedclte-lista',
  templateUrl: './pedclte-lista.component.html',
  styleUrls: ['./pedclte-lista.component.css'],
  providers: [DecimalPipe, ServicioClientes, PedclteListaService],
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
  bBandera = false;
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

  /**
   * Constructor de la clase
   * @param changeDetectorRef 
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
    private _pedclteListaService: PedclteListaService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');
    this.bCliente = false;

    this.Buscar = new FiltrosClientes(0, 0, 0, '', 0);
    this.oCliente = {} as Clientes;
    this.oContenido = {} as Contenido;
    this.oCondiciones = {} as Condiciones;
    this.oDatosGenerales = {} as DatosGenerales;
    this.oContacto = {} as Contactos;

    this.oFiltros = new PedclteListaFiltros('', 0, 0, 0, 0, '', '');
    this.oPedclteListaResult = {} as ConsultaPedido;
    this.oPedclteListaResult.Contenido = {} as ConPed;
    //this.oFilaPedido = [];
    this.pedido = [];

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

  clicLink(): void {
    alert('clic en enlace...')
  }

}
