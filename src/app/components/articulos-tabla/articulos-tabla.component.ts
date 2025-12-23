import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subject, timer } from 'rxjs';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';

import { FiltrosItemsConsulta, ItemsResponse, ContenidoItem } from './modelos/articulos-tabla.interfaces';
import { ArticulosTablaService } from './servicios/articulos-tabla.service';

@Component({
  selector: 'app-articulos-tabla',
  templateUrl: './articulos-tabla.component.html',
  styleUrls: ['./articulos-tabla.component.css'],
  providers: [ArticulosTablaService]
})
export class ArticulosTablaComponent implements OnInit {

  searchtext = '';    // datatables
  bError: boolean = false;
  isCollapsed = false;
  bCargando = false;
  sMensaje = '';
  mostrarTabla: boolean;
  selectedImage: string;           // imagen seleccionada en el modal

  sTipoUsuario: string | null;     // tipo de usuario
  sCodigo: string | null;          // usuario loggeado
  bCliente: boolean;
  sFilial: number | null;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  oBuscar: FiltrosItemsConsulta;
  oItemsResponse: ItemsResponse;
  oFilasItems: ContenidoItem[];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private modalService: NgbModal,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioArticulosConsulta: ArticulosTablaService

  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sTipoUsuario = sessionStorage.getItem('tipo');
    this.sCodigo = sessionStorage.getItem('codigo');
    this.sFilial = Number(sessionStorage.getItem('filial'));
    this.bCliente = false;
    this.mostrarTabla = false;

    // Filtros de este formulario
    this.oBuscar = {
      TipoUsuario: '', Usuario: '', ItemCode: '', MetodoBusqueda: ''
    };

    this.oItemsResponse = {} as ItemsResponse;
    this.oFilasItems = [];
    this.selectedImage = '';    // inicializa variable nueva
  }

  // *********************************************************************
  ngOnInit(): void {

    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    this.dtOptions[0] = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      processing: true,
      destroy: true,
      fixedHeader: {
        header: true,
        footer: false
      },
      order: [],
      ordering: false,
      dom: 'ltip',
      language: {
        url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
        // Opcional: Acortar textos largos manualmente si el JSON trae textos muy largos
        paginate: {
          previous: "Ant",
          next: "Sig"
        }
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

    switch (this.sTipoUsuario) {
      case 'C': {
        //Cliente
        this.bCliente = true;
        this.oBuscar.Usuario = this.sCodigo + '-' + this.sFilial;
        // this.oBuscar.ClienteCodigo = this.sCodigo;   no se utilizan en este formulario
        // this.oBuscar.ClienteFilial = this.sFilial;
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

    this.oBuscar.TipoUsuario = this.sTipoUsuario;

    this.dtTrigger.next("");

  }

  /************************************************************************
  * Rutina para buscar artículos
  */
  BuscarArticulos() {
    this.sMensaje = '';
    this.mostrarTabla = false;
    this.isCollapsed = false;
    this.bCargando = false;
    this.oFilasItems = [];

    if (!this.oBuscar.ItemCode) {
      this.sMensaje += 'Debe indicar un código de artículo';
      return;
    }

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next("");
    });

    this.bCargando = true;

    this._servicioArticulosConsulta.Get(this.oBuscar).subscribe(
      (response: ItemsResponse) => {
        this.oItemsResponse = response;
        this.oFilasItems = this.oItemsResponse.Contenido;

        this.bCargando = false;

        if (this.oItemsResponse.Codigo != 0) {
          this.sMensaje = 'No se encontraron modelos semejantes';
          this.mostrarTabla = false;
        }

        this.sMensaje = '';
        this.isCollapsed = true;
        this.mostrarTabla = true;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next("");
        });

      },
      (error: ItemsResponse) => {
        this.oItemsResponse = error;
        this.bCargando = false;
        this.mostrarTabla = false;
        this.sMensaje = 'Error recuperando registros...';
        console.error('🔸 ...> error al buscar artículos', error);
      }
    );

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next("");
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  /******************************************************************
 * Método para abrir el modal con la imagen del artículo
 */
  openImageModal(content: any, imageUrl: string) {

    this.selectedImage = imageUrl;

    const imgElement = event.target as HTMLImageElement;
    const currentSrc = imgElement.src;
    this.selectedImage = currentSrc;

    //console.log('Imagen seleccionada:', this.selectedImage);
    this.modalService.open(content, { centered: true, size: 'lg' });

  }

  /******************************************************************* 
   * En caso de que no encuentre la imagen PNG busca otras extensiones
   */
  handleImageError(event: any, item: ContenidoItem) {

    let defaultImage = 'assets/img/diamante-azul.png';

    const imgElement = event.target as HTMLImageElement;
    const currentSrc = imgElement.src;

    // Evita un bucle infinito si la imagen por defecto también falla
    if (currentSrc.includes(defaultImage)) {
      imgElement.src = defaultImage;
      return;
    }

    // Regla de negoco para alternar extensión
    if (currentSrc.endsWith('.png') || currentSrc.endsWith('.PNG')) {
      // Si falló png, intentamos jpg
      // Nota: Asumimos que itm.ImgPath original venía con png o sin extensión
      // Aquí construimos la nueva ruta reemplazando la extensión
      imgElement.src = currentSrc.replace(/\.png$/i, '.jpg');
    } else if (currentSrc.endsWith('.jpg') || currentSrc.endsWith('.JPG')) {
      // Si falló png (o era la segunda opción), vamos a la imagen por defecto
      imgElement.src = defaultImage;
    } else {
      // Si no tenía extensión o es otro formato, vamos directo a default
      imgElement.src = defaultImage;
    }
    //console.log('🔸' + imgElement.src);
  }

}
