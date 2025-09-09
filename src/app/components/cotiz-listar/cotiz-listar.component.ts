import {
  Component, OnInit,
  ChangeDetectorRef, ElementRef, ViewChild
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

/**
 * Modelos (heredado)
 */
import { FiltrosClientes } from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';

/**
 * Modelos especificos del componente
 */
import { CotizListarFiltros } from './modelos/cotiz-listar.filtros'
import { CotizListarResponse, CotizDocum } from './modelos/cotiz-listar.models';

/**
 * Servicios
 */
import { FuncFechasService } from 'src/app/core/services/func-fechas.service';
import { ServicioClientes } from 'src/app/services/clientes.service';
import { CotizListarService } from './servicios/cotiz-listar.service';


@Component({
  selector: 'app-cotiz-listar',
  templateUrl: './cotiz-listar.component.html',
  styleUrls: ['./cotiz-listar.component.css'],
  providers: [DecimalPipe,
    ServicioClientes,
    CotizListarService]
})
export class CotizListarComponent implements OnInit {

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
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  // entorno de la plantilla
  public isCollapsed = false;
  public bCliente: boolean;
  public bError: boolean = false;
  public sMensaje: string = '';
  mostrarTabla = false;

  oFiltros: CotizListarFiltros = {
    TipoUsuario: '', Usuario: 0,
    ClienteCodigo: 0, ClienteFilial: 0, AgenteCodigo: 0,
    FechaDesde: '', FechaHasta: '', FolioDesde: 0, FolioHasta: 999999,
    Status: '', Pagina: 1
  }

  oCotizListarResponse: CotizListarResponse;
  oCotizDocumentos: CotizDocum[];

  docElegido: any | null = null;    // documento que se va a editar

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

  /**
   * Constructor del componente ------------------------------
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private modalService: NgbModal,
    private _route: ActivatedRoute,
    private _router: Router,
    private _funcFechasService: FuncFechasService,
    private _servicioCClientes: ServicioClientes,
    private _servicioCotizListar: CotizListarService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sTipo = sessionStorage.getItem('tipo');
    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');

    this.bCliente = false;

    this.oCotizListarResponse = {} as CotizListarResponse;
    this.oCotizDocumentos = [];

    // Consulta de clientes
    this.Buscar = new FiltrosClientes(0, 0, 0, '', 0);
    this.oCliente = {} as Clientes;
    this.oContenido = {} as Contenido;
    this.oCondiciones = {} as Condiciones;
    this.oDatosGenerales = {} as DatosGenerales;
    this.oContacto = {} as Contactos;

  }

  /**
   * Inicialización de los elementos del componente
   */
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
          title: 'Lista de Cotizaciones de Venta',
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

    this.oFiltros.TipoUsuario = this.sTipo;

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
      case 'G': {
        //Gerente;
        this.bCliente = false;
        this.oFiltros.Usuario = this.sCodigo;
        break;
      }
    }
    this.oFiltros.Status = 'T';

    this.Buscar.TipoUsuario = this.sTipo;   // los usa el servicio de clientes
    this.Buscar.Usuario = this.sCodigo;

    if (this.sTipo == 'A') {
      this.oFiltros.AgenteCodigo = this.sCodigo;
    }


    this.fechaHoy = this._funcFechasService.fechaHoy_aaaammdd();
    this.oFiltros.FechaDesde = '2025-01-01';
    this.oFiltros.FechaHasta = this.fechaHoy;


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
   * Funcion que gestiona la llamada al servicio para recuperar datos y realiza las
   * configuraciones para presentar la información en la pantilla HTML
   */
  listarCotizaciones() {

    this.oFiltros.TipoUsuario = this.sTipo;
    this.mostrarTabla = false;
    this.bCargando = true;
    this.isCollapsed = false;

    this.oCotizDocumentos = [];

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next("");
    });

    this._servicioCotizListar.GetCotizac(this.oFiltros).subscribe({
      next: (response) => {
        this.oCotizListarResponse = response;

        if (this.oCotizListarResponse.Codigo != 0) {
          this.bError = true;
          this.sMensaje = 'No se encontraron Cotizaciones. Revise sus criterios de filtro';
          this.mostrarTabla = false;
          this.bCargando = false;
          this.isCollapsed = false;
          return;
        }

        this.oCotizDocumentos = this.oCotizListarResponse.Contenido.CotizDocumentos
        //console.dir(this.oCotizDocumentos);

        // Inicializa la propiedad que indica si se expande cada fila
        this.oCotizDocumentos.forEach(doc => doc.expanded = false);

        // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //   // Destroy the table first
        //   dtInstance.destroy();
        //   // Call the dtTrigger to rerender again
        //   this.dtTrigger.next("");
        // });

        this.rerender();

        this.sMensaje = '';
        this.bCargando = false;
        this.isCollapsed = true;
        this.mostrarTabla = true;

      },
      error: (err) => {
        this.sMensaje = 'Error recuperando información. Intente más tarde.';
        this.bCargando = false;
        console.log('🔸... Error:');
        console.error(err.message);
      }
    });

  }


  /**
  * Modal para mostrar Lista de Clientes
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
 */
  obtenCliente(sCodigo: string, sFilial: string) {

    this.oFiltros.ClienteCodigo = Number(sCodigo);
    this.oFiltros.ClienteFilial = Number(sFilial);

    this.ModalActivo.dismiss('Cross click');
  }

  /**
   * Busca clientes
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
   * Funcion para cerrar sesion y redireccionar al home
   */
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);
  }

  /**
   * Muestra/oculta una fila hija de DataTables con los detalles del documento.
   * @param doc El objeto del documento.
   * @param index El índice de la fila en la tabla.
   */
  toggleDetails(doc: CotizDocum, index: number): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const row = dtInstance.row(index);

      if (row.child.isShown()) {
        // Esta fila ya está abierta, así que la cerramos
        row.child.hide();
        doc.expanded = false;
      } else {
        // Abrimos una nueva fila
        row.child(this.formatDetails(doc.FilasDoc)).show();
        doc.expanded = true;
      }
    });
  }

  /**
 * Genera el HTML para la tabla de detalles anidada.
 * @param filasDoc El array de artículos del documento.
 * @returns Un string con el HTML de la tabla.
 */
  formatDetails(filasDoc: any[]): string {
    let detailsHtml = '<div class="p-3" style="background-color: #f0f8ff;">' +
      '<h6 class="h6 fw-bold mb-2">Artículos de la Cotización</h6>' +
      '<table class="table table-sm table-bordered">' +
      '<thead class="thead-light"><tr>' +
      '<th>Fila</th><th>Línea</th><th>Modelo</th><th>Descripción</th><th>Ktje</th>' +
      '<th class="text-end">Piezas</th><th class="text-end">Gramos</th>' +
      '<th>Calc</th><th class="text-end">PrecUnit</th><th class="text-end">Importe</th>' +
      '</tr></thead><tbody>';

    filasDoc.forEach(fila => {
      // Nota: No podemos usar pipes de Angular aquí, formateamos manualmente.
      const piezas = fila.Piezas.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      const gramos = fila.Gramos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const precio = fila.Precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const importe = fila.Importe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      detailsHtml += `<tr>
          <td>${fila.Fila}</td>
          <td>${fila.LineaPT}</td>
          <td>${fila.ItemCode}</td>
          <td>${fila.Descripc}</td>
          <td>${fila.Kilataje}</td>
          <td class="text-end">${piezas}</td>
          <td class="text-end">${gramos}</td>
          <td>${(fila.TipoCosteo == '1') ? 'Pzas' : 'Grms'}</td>
          <td class="text-end">${precio}</td>
          <td class="text-end">${importe}</td>
        </tr>`;
    });

    detailsHtml += '</tbody></table></div>';
    return detailsHtml;
  }

  /**
   * Función helper para rerender <<<---------------------
   */
  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null); // Usamos next(null) en versiones más recientes
      });
    } else {
      this.dtTrigger.next(null);
    }
  }

  /**
   * Controla la presentación del formulario para editar la Cotización recibida como
   * objeto, la cual corresponde a la fila seleccionada en la tabla de cotizaciones.
   */
  FormCotizac(doc: any): void {

    this.docElegido = doc;
    //console.log('🔸Folio:' + doc.Folio);

    this.mostrarTabla = false;

    return;
  }

  /**
   * Método asociado al evento "finEdicion" emitido por el formulario de edicion
   */
  edicionTerminada() {

    // TODO: Aquí se puede aprovechar para refrescar el objeto con los datos editados
    // si no lo haz hecho antes.

    this.mostrarTabla = true;
  }
}
