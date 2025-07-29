import {
  Component, OnInit, ChangeDetectorRef, ElementRef,
  ViewChild, ViewChildren, QueryList
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

// Modelos y Filtros para componentes heredados
import { FiltrosOficina } from 'src/app/models/oficina.filtros';
import { Oficina } from 'src/app/models/oficina';
import { FiltrosClientes } from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';
import { FiltrosAgente } from 'src/app/models/agentes.filtros';
// Servicios heredados
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { ServicioClientes } from 'src/app/services/clientes.service';
import { Agentes, Contenido as AgentesCon } from 'src/app/models/agentes';
import { ServicioAgentes } from 'src/app/services/agentes.service';

// Modelos, filtros y servicios específicos del componente
import { PrePedFiltros, PrepedDetalleFiltros } from './modelos/preped.filtros'
import { PrepedDetalleResponse, PedItem } from './modelos/preped-repo-detalle.response';
import { PrePedRepoResponse, PrepedOficina, Pedido } from './modelos/preped-repo.response';
import { PrepedRepoService } from './servicios/preped-repo.service';
import { PrepedRepoDetalleService } from './servicios/preped-repo-detalle.service';

// Datatables
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-prepedidos-repo',
  templateUrl: './prepedidos-repo.component.html',
  styleUrls: ['./prepedidos-repo.component.css'],
  providers: [DecimalPipe,
    ServicioOficinas, ServicioClientes, ServicioAgentes,
    PrepedRepoService, PrepedRepoDetalleService
  ]
})
export class PrepedidosRepoComponent implements OnInit {

  @ViewChild('containerTablaPrepedidos') containerTablaPrepedidos: ElementRef;

  isCollapsed: boolean = false;
  searchtext = '';
  bError: boolean = false;
  sMensaje: string = "";
  sMensajeModal: string = "";
  bCliente: boolean;
  mostrarTabla: boolean;
  mostrarDetalle: boolean;
  bCargando: boolean = false;
  bCargandoClientes: boolean = false;
  closeResult = '';
  fechaHoy: String
  ModalActivo?: NgbModalRef;
  mobileQuery: MediaQueryList;

  // datatables
  @ViewChildren(DataTableDirective)
  datatableElementList: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();
  dtTrigger1: Subject<any> = new Subject();


  sTipo: string | null;     // tipo de usuario
  sCodigo: number | null;   // codigo de usuario
  sFilial: number | null;
  sNombre: string | null;

  oBuscar: PrePedFiltros = {
    TipoUsuario: '', Usuario: 0, OficinaDesde: '', OficinaHasta: '',
    AgenteDesde: 0, AgenteHasta: 0, ClienteDesde: 0, FilialDesde: 0,
    ClienteHasta: 0, FilialHasta: 0, FechaPrepDesde: '', FechaPrepHasta: '',
    FolioDesde: 0, FolioHasta: 0, OrdenCompra: '', Status: '',
    Documentados: '', Autorizados: ''
  };
  oFiltrosDetalle: PrepedDetalleFiltros = {
    TipoUsuario: '', Usuario: 0, ClienteCodigo: 0, ClienteFilial: 0,
    PedidoLetra: '', PedidoFolio: 0
  };
  oPrepedRepoResponse: PrePedRepoResponse;
  oPrepedOficinas: PrepedOficina[];
  oPrepedDetalleResponse: PrepedDetalleResponse;
  oFilasPreped: PedItem[];

  // objeto con datos del prepedido seleccionado en la lista, para mostrarlos en el HTML
  oDocPreped: any = {};


  oBuscarOfi: FiltrosOficina;
  oOficinasRes: Oficina;

  bBanderaCliente: boolean;
  Buscar: FiltrosClientes;
  oCliente: Clientes;
  oContenido: Contenido;
  oCondiciones: Condiciones;
  oDatosGenerales: DatosGenerales;
  oContacto: Contactos;
  sClienteDesdeCod: string;
  sClienteDesdeFil: string;
  sClienteDesdeNom: string;
  sClienteHastaCod: string;
  sClienteHastaFil: string;
  sClienteHastaNom: string;

  public oBuscarAgentes: FiltrosAgente;
  public oAgentes: Agentes;
  public oAgentesCon: AgentesCon[];

  sWidth: number;
  sHeight: number;

  private _mobileQueryListener: () => void;

  /******************************************************************* 
   * Constructor
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioOficinas: ServicioOficinas,
    private _servicioCClientes: ServicioClientes,
    private _servicioAgentes: ServicioAgentes,
    private _servicioPrepedRepo: PrepedRepoService,
    private _servicioPrepedRepoDetalle: PrepedRepoDetalleService,
    private modalService: NgbModal
  ) {
    this.sTipo = sessionStorage.getItem('tipo');
    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');

    this.oBuscarOfi = new FiltrosOficina('', 0)
    this.oOficinasRes = {} as Oficina;

    this.Buscar = new FiltrosClientes(0, 0, 0, '', 0);
    this.oCliente = {} as Clientes;
    this.oContenido = {} as Contenido;
    this.oCondiciones = {} as Condiciones;
    this.oDatosGenerales = {} as DatosGenerales;
    this.oContacto = {} as Contactos;

    this.oBuscarAgentes = new FiltrosAgente(0, '', 'A', 0, '', '');

    this.oPrepedOficinas = [];
    this.oFilasPreped = [];

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.bCliente = false;
    this.mostrarTabla = false;

  }

  /********************************************************
   * ngOnInit
   */
  ngOnInit(): void {

    console.log("La resolución de tu pantalla es: " + screen.width + " x " + screen.height);
    this.sWidth = screen.width;
    this.sHeight = (screen.height / 2);

    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    // Tabla con Lista de Prepedidos
    this.dtOptions[0] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false, // evita que DataTables calcule anchos incorrectos
      scrollX: true,
      processing: true,
      order: [],
      ordering: false,
      columnDefs: [
        { orderable: false, targets: "_all" }   // aplica la opción a todas las columnas
      ],
      dom: 'flBtipr',  //'flBtip',
      language: {
        emptyTable: 'No se encontraron registros',
        url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Lista de Prepedidos',
          text: '<p style="color: #f9f9f9; height: 9px;">Excel</p>',
          className: 'btnExcel btn',
        }
      ]
    };

    // Tabla con filas del prepedido elegido
    this.dtOptions[1] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false, // evita que DataTables calcule anchos incorrectos
      scrollX: true,
      processing: true,
      order: [],
      ordering: false,
      columnDefs: [
        { orderable: false, targets: "_all" }   // aplica la opción a todas las columnas
      ],
      dom: 'flBtipr',  //'flBtip',
      language: {
        emptyTable: 'No se encontraron registros',
        url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Detalle de Prepedido',
          text: '<p style="color: #f9f9f9; height: 9px;">Excel</p>',
          className: 'btnExcel btn',
        }
      ]
    };

    // código heredado ---------------------------------------------
    this.mobileQuery.removeListener(this._mobileQueryListener);


    // FIXME Revisar como puede simplificarse este bloque de fechas, 
    //      consultar con Gemini|ChatGPT --------------------------

    // Inicializo valores para campos de fechas
    let date: Date = new Date
    let mes;
    let dia;

    //Valida mes 
    if ((date.getMonth() + 1).toString().length == 1) {
      mes = '0' + (date.getMonth() + 1);
    } else {
      mes = (date.getMonth() + 1);
    }

    //Valida dia 
    if (date.getDate().toString().length == 1) {
      dia = '0' + (date.getDate());
    }
    //console.log('dRendon: mes',mes,(date.getMonth()+1).toString().length==1);
    let fechaActual = (date.getFullYear() + 1) + '-' + mes + '-' + (date.getDate().toString().length == 1 ? '0' + (date.getDate()) : date.getDate());
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
    this.fechaHoy = (date.getDate() + '-' + mes + '-' + date.getFullYear());

    //Llenamos oficinas
    if (!sessionStorage.getItem('Oficinas')) {
      //console.log("NO tenemos oficina");
      this._servicioOficinas
        .Get(this.oBuscarOfi)
        .subscribe(
          (Response: Oficina) => {
            this.oOficinasRes = Response;
            //console.log("RESULTADO LLAMADA Oficinas "+JSON.stringify(this.oOficinasRes) );              
            if (this.oOficinasRes.Codigo != 0) {
              this.bError = true;
              this.sMensaje = "No se encontraron oficinas";
              return;
            }
            //console.log("Llenamos oficina");
            sessionStorage.setItem('Oficinas', JSON.stringify(this.oOficinasRes));
            this.oBuscar.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo;
            this.oBuscar.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo;
            this.sMensaje = "";
          },
          (error: Oficina) => {
            this.oOficinasRes = error;
            console.log("error oficinas");
            console.log(this.oOficinasRes);
          }
        );
    } else {
      //console.log("Ya tenemos oficina");
      this.oOficinasRes = JSON.parse(sessionStorage.getItem('Oficinas'));
      this.oBuscar.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo;
      this.oBuscar.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo;
    }

    switch (this.sTipo) {
      case 'C': {
        //Tipo cliente               
        this.bCliente = true;
        this.oBuscar.ClienteDesde = this.sCodigo;
        this.oBuscar.FilialDesde = this.sFilial;
        this.oBuscar.ClienteHasta = this.sCodigo;
        this.oBuscar.FilialHasta = this.sFilial;
        this.oBuscar.Usuario = this.sCodigo + '-' + this.sFilial;

        break;
      }
      case 'A': {
        //Agente; 
        this.bCliente = false;
        this.oBuscar.ClienteHasta = 999999;
        this.oBuscar.FilialHasta = 999;
        this.oBuscar.Usuario = this.sCodigo;
        break;
      }
      default: {
        //Gerente; 
        this.bCliente = false;
        this.oBuscar.ClienteHasta = 999999;
        this.oBuscar.FilialHasta = 999;
        this.oBuscar.Usuario = this.sCodigo;
        break;
      }
    }


    // FIXME Falta criterio agentes
    this.oBuscar.TipoUsuario = this.sTipo;
    this.oBuscar.AgenteDesde = 1;
    this.oBuscar.AgenteHasta = 99;
    this.oBuscar.FechaPrepDesde = '2024-01-01';
    this.oBuscar.FechaPrepHasta = fechaAyer;
    this.oBuscar.FolioDesde = 0;
    this.oBuscar.FolioHasta = 999999;
    this.oBuscar.OrdenCompra = '';
    this.oBuscar.Status = 'A';
    this.oBuscar.Documentados = 'Todos';
    this.oBuscar.Autorizados = 'Todos';

    // Criterios heredados servicio de clientes
    this.Buscar.TipoUsuario = this.sTipo;
    this.Buscar.Usuario = this.sCodigo;

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
            //console.log("llenamos Clientes");
            sessionStorage.setItem('Clientes', JSON.stringify(this.oCliente));
            this.oContenido = this.oCliente.Contenido[0];
            this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
            this.oDatosGenerales = this.oCliente.Contenido[0].DatosGenerales;
            this.oContacto = this.oCliente.Contenido[0].Contactos;
            return true;
          },
          (error: Clientes) => {
            this.oCliente = error;
            console.log("error oCliente", this.oCliente);
            return false;
          }
        );
    } else {
      // console.log("Ya tenemos  Clientes");
      this.oCliente = JSON.parse(sessionStorage.getItem('Clientes'));
      this.oContenido = this.oCliente.Contenido[0];
      this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
      this.oDatosGenerales = this.oCliente.Contenido[0].DatosGenerales;
      this.oContacto = this.oCliente.Contenido[0].Contactos;
    }

    //Consulta agentes
    if (!sessionStorage.getItem('Agentes')) {
      // Caso en que no se tienen todavía agentes
      this.oBuscarAgentes.TipoUsuario = sessionStorage.getItem('tipo');
      if (sessionStorage.getItem('tipo') == 'C') {
        this.oBuscarAgentes.Usuario = sessionStorage.getItem('codigo') + '-' + sessionStorage.getItem('filial');
      }
      else {
        this.oBuscarAgentes.Usuario = sessionStorage.getItem('codigo');
      }
      this.oBuscarAgentes.Status = "A";
      this._servicioAgentes.Get(this.oBuscarAgentes)
        .subscribe(
          (Response: Agentes) => {
            this.oAgentes = Response;
            //console.log("Respuesta agentes" + JSON.stringify(this.oAgentes));

            if (this.oAgentes.Codigo != 0) {
              this.bError = true;
              this.sMensaje = "No se encontraron agentes";
              return false;
            }
            this.oAgentesCon = this.oAgentes.Contenido;
            sessionStorage.setItem('Agentes', JSON.stringify(this.oAgentesCon));

            if (this.sTipo == 'A') {
              this.oBuscar.AgenteDesde = this.sCodigo;
              this.oBuscar.AgenteHasta = this.sCodigo;
            } else {
              this.oBuscar.AgenteDesde = Number(this.oAgentes.Contenido[0].AgenteCodigo);
              this.oBuscar.AgenteHasta = Number(this.oAgentes.Contenido[this.oAgentes.Contenido?.length - 1].AgenteCodigo);
            }

            return true;
          },
          (error: Agentes) => {
            this.oAgentes = error;
            console.log("error");
            console.log(this.oAgentes);
            return false;
          }
        );

    } else {    //Ya tenemos agentes
      this.oAgentesCon = JSON.parse(sessionStorage.getItem('Agentes'));
      if (this.sTipo == 'A') {
        this.oBuscar.AgenteDesde = this.sCodigo;
        this.oBuscar.AgenteHasta = this.sCodigo;
      } else {
        this.oBuscar.AgenteDesde = Number(this.oAgentesCon[0].AgenteCodigo);
        this.oBuscar.AgenteHasta = Number(this.oAgentesCon[this.oAgentesCon?.length - 1].AgenteCodigo);
      }
    }

    this.dtTrigger0.next("");
    this.dtTrigger1.next("");

  }


  /********************************************************
   * Modal clientes
   */
  openClientes(Clientes: any, cliente: boolean) {
    console.log("Entra modal clientes");
    this.bCargandoClientes = true;
    this.bBanderaCliente = cliente;
    var result;

    try {
      //result = this.BuscaClientes()
      result = true;

      if (result) {
        this.ModalActivo = this.modalService.open(Clientes, {
          ariaLabelledBy: 'Clientes',
          size: 'xl',
          scrollable: true

        });

        this.ModalActivo.result.then(
          (result) => { },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log('reason ' + reason);
            this.Buscar = new FiltrosClientes(0, 0, 0, '', 0);
          }
        );
      }

      this.bCargandoClientes = false;


      //console.log("respuesta" + result);

    } catch (err) {

    }
  }

  /********************************************************
   * Llama servicio para obtener Lista de Pedidos
   */
  ListaPrepedidos() {

    this.sMensaje = '';
    this.mostrarDetalle = false;
    this.mostrarTabla = false;
    this.isCollapsed = false;
    this.bCargando = false;

    // aqui pueden ir las comprobaciones en los criterios de filtro
    // antes de llamar el servicio

    this.oFilasPreped = [];     // detalle del prepedido
    this.oPrepedOficinas = [];  // lista de prepedidos
    this.bCargando = true;

    $("#tabla1").DataTable().destroy();
    this.dtTrigger1.next("");

    $("#tabla0").DataTable().destroy();
    this.dtTrigger0.next("");

    this._servicioPrepedRepo.GetListaPreped(this.oBuscar).subscribe(
      (response: PrePedRepoResponse) => {
        this.oPrepedRepoResponse = response;

        if (this.oPrepedRepoResponse.Codigo != 0) {
          this.sMensaje = 'No se encontraron Prepedidos';
          this.bCargando = false;
          this.isCollapsed = false;
          return;
        }

        this.oPrepedOficinas = this.oPrepedRepoResponse.Contenido.PrepedOficinas;
        //console.dir(this.oPrepedRepoResponse);
        //console.dir(this.oPrepedOficinas);

        this.sMensaje = '';
        this.bCargando = false;
        this.isCollapsed = true;
        this.mostrarTabla = true;

        // datos nuevos, se destruyen las instancias y despues
        // se llama el dttrigger para renderizar otra vez 
        $("#tabla1").DataTable().destroy();
        this.dtTrigger1.next("");

        $("#tabla0").DataTable().destroy();
        this.dtTrigger0.next("");

      },
      (error: PrePedRepoResponse) => {
        this.oPrepedRepoResponse = error;
        this.bCargando = false;
        this.sMensaje = 'Error recuperando registros...';
        console.error('🔸 ...> error al buscar artículos', error);
        return;
      }
    );

  }

  /********************************************************
   * Llama servicio para obtener detalle de prepedido
   */
  FilasPreped(oPed: any): void {

    //console.table(oPed);

    if (this.oFilasPreped.length > 0) {
      // Si ya hay filas, se destruye la tabla y se limpia el array
      $("#tabla1").DataTable().destroy();
      this.dtTrigger1.next("");
      this.mostrarDetalle = false;
      this.oFilasPreped = [];
    }

    // Inicializamos datos de encabezado requeridos para consultar detalle
    this.oFiltrosDetalle.TipoUsuario = this.oBuscar.TipoUsuario;
    this.oFiltrosDetalle.Usuario = this.oBuscar.Usuario;
    this.oFiltrosDetalle.ClienteCodigo = oPed.PedClteCode;
    this.oFiltrosDetalle.ClienteFilial = oPed.PedClteFil;
    this.oFiltrosDetalle.PedidoLetra = oPed.PedLetra;
    this.oFiltrosDetalle.PedidoFolio = Number(oPed.PedFolio);

    //console.table(this.oFiltrosDetalle);

    // Inicializo Modelo para datos generales del documento seleccionado en la lista
    this.oDocPreped = {
      PedLetra: '', PedFolio: '', Status: '',
      PedFecha: Date, FechaCanc: Date,
      AgenteCode: '', AgenteNom: '',
      PedClteCode: '', PedClteFil: '', PedClteNom: '', PedClteSuc: '',
      OrdenCompra: '', Observac: ''
    };

    // Llama servicio para obtener detalle de prepedido
    this._servicioPrepedRepoDetalle.GetDetallePreped(this.oFiltrosDetalle).subscribe(
      (Response: PrepedDetalleResponse) => {
        this.oPrepedDetalleResponse = Response;
        this.oFilasPreped = this.oPrepedDetalleResponse.Contenido.PedItems;
        //console.dir(this.oFilasPreped);

        //console.table(this.oPrepedDetalleResponse);

        if (this.oPrepedDetalleResponse.Codigo != 0) {
          this.bError = true;
          this.sMensaje = 'No se encontro detalle de Prepedido';
          this.mostrarDetalle = false;
          this.oFilasPreped = [];
          return;
        }

        this.oDocPreped = {
          PedLetra: oPed.PedLetra, PedFolio: oPed.PedFolio, Status: oPed.Status,
          PedFecha: oPed.PedFecha, FechaCanc: oPed.FechaCanc,
          AgenteCode: oPed.AgenteCode, AgenteNom: oPed.AgenteNom,
          PedClteCode: oPed.PedClteCode, PedClteFil: oPed.PedClteFil, PedClteNom: oPed.PedClteNom, PedClteSuc: oPed.PedClteSuc,
          OrdenCompra: oPed.OrdenCompra, Observac: oPed.Observac
        };

        $("#tabla1").DataTable().destroy();
        this.dtTrigger1.next("");

        this.sMensaje = '';
        this.mostrarTabla = false;
        this.mostrarDetalle = true;

      },
      (error: PrepedDetalleResponse) => {
        this.oPrepedDetalleResponse = error;
        this.sMensaje = 'No se encontro detalle de Prepedido';
        console.table(error);
        this.oFilasPreped = [];
      }
    );

  }

  /*********************************************************
   * Funcion para seleccionar cliente
   */
  obtenCliente(sCodigo: string, sFilial: string) {

    if (this.bBanderaCliente) {//Si es true es cliente desde
      this.oBuscar.ClienteDesde = Number(sCodigo);
      this.oBuscar.FilialDesde = Number(sFilial);
    } else {
      this.oBuscar.ClienteHasta = Number(sCodigo);
      this.oBuscar.FilialHasta = Number(sFilial);
    }

    this.ModalActivo.dismiss('Cross click');
  }

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

          console.log("error oCliente");
          console.log(this.oCliente);
          this.bCargandoClientes = false;
          return false;

        }

      );
    return true;
  }

  obtenNombreCliente(cliente: number): string {
    let nombre: string = '';

    for (var cliCon of this.oCliente.Contenido) {
      if (cliCon.ClienteCodigo == String(cliente)) {
        nombre = cliCon.RazonSocial;
        break;
      }

    }
    return nombre;
  }

  obtenNombreAgente(agente: number): string {
    let nombre: string = '';
    for (var ageCon of this.oAgentesCon) {
      if (ageCon.AgenteCodigo == String(agente)) {
        nombre = ageCon.AgenteNombre;
        break;
      }
    }
    return nombre;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /*************************************************
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger0.unsubscribe();
    this.dtTrigger1.unsubscribe();

    this.mostrarDetalle = false;
    this.mostrarTabla = false;
  }

  /***************************************************
  * Oculta detalle del Pedido y muestra otra vez Lista de Prepedidos
  */
  ClicCerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.mostrarTabla = true;
  }

  /**
  * ngAfterViewInit
  */
  ngAfterViewInit(): void {
    this.dtTrigger0.next("");
    this.dtTrigger1.next("");
  }



}
