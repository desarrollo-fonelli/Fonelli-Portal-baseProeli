import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subject, timer } from 'rxjs';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';

// Modelos (heredado)
import { FiltrosClientes } from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';
import { Lineas, Contenido as LineasCon } from 'src/app/models/lineas';
import { FiltrosLineas } from 'src/app/models/lineas.filtros';

// Modelos e interfaces específicos al módulo
import { FiltrosArticulosReporte } from './modelos/articulos-reporte.filtros';
import { ArticulosResponse, ContenidoArticulo } from './modelos/articulos-reporte.response';

// Servicios
import { ServicioClientes } from 'src/app/services/clientes.service';
import { ServicioLineas } from 'src/app/services/lineas.service';
import { ArticulosReporteService } from './servicios/articulos-reporte.service';
import { OrdRetoArticulosResponse } from '../ordnretorno/modelos/ordretoarticulos.response';

@Component({
  selector: 'app-articulos-reporte',
  templateUrl: './articulos-reporte.component.html',
  styleUrls: ['./articulos-reporte.component.css'],
  providers: [
    ServicioLineas,
    ServicioClientes,
    ArticulosReporteService
  ]

})
export class ArticulosReporteComponent implements OnInit {

  searchtext = '';
  sTipoUsuario: string | null;     // tipo de usuario
  sCodigo: string | null;          // usuario loggeado
  sFilial: number | null;
  sNombre: string | null;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  oBuscarLineas: FiltrosLineas;
  oLineasRes: Lineas;
  oLineasCon: LineasCon[];

  oBuscar: FiltrosArticulosReporte;
  oArticulosResponse: ArticulosResponse;
  oFilasArticulos: ContenidoArticulo[];

  bError: boolean = false;
  sMensaje: string = "";
  bCliente: boolean;
  mostrarTabla: boolean;
  isCollapsed = false;

  fechaHoy: String
  bCargando: boolean = false;
  bCargandoClientes: boolean = false;
  bBanderaCliente: boolean;

  // relacionados con el componente para buscar clientes
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  closeResult = '';
  ModalActivo?: NgbModalRef;
  Buscar: FiltrosClientes;
  oCliente: Clientes;
  oContenido: Contenido;
  oCondiciones: Condiciones;
  oDatosGenerales: DatosGenerales;
  oContacto: Contactos;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private modalService: NgbModal,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioCClientes: ServicioClientes,
    private _servicioLineas: ServicioLineas,
    private _servicioArticulosReporte: ArticulosReporteService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sTipoUsuario = sessionStorage.getItem('tipo');
    this.sCodigo = sessionStorage.getItem('codigo');
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');

    this.bCliente = false;
    this.mostrarTabla = false;

    // Filtros de este formulario
    this.oBuscar = {
      TipoUsuario: '', Usuario: '', LineaPTDesde: '', LineaPTHasta: '',
      ClienteCodigo: 0, ClienteFilial: 0, ItemCode: '', Status: 'A',
      BuscarSemejantes: false
    };

    this.oArticulosResponse = {} as ArticulosResponse;
    this.oFilasArticulos = [];

    // Consulta de clientes
    this.Buscar = new FiltrosClientes(0, 0, 0, '', 0);
    this.oCliente = {} as Clientes;
    this.oContenido = {} as Contenido;
    this.oCondiciones = {} as Condiciones;
    this.oDatosGenerales = {} as DatosGenerales;
    this.oContacto = {} as Contactos;

  }

  ngOnInit(): void {

    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

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
        url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Consulta de Artículos',
          text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
          className: "btnExcel btn"
        }
      ]
    };
    this.dtOptions[1] = {
      pagingType: 'full_numbers',
      destroy: true,
      pageLength: 10,
      processing: true,
      fixedHeader: {
        header: true,
        footer: false
      },
      order: [],
      ordering: false,
      dom: 'flBtip',
      language: {
        url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Consulta de Artículos',
          text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
          className: "btnExcel btn"
        }
      ]
    };

    // Esta consulta solo es para asesores y gerentes de venta
    switch (this.sTipoUsuario) {
      case 'C': {
        //Cliente
        this.bCliente = true;
        this.oBuscar.Usuario = this.sCodigo + '-' + this.sFilial;
        this.oBuscar.ClienteCodigo = this.sCodigo;
        this.oBuscar.ClienteFilial = this.sFilial;
        break;
      }
      case 'A': {
        //Agente;            
        this.oBuscar.Usuario = this.sCodigo;
        this.bCliente = false;
        break;
      }
      default: {
        //Gerente;
        this.oBuscar.Usuario = this.sCodigo;
        this.bCliente = false;
        break;
      }
    }

    this.Buscar.TipoUsuario = this.sTipoUsuario;  // filtros clientes
    this.Buscar.Usuario = this.sCodigo;

    this.oBuscar.TipoUsuario = this.sTipoUsuario;
    this.Buscar.Usuario = this.sCodigo;
    this.oBuscar.LineaPTHasta = 'ZZ';
    this.oBuscar.Status = 'A';
    this.oBuscar.BuscarSemejantes = true;

    /*****************************
     * Consulta lineas de producto
     */
    if (!sessionStorage.getItem('Lineas')) {

      console.log("🔸 Lineas no existen");
      //Realizamos llamada al servicio de lineas
      this._servicioLineas
        .Get(this.oBuscarLineas)
        .subscribe(
          (Response: Lineas) => {

            this.oLineasRes = Response;
            //console.log("RESULTADO LLAMADA Oficinas "+JSON.stringify(this.oOficinasRes) );
            //console.log(this.pedido);

            if (this.oLineasRes.Codigo != 0) {
              this.bError = true;
              this.sMensaje = "No se encontraron Lineas";
              return;
            }

            console.log("Cargamos Lineas");
            sessionStorage.setItem('Lineas', JSON.stringify(this.oLineasRes));
            this.oLineasCon = this.oLineasRes.Contenido
            this.oBuscar.LineaPTDesde = this.oLineasRes.Contenido[0].LineaCodigo;
            this.oBuscar.LineaPTHasta = this.oLineasRes.Contenido[this.oLineasRes.Contenido?.length - 1].LineaCodigo;
            this.sMensaje = "";
          },
          (error: Lineas) => {
            this.oLineasRes = error;
            this.sMensaje = "No se encontraron Lineas";
            console.log("🔸 error LineasPT");
            console.log(this.oLineasRes);
            return;
          }
        );
    } else {
      //console.log("Lineas ya existen");
      this.oLineasRes = JSON.parse(sessionStorage.getItem('Lineas'));
      this.oLineasCon = this.oLineasRes.Contenido
      this.oBuscar.LineaPTDesde = this.oLineasRes.Contenido[0].LineaCodigo;
      this.oBuscar.LineaPTHasta = this.oLineasRes.Contenido[this.oLineasRes.Contenido?.length - 1].LineaCodigo;
    }

    //Realizamos llamada al servicio de clientes 
    if (!sessionStorage.getItem('Clientes')) {

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

    } else {
      //console.log("Ya tenemos  Clientes");
      this.oCliente = JSON.parse(sessionStorage.getItem('Clientes'));
      this.oContenido = this.oCliente.Contenido[0];
      this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
      this.oDatosGenerales = this.oCliente.Contenido[0].DatosGenerales;
      this.oContacto = this.oCliente.Contenido[0].Contactos;
    }

    this.dtTrigger.next("");

  }

  /**************************************************************
   * Esta función llama el servicio que obtiene de la API REST
   * el conjunto de datos que se va a presentar en la tabla HTML
   */
  ConsultaArticulos() {
    this.sMensaje = '';
    this.mostrarTabla = false;
    this.isCollapsed = false;
    this.bCargando = false;
    this.oFilasArticulos = []
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next("");
    });

    if (this.oBuscar.ClienteCodigo == 0) {
      this.sMensaje += 'Código de cliente no indicado. Se usara la Lista 11 con paridad Normal para calcular los precios';
      //return;
    }

    //console.table(this.oBuscar);
    this.bCargando = true;

    this._servicioArticulosReporte.Get(this.oBuscar)
      .subscribe(
        (response: ArticulosResponse) => {
          this.oArticulosResponse = response;
          this.oFilasArticulos = this.oArticulosResponse.Contenido;

          if (this.oArticulosResponse.Codigo != 0) {
            this.sMensaje = 'No se encontraron modelos con los criterios de búsqueda';
            this.bCargando = false;
            this.mostrarTabla = false;
            return;
          }

          this.sMensaje = '';
          this.bCargando = false;
          this.isCollapsed = true;
          this.mostrarTabla = true;

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next("");
          });

        },
        (error: ArticulosResponse) => {
          this.oArticulosResponse = error;
          //console.log(this.oArticulosResponse);
          this.bCargando = false;
          this.mostrarTabla = false;
          this.sMensaje = 'Error recuperando registros...';
          console.log('🔸 ...> error');
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
  */
  obtenCliente(sCodigo: string, sFilial: string) {

    this.oBuscar.ClienteCodigo = Number(sCodigo);
    this.oBuscar.ClienteFilial = Number(sFilial);

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

  ngAfterViewInit(): void {
    this.dtTrigger.next("");
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


}
