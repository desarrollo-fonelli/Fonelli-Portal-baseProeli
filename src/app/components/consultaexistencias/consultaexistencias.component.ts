import {
  Component, OnInit, OnDestroy,
  ChangeDetectorRef, ElementRef,
  ViewChildren, ViewChild, QueryList
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

// Modelos
import { FiltrosExistencias } from 'src/app/models/existencias.filtros';
import { ConsultaExist, ContenidoExist } from 'src/app/models/consultaexistencias';
import { FiltrosOficina } from 'src/app/models/oficina.filtros';
import { Oficina } from 'src/app/models/oficina';
import { FiltrosLineas } from 'src/app/models/lineas.filtros';
import { Lineas, Contenido as LineasCon } from 'src/app/models/lineas';
import { FiltrosAlmacenes } from 'src/app/models/almacenes.filtros';
import { Almacenes, Almacen as ContenidoAlmacen } from 'src/app/models/almacenes';

// Servicios
import { ServicioExistencias } from 'src/app/services/existencias.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { ServicioLineas } from 'src/app/services/lineas.service';
import { ServicioAlmacenes } from 'src/app/services/almacenes.service';


// Otros
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-consultaexistencias',
  templateUrl: './consultaexistencias.component.html',
  styleUrls: ['./consultaexistencias.component.css'],
  providers: [
    DecimalPipe,
    ServicioOficinas,
    ServicioLineas,
    ServicioAlmacenes,
    ServicioExistencias
  ]
})

export class ConsultaexistenciasComponent implements OnInit, OnDestroy {

  searchtext = '';
  sTipo: string | null;     // tipo de usuario
  sCodigo: string | null;   // usuario loggeado
  sFilial: number | null;
  sNombre: string | null;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public oBuscar: FiltrosExistencias;
  oExistencRes: ConsultaExist;
  public oBuscarOfi: FiltrosOficina;
  oOficinasRes: Oficina;

  existRows: ContenidoExist[];

  public oBuscarLineas: FiltrosLineas;
  oLineasRes: Lineas;
  oLineasCon: LineasCon[];

  public oBuscarAlmac: FiltrosAlmacenes;
  oAlmacRes: Almacenes;
  oAlmacContenido: ContenidoAlmacen[];

  public bError: boolean = false;
  public sMensaje: string = "";
  public bCliente: boolean;
  bBandera: boolean;
  public isCollapsed = false;

  fechaHoy: String
  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  closeResult = '';
  public ModalActivo?: NgbModalRef;
  public bBanderaCliente: boolean;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private modalService: NgbModal,
    private _servicioExistencias: ServicioExistencias,
    private _servicioOficinas: ServicioOficinas,
    private _servicioLineas: ServicioLineas,
    private _servicioAlmacenes: ServicioAlmacenes) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sTipo = sessionStorage.getItem('tipo');
    //console.log(sessionStorage.getItem('tipo'));
    if (sessionStorage.getItem('tipo') == 'C') {
      this.sCodigo = sessionStorage.getItem('codigo') + '-' + sessionStorage.getItem('filial');
    }
    else {
      this.sCodigo = sessionStorage.getItem('codigo');
    }
    //console.log("🔸this.sCodigo: ", this.sCodigo);
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');

    this.oBuscar = new FiltrosExistencias('', '', '', '', '', '', '', '', '', 0);
    this.oExistencRes = {} as ConsultaExist;
    this.existRows = [];
    this.oBuscarOfi = new FiltrosOficina('', 0);
    this.oOficinasRes = {} as Oficina;

    this.oBuscarAlmac = new FiltrosAlmacenes('', '', 0);

    this.bCliente = false;
    this.bBandera = false;

  }

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
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Consulta de Existencias',
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
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Consulta de Existencias',
          text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
          className: "btnExcel btn"
        }
      ]
    };

    this.mobileQuery.removeListener(this._mobileQueryListener);

    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    // Esta consulta solo es para asesores y gerentes de venta
    switch (this.sTipo) {
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

    this.oBuscar.TipoUsuario = this.sTipo;
    this.oBuscar.Usuario = this.sCodigo;
    this.oBuscar.LineaPTHasta = 'ZZ';
    this.oBuscar.AlmacHasta = 'Z999999';
    this.oBuscar.SoloExist = 'S';

    //Llenamos oficinas
    if (!sessionStorage.getItem('Oficinas')) {
      console.log("NO tenemos oficina");

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

            console.log("Tenemos oficina");
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
      //  console.log("Ya tenemos oficina");
      this.oOficinasRes = JSON.parse(sessionStorage.getItem('Oficinas'));
      this.oBuscar.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo;
      this.oBuscar.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo;
    }

    //Consulta lineas de producto
    if (!sessionStorage.getItem('Lineas')) {

      console.log("Lineas no existen");
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
            this.sMensaje = "No se encontraron oficinas";
            console.log("error");
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

    // Consulta Almacenes de PT
    if (!sessionStorage.getItem('Almacenes')) {

      // En este componente, solo se van a considerar
      // almacenes "operativos"
      this.oBuscarAlmac.AlmTipo = 'O';

      //console.log("oBuscarAlmac: ", this.oBuscarAlmac);

      this._servicioAlmacenes
        .Get(this.oBuscarAlmac)
        .subscribe(
          (Response: Almacenes) => {

            this.oAlmacRes = Response;

            if (this.oAlmacRes.Codigo != 0) {
              this.bError = true;
              this.sMensaje = "No se encontraron almacenes";
              console.log('🔸No se encontraron almacenes');
              return;
            }

            sessionStorage.setItem('Almacenes', JSON.stringify(this.oAlmacRes.Contenido));
            this.oAlmacContenido = this.oAlmacRes.Contenido;
            this.oBuscar.AlmacDesde = this.oAlmacRes.Contenido[0].AlmTipo +
              this.oAlmacRes.Contenido[0].AlmNum;
            this.oBuscar.AlmacHasta = this.oAlmacRes.Contenido[this.oAlmacRes.Contenido.length - 1].AlmTipo +
              this.oAlmacRes.Contenido[this.oAlmacRes.Contenido.length - 1].AlmNum;
            this.sMensaje = "";

          },
          (error: Almacenes) => {
            this.oAlmacRes = error;
            this.sMensaje = "No se encontraron Almacenes";
            console.log('🔸error oAlmacRes', this.oAlmacRes);
            return;
          }
        );
    } else {
      // console.log('Ya existen Almacenes');
      // dRendon 30.04.2025:
      // Este bloque de código es diferente al que se tiene para las
      // líneas de producto, oficinas y otros catálogos.
      // En este caso, se tendrá un array de objetos con las filas de
      // los almacenes obtenidos en la llamada previa.
      let arrayAlmacenes = JSON.parse(sessionStorage.getItem('Almacenes'));
      console.dir(arrayAlmacenes);
      console.table(arrayAlmacenes);
      this.oAlmacContenido = arrayAlmacenes;

      this.oBuscar.AlmacDesde = arrayAlmacenes[0].AlmTipo +
        arrayAlmacenes[0].AlmNum;
      this.oBuscar.AlmacHasta = arrayAlmacenes[arrayAlmacenes.length - 1].AlmTipo +
        arrayAlmacenes[arrayAlmacenes.length - 1].AlmNum;

      this.sMensaje = "";

    }

    //console.log(this.oBuscar.AlmacDesde, this.oBuscar.AlmacHasta);

    this.dtTrigger.next("");
  }


  ConsultaExistencias() {

    //alert('🔸 Módulo en Construcción...');

    //this.oBuscar.TipoUsuario = this.sTipo   <-- definidos anteriormente
    //this.oBuscar.Usuario = this.sCodigo
    this.bCargando = true;
    this.bBandera = false;

    // Llamada al servicio existencias.service.ts
    //console.log("🔸 oBuscar: ", this.oBuscar)
    this._servicioExistencias.Get(this.oBuscar)
      .subscribe(
        (Response: ConsultaExist) => {
          this.oExistencRes = Response;
          this.existRows = this.oExistencRes.Contenido;

          if (this.oExistencRes.Codigo != 0) {
            this.bError = true;
            this.sMensaje = 'No se encontraron registros';
            this.bBandera = false;
            this.bCargando = false;
            return;
          }

          this.sMensaje = '';
          this.bBandera = true;
          this.bCargando = false;
          this.isCollapsed = true;

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next("");
          });
        },
        (error: ConsultaExist) => {
          this.oExistencRes = error;
          this.sMensaje = 'No se encontraron registros';
          console.log('🔸error: no se encontraron registros');
          console.log('🔸oExistencRes: ' + this.oExistencRes);
          this.bCargando = false;
        }
      );
  }


  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next("");
  }

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

}
