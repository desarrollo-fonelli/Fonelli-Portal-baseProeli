/**
 * 11.09.2025 - dRendon:
 * Ajusto el componente y su plantilla para reemplazar el uso de datatables por 
 * scrolling virtual, considerando que la API puede devolver demasiados registros
 * y cada uno puede tener su propia imagen. Este cambio mejora el rendimiento
 * y la experiencia del usuario al navegar por la lista de artículos.
 */

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FiltrosItemsConsulta, ItemsResponse, ContenidoItem } from './modelos/articulos-imagenes.modelos';
import { ArticulosImagenesService } from './articulos-imagenes.service';

@Component({
  selector: 'app-articulos-imagenes',
  templateUrl: './articulos-imagenes.component.html',
  styleUrls: ['./articulos-imagenes.component.css'],
  providers: [ArticulosImagenesService]
})
export class ArticulosImagenesComponent implements OnInit, OnDestroy {

  searchtext = '';    // datatables
  bError: boolean = false;
  isCollapsed = false;
  bCargando = false;
  sMensaje = '';
  mostrarTabla: boolean;
  selectedImage: string;            // <-- imagen seleccionada en el modal

  sTipoUsuario: string | null;      // tipo de usuario
  sCodigo: string | null;           // usuario loggeado
  bCliente: boolean;
  sFilial: number | null;

  oBuscar: FiltrosItemsConsulta;
  oItemsResponse: ItemsResponse;
  oFilasItems: ContenidoItem[] = [];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  // Para gestionar la subscripción y evitar fugas de memoria
  private articulosSubscription: Subscription;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private modalService: NgbModal,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioArticulosConsulta: ArticulosImagenesService
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
    this.selectedImage = '';    // <-- inicializa variable nueva

  }

  /*********************************************************************/
  ngOnInit(): void {
    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

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

    // Cancela búsqueda anterior en caso que siga en curso
    if (this.articulosSubscription) {
      this.articulosSubscription.unsubscribe();
    }

    this.bCargando = true;

    this.articulosSubscription = this._servicioArticulosConsulta.Get(this.oBuscar)
      .subscribe({
        next: (response: ItemsResponse) => {
          this.bCargando = false;
          if (response.Codigo === 0 && response.Contenido.length > 0) {
            this.oItemsResponse = response;
            this.oFilasItems = this.oItemsResponse.Contenido;
            // console.log('🔴');
            // console.dir(this.oFilasItems);

            this.sMensaje = '';
            this.isCollapsed = true;
            this.mostrarTabla = true;
          } else {
            this.sMensaje = 'No se encontraron modelos semejantes';
            this.mostrarTabla = false;
          }
        },
        error: (error: any) => {
          this.bCargando = false;
          this.mostrarTabla = false;
          this.sMensaje = 'Error recuperando registros...';
          console.error('🔸 ...> error al buscar artículos', error);
        }
      });
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

  /******************************************************************* */
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    // Limpia la subscripción cuando el componente se destruye para evitar fugas de memoria
    if (this.articulosSubscription) {
      this.articulosSubscription.unsubscribe();
    }
    this.oFilasItems = [];
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
    console.log('🔸' + imgElement.src);
  }

}
