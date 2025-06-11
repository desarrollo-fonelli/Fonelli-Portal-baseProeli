import {
  Component, OnInit, OnDestroy,
  ChangeDetectorRef, ElementRef,
  ViewChild, ViewChildren,
  QueryList
} from '@angular/core';

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';

// Modelos (heredado)
import { FiltrosClientes } from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';
import { FiltrosOficina } from 'src/app/models/oficina.filtros';
import { Oficina } from 'src/app/models/oficina';


// Modelos específicos del componente
import { GuiasFiltros } from './modelos/guias.filtros';
import { GuiaDocum, Paquete, ContenidoPaquete, GuiasResponse } from './modelos/guias.response';

// Servicios
import { ServicioClientes } from 'src/app/services/clientes.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { GuiasServicio } from './servicios/guias.servicio';

// Datatables
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { Guia } from 'src/app/models/consultaGuias';

/**
 * Clase principal del componente
 */
@Component({
  selector: 'app-guias2025',
  templateUrl: './guias2025.component.html',
  styleUrls: ['./guias2025.component.css'],
  providers: [DecimalPipe, ServicioClientes,
    ServicioOficinas, GuiasServicio
  ]
})
export class Guias2025Component implements OnInit {

  @ViewChild('containerTablaGuias') containerTablaGuias: ElementRef;

  searchtext = '';
  sCodigo: number | null;
  sTipo: string | null;
  sFilial: number | null;
  sNombre: string | null;

  // datatables
  @ViewChildren(DataTableDirective)
  datatableElementList: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();
  dtTrigger1: Subject<any> = new Subject();

  // entorno de la plantilla
  public isCollapsed = false;
  public bCliente: boolean;
  public bError: boolean = false;
  public sMensaje: string = '';
  //bBandera = false;   // indica si se muestra la tabla con la lista de pedidos
  public MostrarTablaGuias: boolean = false;
  public MostrarDetalle: boolean[] = [];    // Un elemento por cada fila de la tabla de paquetes (guias)
  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;
  public ModalActivo?: NgbModalRef;
  mobileQuery: MediaQueryList;

  fechaHoy: String;
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  closeResult = '';

  oFiltros: GuiasFiltros;
  oGuiasResponse: GuiasResponse;
  paquetes: Paquete[];
  guiadocums: GuiaDocum[];

  public arrDocTipos: string[] = [
    "Todos", "Factura", "Remision",
    "Prefactura", "Traspaso", "OrdenRetorno"
  ];

  public Buscar: FiltrosClientes;
  public oCliente: Clientes;
  public oContenido: Contenido;
  public oCondiciones: Condiciones;
  public oDatosGenerales: DatosGenerales;
  public oContacto: Contactos;

  public oBuscarOfi: FiltrosOficina;
  oOficinasRes: Oficina;

  private _mobileQueryListener: () => void;


  /**
   * Constructor de la clase
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private modalService: NgbModal,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioCClientes: ServicioClientes,
    private _servicioOficinas: ServicioOficinas,
    private _servicioGuias: GuiasServicio
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sTipo = sessionStorage.getItem('tipo');
    this.sCodigo = Number(sessionStorage.getItem('codigo'));
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

    this.oBuscarOfi = new FiltrosOficina('', 0)
    this.oOficinasRes = {} as Oficina;

    // Consulta de Paquetes (Guias)
    this.oFiltros = new GuiasFiltros('', 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', 1);
    this.oGuiasResponse = {} as GuiasResponse;
    this.paquetes = [];
    this.guiadocums = [];

    this.refreshCountries();
  }

  ngOnInit(): void {

    // Tabla con Lista de Paquetes (Guias)
    setTimeout(() => {

      this.dtOptions[0] = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        order: [],
        ordering: false,
        columnDefs: [
          { orderable: false, targets: "_all" }   // aplica la opción a todas las columnas
        ],
        dom: 'flBtipr',  //'flBtip',
        language: {
          emptyTable: 'No se encontraron registros',
          url: "cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        buttons: [
          {
            extend: 'excelHtml5',
            title: 'Lista de Paquetes (Guias)',
            text: '<p style="color: #f9f9f9; height: 9px;">Excel</p>',
            className: 'btnExcel btn',
          }
        ]
      };
    }, 2000);


    // código heredado ---------------------------------------------
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
    this.Buscar.TipoUsuario = this.sTipo;
    this.Buscar.Usuario = this.sCodigo;

    this.oFiltros.PedLetraBuscar = 'C';
    this.oFiltros.PedidoBuscar = '';
    this.oFiltros.OrdCompBuscar = '';
    this.oFiltros.DocTipoBuscar = 'Todos';


    let date: Date = new Date();
    let mes;

    //Valida mes
    if (date.getMonth().toString.length == 1) {
      mes = '0' + (date.getMonth() + 1);
    }
    this.fechaHoy = date.getDate() + '-' + mes + '-' + date.getFullYear();

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

            this.oFiltros.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo;
            this.oFiltros.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo;
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
      this.oFiltros.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo;
      this.oFiltros.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo;
    }

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

    this.dtTrigger0.next("");
    this.dtTrigger1.next("");

  }

  // valores para tipo de documento:
  // Todos | Factura | Remision | Prefactura | Traspaso | OrdenCompra

  /**
   * Llama el servicio para obtener el conjunto de datos aplicando los criterios
   * de filtro.
   * ---------
   * dRendon 02.06.2025
   */
  ConsultaGuias() {
    this.oFiltros.TipoUsuario = this.sTipo;
    if (this.oFiltros.ClienteCodigo == 0) {
      return;
    }

    this.MostrarTablaGuias = false;
    this.bCargando = true;

    // LLama al serviio que obtiene la lista de guias
    this._servicioGuias.GetPaquetes(this.oFiltros).subscribe(
      (response: GuiasResponse) => {
        this.oGuiasResponse = response;
        this.paquetes = this.oGuiasResponse.Contenido.Paquetes;

        if (this.oGuiasResponse.Codigo != 0) {
          this.bError = true;
          this.sMensaje = "No se encontraron paquetes";
          this.MostrarTablaGuias = false;
          this.bCargando = false;
          return;
        }

        // De inicio, todas la filas estárán contraidas
        this.MostrarDetalle = new Array(this.paquetes.length).fill(false);

        //console.dir(this.paquetes);
        //console.table(this.paquetes);
        this.sMensaje = '';
        this.bCargando = false;
        this.isCollapsed = true;
        //$("#tabla1").DataTable().destroy();
        //this.dtTrigger1.next("");

        $("#tablaGuias").DataTable().destroy();

        setTimeout(() => {
          this.dtTrigger0.next("");
        }, 2000)
        this.MostrarTablaGuias = true;

      },
      (error: GuiasResponse) => {
        this.oGuiasResponse = error;
        this.sMensaje = 'No se encontraron paquetes';
        console.log("error");
        console.log(this.oGuiasResponse);
        this.bCargando = false;
        return
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger0.unsubscribe();
    //this.dtTrigger1.unsubscribe();
    //this.dtTrigger2.unsubscribe();
    this.MostrarDetalle = [];
  }

  /**
  * ngAfterViewInit
  */
  ngAfterViewInit(): void {

    setTimeout(() => {
      this.dtTrigger0.next("");
    }, 2000);
    //this.dtTrigger1.next("");
    //this.dtTrigger2.next("");
  }

  /**
  * Funcion para actualizar los valores de la tabla de acuerdo a los registros a mostrar
  */
  refreshCountries() {
    //this.countries = COUNTRIES
    console.log('Inicio');
    console.table(this.paquetes);

    this.paquetes
      .map((c, i) => ({ id: i + 1, ...c }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
    console.log('Termina');
  }

  /**
   * Función para alternar la visibilidad de los detalles de un paquete (guía)
   * @param index Índice del paquete en la lista
   */
  toggleDetalles(index: number): void {
    this.MostrarDetalle[index] = !this.MostrarDetalle[index];
  }

}
