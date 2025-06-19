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
import { DocumArticFiltros } from './modelos/documartic.filtros';

// Servicios
import { ServicioClientes } from 'src/app/services/clientes.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { GuiasServicio } from './servicios/guias.servicio';

// Datatables
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { DocumArticulosComponent } from '../docum-articulos/docum-articulos.component';

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
  //dtTrigger2: Subject<any> = new Subject();

  // entorno de la plantilla
  public isCollapsed = false;
  public bCliente: boolean;
  public bError: boolean = false;
  public sMensaje: string = '';
  //bBandera = false;   // indica si se muestra la tabla con la lista de pedidos
  public MostrarTablaGuias: boolean = false;
  public MostrarDetalle: boolean = false;
  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;
  public ModalActivo?: NgbModalRef;
  mobileQuery: MediaQueryList;

  fechaDesde: String;
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

  sPaquete: string;
  sFechaPaq: string;
  sStatus: string;
  sGuia: string;
  sFechaRecep: string;
  sObservac: string;

  sHeadClteNum: string;
  sHeadClteFil: string;
  sHeadClteNom: string;

  //oParam: any = {};

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
    this.oFiltros = new GuiasFiltros('', 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', 1);
    this.oGuiasResponse = {} as GuiasResponse;
    this.paquetes = [];
    this.guiadocums = [];

    this.refreshCountries();

    this.sHeadClteNum = '';
    this.sHeadClteFil = '';
    this.sHeadClteNom = '';

  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {

    // Tabla con Lista de Paquetes (Guias)
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
          title: 'Lista de Paquetes (Guias)',
          text: '<p style="color: #f9f9f9; height: 9px;">Excel</p>',
          className: 'btnExcel btn',
        }
      ]
    };

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
          title: 'Lista de Paquetes (Guias)',
          text: '<p style="color: #f9f9f9; height: 9px;">Excel</p>',
          className: 'btnExcel btn',
        }
      ]
    };


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

    // Asigna a la "Fecha desde" el valor de tres meses atrás
    let date: Date = new Date();
    date.setMonth(date.getMonth() - 3);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear();

    //this.oFiltros.FechaDesdeBuscar = `${dia}/${mes}/${anio}`;
    this.oFiltros.FechaDesdeBuscar = `${anio}-${mes}-${dia}`;
    //console.log('🔸' + this.oFiltros.FechaDesdeBuscar);

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


  /**
   * Llama el servicio para obtener el conjunto de datos aplicando los criterios
   * de filtro.
   * ---------
   * dRendon 02.06.2025
   */
  ConsultaGuias() {

    this.sMensaje = '';

    this.sPaquete = "";
    this.sFechaPaq = "";
    this.sStatus = "";
    this.sGuia = "";
    this.sFechaRecep = "";
    this.sObservac = "";

    this.sHeadClteNum = '';
    this.sHeadClteFil = '';
    this.sHeadClteNom = '';

    this.paquetes = [];
    $("#tabla1").DataTable().destroy();
    this.dtTrigger1.next("");

    $("#tabla0").DataTable().destroy();
    this.dtTrigger0.next("");

    this.MostrarTablaGuias = false;
    this.MostrarDetalle = false;

    if (this.oFiltros.ClienteCodigo == 0) {
      if (this.oFiltros.DocTipoBuscar == 'Todos' &&
        (this.oFiltros.PedidoBuscar == '' || this.oFiltros.PedidoBuscar.trim() == '0') &&
        (this.oFiltros.OrdCompBuscar == '' || this.oFiltros.OrdCompBuscar.trim() == '0') &&
        (this.oFiltros.PaqueteBuscar == '' || this.oFiltros.PaqueteBuscar == '0')
      ) {
        this.sMensaje = "Si no indica número de cliente debe indicar algún otro criterio de búsqueda...";
        this.bCargando = false;
        return;
      }
    }

    if (this.oFiltros.DocTipoBuscar != 'Todos') {
      if (this.oFiltros.DocFolioBuscar == '' || this.oFiltros.DocFolioBuscar == '0') {
        this.sMensaje = "Debe indicar Folio de Documento para " + this.oFiltros.DocTipoBuscar;
        this.bCargando = false;
        return;
      }
    }

    //console.table(this.oFiltros);

    this.bCargando = true;
    this.oFiltros.TipoUsuario = this.sTipo;

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

        this.sHeadClteNum = this.oGuiasResponse.Contenido.ClienteCodigo;
        this.sHeadClteFil = this.oGuiasResponse.Contenido.ClienteFilial;
        this.sHeadClteNom = this.oGuiasResponse.Contenido.ClienteNombre;

        //console.dir(this.paquetes);
        //console.table(this.paquetes);
        this.sMensaje = '';
        this.bCargando = false;
        this.isCollapsed = true;
        this.MostrarTablaGuias = true;

        // datos nuevos, se destruyen las instancias y despues
        // se llama el dttrigger para renderizar otra vez 
        $("#tabla1").DataTable().destroy();
        this.dtTrigger1.next("");

        $("#tabla0").DataTable().destroy();
        this.dtTrigger0.next("");

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
    this.dtTrigger1.unsubscribe();

    this.MostrarDetalle = false;
    this.MostrarTablaGuias = false;
  }

  /**
  * ngAfterViewInit
  */
  ngAfterViewInit(): void {

    this.dtTrigger0.next("");
    this.dtTrigger1.next("");
  }

  /**
  * Funcion para actualizar los valores de la tabla de acuerdo a los registros a mostrar
  */
  refreshCountries() {
    //this.countries = COUNTRIES
    console.log('Inicio refreshCountries');
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
   * Muestra tabla con documentos que incluye el Paquete
   */
  ClicDetallePaquete(oPaq: any): void {
    //console.dir(oPaq);
    //console.table(oPaq.GuiaDocums);

    // variables para card de paquetes
    this.sPaquete = oPaq.Paquete;
    this.sFechaPaq = oPaq.FechaPaq ? oPaq.FechaPaq.toString() : '';
    this.sStatus = oPaq.Status;
    this.sGuia = oPaq.Guia;
    this.sFechaRecep = oPaq.FechaRecep;
    this.sObservac = oPaq.Observac;

    // objeto con la fila elegida
    this.guiadocums = oPaq.GuiaDocums;

    // destruyo las tabblas y las renderizo sin datos para que no 
    // se dupliquen las filas en caso de repetir la consulta
    $("#tabla1").DataTable().destroy();
    this.dtTrigger1.next("");

    this.MostrarTablaGuias = false;
    this.MostrarDetalle = true;
  }

  /**
 * Oculta detalle del Paquete y muestra lista de Paquetes
 */
  ClicCerrarDetalle(): void {
    this.MostrarDetalle = false;
    this.MostrarTablaGuias = true;
  }

  /**
  * Muestra articulos incluidos en el documento asociado
  * al paquete (guia) seleccionado.
  */
  OpenModalDocumArticulos(doc: any) {

    let oDocumArticFiltros: DocumArticFiltros;

    oDocumArticFiltros = {
      Usuario: this.oFiltros.Usuario,
      TipoUsuario: this.oFiltros.TipoUsuario,
      ClienteCodigo: this.oFiltros.ClienteCodigo,
      ClienteFilial: this.oFiltros.ClienteFilial,
      DocTipo: doc.DocTipo,
      DocSerie: doc.DocSerie,
      DocFolio: doc.DocFolio,
      DocFecha: doc.DocFecha
    };

    //console.log("🔸 estoy en OpenModalDocumArticulos");
    //console.dir(oDocumArticFiltros);

    const modalRef = this.modalService.open(DocumArticulosComponent, { size: 'lg' });
    modalRef.componentInstance.oDocArtFiltros = oDocumArticFiltros;

  }

  ActualizarFechaDesde(): void {

    let fecha: string = '';
    let date: Date = new Date();

    // String con documentos de búsqueda
    const strDocCriterios =
      (this.oFiltros.DocFolioBuscar + this.oFiltros.PedidoBuscar +
        this.oFiltros.OrdCompBuscar + this.oFiltros.PaqueteBuscar).trim();

    // Si se indica algún criterio de búsqueda, se asigna una fecha "dura" a la fecha base,
    // de lo contrario, se asigna la fecha de hace tres meses
    if (strDocCriterios.length > 0) {
      fecha = '2024-01-01'; // Fecha fija para pruebas
    } else {
      // Asigna a la "Fecha desde" el valor de tres meses atrás
      date.setMonth(date.getMonth() - 3);
      fecha = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD    
    }

    this.oFiltros.DocumSinGuia = 'S';
    this.oFiltros.FechaDesdeBuscar = fecha;
    //console.log('🔸' + this.oFiltros.FechaDesdeBuscar);

    return
  }

  CambiaTipoDocumento(tipoDoc: string): void {
    // en realidad no importa el tipo de documento seleccionado,
    // de todos modos voy a cambiar los valores asociados
    this.oFiltros.DocSerieBuscar = '';
    this.oFiltros.DocFolioBuscar = '';

    return
  }

}
