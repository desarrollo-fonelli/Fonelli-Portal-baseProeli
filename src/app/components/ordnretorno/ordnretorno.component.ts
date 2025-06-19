import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

// Datatables
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

// Modelos (heredado)
import { FiltrosClientes } from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';

// Modelos especificos del componente
import { FiltrosOrdnretorno } from './modelos/ordnretorno.filtros';
import { OrdRetoResponse, OrdRetoClte, OrdRetoDoc } from './modelos/ordreto.response';
import { OrdRetoArticulosFiltros } from './modelos/ordretoarticulos.filtros';

/**
 * Servicios
 */
import { ServicioClientes } from 'src/app/services/clientes.service';
import { ServicioOrdnretorno } from './servicios/ordnretorno.service';

/**
 * Componentes relacionados
 */
import { OrdretoarticulosComponent } from './ordretoarticulos.component';


/**
 * Definicion del Componente
 */
@Component({
  selector: 'app-ordnretorno',
  templateUrl: './ordnretorno.component.html',
  styleUrls: ['./ordnretorno.component.css'],
  providers: [DecimalPipe,
    ServicioOrdnretorno,
    ServicioClientes],
})

export class OrdnretornoComponent implements OnInit, OnDestroy {

  searchtext = '';
  sCodigo: number | null;
  sFilial: number | null;
  sTipo: string | null;
  sNombre: string | null;
  sWidth: number;
  sHeight: number;

  // datatables
  @ViewChild('pdfTable') pdfTable: ElementRef;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  persons = [];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  // entorno de la plantilla
  public isCollapsed = false;
  public bCliente: boolean;
  public bError: boolean = false;
  public sMensaje: string = '';
  bBandera = false;
  bBanderaTipo = false;
  bBanderaDeta = false;

  // Consulta y detalle de Ordenes de Retorno
  oBuscar: FiltrosOrdnretorno;  // modelo ordnretorno.filtros 
  oOrdRetoResponse: OrdRetoResponse;
  oOrdRetoCltes: OrdRetoClte[];

  fechaHoy: string;

  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  page = 1;
  pageSize = 4;
  collectionSize = 0;
  closeResult = '';
  public ModalActivo?: NgbModalRef;
  mobileQuery: MediaQueryList;

  public Buscar: FiltrosClientes;
  public oCliente: Clientes;
  public oContenido: Contenido;
  public oCondiciones: Condiciones;
  public oDatosGenerales: DatosGenerales;
  public oContacto: Contactos;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private modalService: NgbModal,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioCClientes: ServicioClientes,
    private _servicioConsOrdnReto: ServicioOrdnretorno
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

    //Inicializamos variables consulta Ordenes de Retorno (filtros)
    this.oBuscar = new FiltrosOrdnretorno('', 0, 0, 0, 0, 0, 0, '', '', 0);
    this.oOrdRetoResponse = {} as OrdRetoResponse;
    this.oOrdRetoCltes = [];

  }

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false, // evita que DataTables calcule anchos incorrectos
      scrollX: true,
      processing: true,
      order: [],
      ordering: false,
      dom: 'flBtipr',   //'flBtip'
      language: {
        emptyTable: 'No se encontraron registros',
        url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Consulta Ordenes de Retorno',
          text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
          className: "btnExcel btn"
        }
      ]
    };


    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    this.oBuscar.TipoUsuario = this.sTipo;

    switch (this.sTipo) {
      case 'C': {
        //Tipo cliente
        this.bCliente = true;
        this.oBuscar.Usuario = this.sCodigo + '-' + this.sFilial;
        this.oBuscar.ClienteCodigo = this.sCodigo;
        this.oBuscar.ClienteFilial = this.sFilial;
        break;
      }
      case 'A': {
        //Agente;
        this.bCliente = false;
        this.oBuscar.Usuario = this.sCodigo;
        break;
      }
      case 'G': {
        //Gerente;
        this.bCliente = false;
        this.oBuscar.Usuario = this.sCodigo;
        break;
      }
    }

    this.Buscar.TipoUsuario = this.sTipo;
    this.Buscar.Usuario = this.sCodigo;
    this.oBuscar.Status = 'T';
    this.oBuscar.OrdenRepo = 'ClteFolio';

    if (this.sTipo == 'A') {
      this.oBuscar.AgenteCodigo = this.sCodigo;
    }

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

  shouldRun = true;

  //Funcion para consultar las Ordenes de Retorno
  consultaOrdenesRetorno() {

    this.oBuscar.TipoUsuario = this.sTipo;
    this.bBandera = false;
    this.bCargando = true;
    this.isCollapsed = false;

    this.oOrdRetoCltes = [];

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next("");
    });

    //Realizamos llamada al servicio de consulta de ordenes de retorno
    this._servicioConsOrdnReto.Get(this.oBuscar).subscribe(
      (Response: OrdRetoResponse) => {

        this.oOrdRetoResponse = Response;

        if (this.oOrdRetoResponse.Codigo != 0) {
          this.bError = true;
          this.sMensaje = 'No se encontraron Ordenes de Retorno';
          this.bBandera = false;
          this.bCargando = false;
          this.isCollapsed = false;
          return;
        }

        this.oOrdRetoCltes = this.oOrdRetoResponse.Contenido.OrdRetoCltes;
        //console.log(" ✔ ------------ ✨ tabla cargada");
        //console.dir(this.oOrdRetoCltes);

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next("");
        });

        this.sMensaje = '';
        this.bCargando = false;
        this.isCollapsed = true;
        this.bBandera = true;

        // console.log('🔸 servicioConsOrdReto - final');
        // $("#tabla0").DataTable().destroy();
        //this.dtTrigger0.next("");

      },
      (error: OrdRetoResponse) => {

        //    this.oGuiaRes = { "Codigo": 0, "Mensaje": "success", "Paginacion": { "NumFilas": 1, "TotalPaginas": 1, "Pagina": 1 }, "Contenido": [{ "Oficina": "001", "Serie": "SAFD1526ETY14", "Documento": "223", "Fecha": "11/05/2023", "TC": "02", "Carrier": "UPS", "NumeroGuia": "1203669750490295056", "FechaGuia": "18/05/2023", "FechaRecepcion": "18/05/2023", "Observaciones": "Recepcion", "NumeroCliente": "46", "Filial": "0", "Importe": "2540", "Piezas": "6", "Gramos": "3.65", "TipoPedido": "G", "Pedido": "3652" }, { "Oficina": "002", "Serie": "SAFD1526E6542", "Documento": "224", "Fecha": "11/05/2023", "TC": "02", "Carrier": "UPS", "NumeroGuia": "1203669750490296545", "FechaGuia": "18/05/2023", "FechaRecepcion": "18/05/2023", "Observaciones": "Recepcion", "NumeroCliente": "46", "Filial": "0", "Importe": "3900", "Piezas": "10", "Gramos": "1.65", "TipoPedido": "G", "Pedido": "2565" }] }
        //    this.guias = this.oGuiaRes.Contenido

        this.oOrdRetoResponse = error;
        this.sMensaje = 'No se encontraron Ordenes de Retorno';
        console.log('🔸 .................> error');
        console.log(this.oOrdRetoResponse);
        this.bCargando = false;
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

    this.oBuscar.ClienteCodigo = Number(sCodigo);
    this.oBuscar.ClienteFilial = Number(sFilial);

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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //this.OrdnRetoDeta = [];
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //this.OrdnRetoDeta = [];
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next("");
  }

  /**
  * Funcion para actualizar los valores de la tabla de acuerdo a los registros a mostrar
  */
  refreshCountries() {
    //this.countries = COUNTRIES
    console.log('Inicio refreshCountries');
    console.table(this.oOrdRetoCltes);

    this.oOrdRetoCltes
      .map((c, i) => ({ id: i + 1, ...c }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
    console.log('Termina refreshCountries');
  }

  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);
  }


  /**
  * Muestra articulos incluidos en la Orden de Retorno
  */
  OpenModalOrdRetoArticulos(ord: any) {

    let oOrdRetoArticulosFiltros: OrdRetoArticulosFiltros;

    oOrdRetoArticulosFiltros = {
      TipoUsuario: this.oBuscar.TipoUsuario,
      Usuario: this.oBuscar.Usuario,
      ClienteCodigo: this.oBuscar.ClienteCodigo,
      ClienteFilial: this.oBuscar.ClienteFilial,
      Folio: ord.Folio
    };

    const modalRef = this.modalService.open(OrdretoarticulosComponent, { size: 'lg' });
    modalRef.componentInstance.oArticFiltros = oOrdRetoArticulosFiltros;

  }

}

