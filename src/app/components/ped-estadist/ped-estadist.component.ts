import {
  Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef,
  ViewChildren, ViewChild, QueryList
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

//---- Modelos
import { PedEstadistFiltros } from './modelos/ped-estadist.filtros';
import { PedEstadistResponse, PedEstadFilas, Paginacion } from './modelos/ped-estadist.response';
import { FiltrosOficina } from 'src/app/models/oficina.filtros';
import { Oficina } from 'src/app/models/oficina';
import { FiltrosClientes } from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido as ContenidoCli } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';
import { FiltrosLineas } from 'src/app/models/lineas.filtros';
import { Lineas, Contenido as LineasCon } from 'src/app/models/lineas';

//---- Servicios
import { FuncFechasService } from 'src/app/core/services/func-fechas.service';
import { FuncStringsService } from 'src/app/core/services/func-strings.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { ServicioClientes } from 'src/app/services/clientes.service';
import { ServicioLineas } from 'src/app/services/lineas.service';
import { PedEstadistService } from './servicios/ped-estadist.service';


@Component({
  selector: 'app-ped-estadist',
  templateUrl: './ped-estadist.component.html',
  styleUrls: ['./ped-estadist.component.css'],
  providers: [
    FuncFechasService, FuncStringsService, DecimalPipe,
    ServicioOficinas, ServicioClientes, ServicioLineas,
    PedEstadistService]
})
export class PedEstadistComponent implements OnInit, OnDestroy {

  //#region para declarar Propiedades del componente
  sCodigo: number | null;     // usuario
  sTipo: string | null;       // tipo de usuario  
  sFilial: number | null;
  sNombre: string | null;

  isCollapsed = false;              // collapse del panel de filtros
  public bCliente: boolean;         // tipo de usuario "cliente"
  public bError: boolean = false;
  public sMensaje: string = '';
  public bMostrarTabla = false;
  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;
  closeResult = '';
  public ModalActivo?: NgbModalRef;

  fechaHoy: String;
  page = 1;
  pageSize = 4;
  collectionSize = 0;

  oBuscar: PedEstadistFiltros = {
    TipoUsuario: '', Usuario: 0, FechaDesde: '', FechaHasta: '',
    OficinaDesde: '', OficinaHasta: '99', ClienteDesde: 0, FilialDesde: 0,
    ClienteHasta: 999999, FilialHasta: 999, LineaDesde: '', LineaHasta: 'ZZ',
    ClaveDesde: '', ClaveHasta: 'ZZZZZZZZZZZZZZZZZZZZ',
    TipoPedDesde: '01', TipoPedHasta: '99', InternoExterno: 'Todos',
    Pagina: 1
  };

  searchtext = '';

  oBuscarOfi: FiltrosOficina;
  oOficinasRes: Oficina;
  oBuscarLineas: FiltrosLineas;
  oLineasRes: Lineas;
  oLineasCon: LineasCon[];

  Buscar: FiltrosClientes;
  oCliente: Clientes;
  oContenido: ContenidoCli;
  oCondiciones: Condiciones;
  oDatosGenerales: DatosGenerales;
  oContacto: Contactos;

  oPedEstadistResponse: PedEstadistResponse;
  oPedEstadFilas: PedEstadFilas[];

  bBandera: boolean;          // según yo no se ocupa
  bBanderaCliente: boolean;

  sClienteDesdeCod: string;
  sClienteDesdeFil: string;
  sClienteDesdeNom: string;
  sClienteHastaCod: string;
  sClienteHastaFil: string;
  sClienteHastaNom: string;

  sWidth: number;
  sHeight: number;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  //#endregion

  //----------------------------------------------------------------------------
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _router: Router, private ActivatedRoute: ActivatedRoute,
    private _funcFechasService: FuncFechasService,
    private _funcStringsService: FuncStringsService,
    private modalService: NgbModal,
    private _servicioOficinas: ServicioOficinas,
    private _servicioCClientes: ServicioClientes,
    private _servicioLineas: ServicioLineas,
    private _pedEstadistService: PedEstadistService
  ) {

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');
    this.sTipo = sessionStorage.getItem('tipo');
    this.bCliente = false;
    this.bBandera = false;

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.oBuscarOfi = new FiltrosOficina('', 0)
    this.oOficinasRes = {} as Oficina;
    this.Buscar = new FiltrosClientes(0, 0, 0, '', 0);
    this.oCliente = {} as Clientes;
    this.oContenido = {} as ContenidoCli;
    this.oCondiciones = {} as Condiciones;
    this.oDatosGenerales = {} as DatosGenerales;
    this.oContacto = {} as Contactos;

    this.oPedEstadistResponse = {} as PedEstadistResponse;
    this.oPedEstadFilas = [] as PedEstadFilas[];
  }

  //----------------------------------------------------------------------------
  ngOnInit(): void {

    this.dtOptions[0] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      destroy: true,
      fixedHeader: {
        header: true,
        footer: false
      },
      order: [],
      ordering: false,
      dom: 'flBtip',
      language: {
        url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
        paginate: {
          previous: "Anter",
          next: "Sigte"
        }
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Estadistica de Pedidos',
          text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
          className: "btnExcel btn"
        }
      ]
    };
    // this.dtOptions[1] = {
    //   pagingType: 'full_numbers',
    //   destroy: true,
    //   pageLength: 10,
    //   processing: true,
    //   fixedHeader: {
    //     header: true,
    //     footer: false
    //   },
    //   order: [],
    //   ordering: false,
    //   dom: 'flBtip',
    //   language: {
    //     url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
    //   },
    //   buttons: [
    //     {
    //       extend: 'excelHtml5',
    //       title: 'Estadistica de Pedidos',
    //       text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
    //       className: "btnExcel btn"
    //     }
    //   ]
    // };

    this.mobileQuery.removeListener(this._mobileQueryListener);

    // se agrega validación control de sesión distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    this.oBuscar.TipoUsuario = this.sTipo;
    if (this.sTipo != 'G' && this.sTipo != 'A') {
      this.sMensaje = 'Usuario no autorizado para acceder a este reporte';
      this._router.navigate(['/']);
    }
    this.oBuscar.Usuario = this.sCodigo;
    this.bCliente = false;

    switch (this.sTipo) {
      case 'C': {
        //Tipo cliente
        this.oBuscar.ClienteDesde = this.sCodigo;
        this.oBuscar.FilialDesde = this.sFilial;
        this.oBuscar.ClienteHasta = this.sCodigo;
        this.oBuscar.FilialHasta = this.sFilial;
        this.bCliente = true;
        break;
      }
      case 'A': {
        //Agente; 
        this.oBuscar.ClienteHasta = 999999;
        this.oBuscar.FilialHasta = 999;
        this.bCliente = false;
        break;
      }
      default: {
        //Gerente;
        this.oBuscar.ClienteHasta = 999999;
        this.oBuscar.FilialHasta = 999;
        this.bCliente = false;
        break;
      }
    }

    this.Buscar.TipoUsuario = this.sTipo;   // se usan en busqueda de clientes, creo
    this.Buscar.Usuario = this.sCodigo;

    //let date: Date = new Date();
    this.fechaHoy = this._funcFechasService.fechaHoy_aaaammdd();
    let fechaAyer = this._funcFechasService.obtenerFechaAyer();

    this.oBuscar.FechaDesde = '2026-01-01';
    this.oBuscar.FechaHasta = fechaAyer;

    this.sWidth = screen.width;
    this.sHeight = (screen.height / 2);

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
            //console.log("LLenamos oficina");
            sessionStorage.setItem('Oficinas', JSON.stringify(this.oOficinasRes));
            this.oBuscar.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo;
            this.oBuscar.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo;
            this.sMensaje = "";
          },
          (error: Oficina) => {
            this.oOficinasRes = error;
            console.log("error");
            console.log(this.oOficinasRes);
          }
        );

    } else {
      // console.log("Ya tenemos oficina");
      this.oOficinasRes = JSON.parse(sessionStorage.getItem('Oficinas'));
      this.oBuscar.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo;
      this.oBuscar.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo;
    }

    //Consulta lineas de producto
    if (!sessionStorage.getItem('Lineas')) {
      //console.log("Lineas no existen");
      this._servicioLineas
        .Get(this.oBuscarLineas)
        .subscribe(
          (Response: Lineas) => {
            this.oLineasRes = Response;
            //console.log("RESULTADO LLAMADA Oficinas "+JSON.stringify(this.oOficinasRes) );            
            if (this.oLineasRes.Codigo != 0) {
              this.bError = true;
              this.sMensaje = "No se encontraron Lineas";
              return;
            }
            //console.log("Se llenan Lineas");
            sessionStorage.setItem('Lineas', JSON.stringify(this.oLineasRes));
            this.oLineasCon = this.oLineasRes.Contenido
            this.oBuscar.LineaDesde = this.oLineasRes.Contenido[0].LineaCodigo;
            this.oBuscar.LineaHasta = this.oLineasRes.Contenido[this.oLineasRes.Contenido?.length - 1].LineaCodigo;
            this.sMensaje = "";
          },
          (error: Lineas) => {
            this.oLineasRes = error;
            this.sMensaje = "No se encontraron oficinas";
            console.log("error");
            console.log(this.oLineasRes);
            return;
          }
        );
    } else {
      // console.log("Lineas ya existen");
      this.oLineasRes = JSON.parse(sessionStorage.getItem('Lineas'));
      this.oLineasCon = this.oLineasRes.Contenido
      this.oBuscar.LineaDesde = this.oLineasRes.Contenido[0].LineaCodigo;
      this.oBuscar.LineaHasta = this.oLineasRes.Contenido[this.oLineasRes.Contenido?.length - 1].LineaCodigo;
    }

    //Realizamos llamada al servicio de clientes 
    if (!sessionStorage.getItem('Clientes')) {
      //console.log("no tenemos  Clientes");

      this._servicioCClientes
        .GetCliente(this.Buscar)
        .subscribe(
          (Response: Clientes) => {
            this.oCliente = Response;
            //console.log("Respuesta cliente"+JSON.stringify(this.oCliente));    
            if (this.oCliente.Codigo != 0) {
              return false;
            }
            //console.log("llenamos  Clientes");
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
      // console.log("Ya tenemos  Clientes");
      this.oCliente = JSON.parse(sessionStorage.getItem('Clientes'));
      this.oContenido = this.oCliente.Contenido[0];
      this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
      this.oDatosGenerales = this.oCliente.Contenido[0].DatosGenerales;
      this.oContacto = this.oCliente.Contenido[0].Contactos;
    }

    this.dtTrigger.next("");

  }

  //---- Modal clientes   ------------------------------------------------------
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

    } catch (err) {

    }
  }

  //---- Funcion para seleccionar cliente --------------------------------------
  obtenCliente(sCodigo: string, sFilial: string, sNombre: string) {

    if (this.bBanderaCliente) {//Si es true es cliente desde
      this.oBuscar.ClienteDesde = Number(sCodigo);
      this.oBuscar.FilialDesde = Number(sFilial);
    } else {
      this.oBuscar.ClienteHasta = Number(sCodigo);
      this.oBuscar.FilialHasta = Number(sFilial);
    }
    this.ModalActivo.dismiss('Cross click');
  }

  //---- Busqueda de cliente ---------------------------------------------------
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


  //---- Razon para salir del modal --------------------------------------------
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //---- Funcion para cerrar sesion y redireccionar al home --------------------
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);
  }

  //---- Detruye instancia del formulario --------------------------------------
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  //---- Se ejecuta despues de que se renderiza la vista -------------------------
  ngAfterViewInit(): void {
    this.dtTrigger.next("");
  }

  //---- Llama al servicio para consultar estadística de pedidos ---------------
  ConsultaEstadisticaPedidos() {
    this.sMensaje = '';
    this.bMostrarTabla = false;
    this.bError = false;
    this.isCollapsed = false;
    this.oPedEstadFilas = [] as PedEstadFilas[];

    // En caso necesario, en este espacio se pueden agregar validaciones
    // en los filtros antes de realizar la consulta a la API REST, por ejemplo:
    // if (!this.oBuscar.FechaDesde || !this.oBuscar.FechaHasta) {
    //   this.bError = true;
    //   this.sMensaje = 'Debe ingresar ambas fechas para realizar la consulta';
    //   return;
    // }

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next("");
    });

    // Carga de datos por medio del servicio
    this.bCargando = true;

    console.log('🔸Filtros enviados:', this.oBuscar);

    this._pedEstadistService.GetPedEstadist(this.oBuscar)
      .pipe(finalize(() => { this.bCargando = false }))
      .subscribe({
        next: (response: PedEstadistResponse) => {

          this.oPedEstadistResponse = response;

          if (this.oPedEstadistResponse.Codigo == 0) {
            this.bError = false;
            this.sMensaje = '';
            this.isCollapsed = true;

            this.oPedEstadFilas = this.oPedEstadistResponse.Contenido || [];
            console.dir(this.oPedEstadFilas);

            this.bMostrarTabla = true;

            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next("");
            });
            //
          } else {
            this.bError = true;
            this.isCollapsed = false;
            this.sMensaje = this.oPedEstadistResponse.Mensaje || 'No se obtuvieron datos para los filtros seleccionados';
          }
        },
        error: (err) => {

          console.error('Error en la petición:', err);

          this.bError = true;
          this.isCollapsed = false;
          this.bMostrarTabla = false;
          this.bCargando = false;

          // Mensaje amigable para UI
          this.sMensaje =
            err?.error?.Mensaje ||
            err?.message ||
            'Ocurrió un error al consultar la información';
        }
      });
  }

}
