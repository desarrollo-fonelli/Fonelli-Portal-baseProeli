import { HttpResponse } from '@angular/common/http';
import { Icu } from '@angular/compiler/src/i18n/i18n_ast';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';

//Modelos
import {
  TemplateLlamada,
  TemplatePortal,
  Banner,
} from 'src/app/models/template';

//Servicios
import { ServicioTemplate } from 'src/app/services/template.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  providers: [ServicioTemplate],
})
export class TemplateComponent implements OnInit {
  imageUrl: any = '';
  editFile: boolean = true;
  removeUpload: boolean = false;
  public message: string = '';

  BannerPrincipal: Banner[];
  BannerDistribuidor: Banner[];
  BannerAsesor: Banner[];

  oTemplateLlamada: TemplateLlamada;
  oTemplate: TemplatePortal;
  oTemplateUpdate: TemplateLlamada;

  //Variables para imagenes cargadas
  public videoNuevo: any = '';
  public imagenBanner: any = '';
  public imagenBannerMovil: any = '';
  public imagenGif1: any = '';
  public imagenGif2: any = '';
  public imagenGif3: any = '';
  public imagenNosotros1: any = '';
  public imagenNosotros2: any = '';
  public imagenNosotros3: any = '';
  public imagenNosotros4: any = '';
  public imagenFinal: any = '';
  public imagenDistribuidor: any = '';
  public imagenDistribuidorMovil: any = '';
  public imagenAsesor: any = '';
  public imagenAsesorMovil: any = '';

  //Variables para archivos de imagenes
  public fileVideo: any;
  public fileGif1: any;
  public fileGif2: any;
  public fileGif3: any;

  public fileNosotros1: any;
  public fileNosotros2: any;
  public fileNosotros3: any;
  public fileNosotros4: any;

  public fileFinal: any;

  //Bandera nueva imagen

  public bVideo: boolean = false;

  public bImagenGif1: boolean = false;
  public bImagenGif2: boolean = false;
  public bImagenGif3: boolean = false;

  public bImagenNosotros1: boolean = false;
  public bImagenNosotros2: boolean = false;
  public bImagenNosotros3: boolean = false;
  public bImagenNosotros4: boolean = false;

  public bImagenFinal: boolean = false;

  //Banderas de spinners
  public bCargandoVideo: boolean = false;
  public bCargandoBanner: boolean = false;
  public bCargandoGif: boolean = false;
  public bCargandoNosotros: boolean = false;
  public bCargandoFinal: boolean = false;
  public bCargandoDistribuidores: boolean = false;
  public bCargandoAsesores: boolean = false;

  //Banderas para mensajes de errores
  public bErrorVideo: boolean = false;
  public bErrorBanner: boolean = false;
  public bErrorGif: boolean = false;
  public bErrorNosotros: boolean = false;
  public bErrorFinal: boolean = false;
  public bErrorDistribuidores: boolean = false;
  public bErrorAsesores: boolean = false;

  //Mensaje error
  public sMensajeError: string = '';

  constructor(
    private cd: ChangeDetectorRef,
    private _servicioTemplate: ServicioTemplate,
    private snackBar: MatSnackBar,
  ) {
    this.BannerPrincipal = [];
    this.BannerDistribuidor = [];
    this.BannerAsesor = [];
    this.oTemplateLlamada = {} as TemplateLlamada;
    this.oTemplate = {} as TemplatePortal;
    this.oTemplateUpdate = {} as TemplateLlamada;
  }

  ngOnInit(): void {
    this._servicioTemplate.Get().subscribe(
      (Response: TemplateLlamada) => {
        console.log(Response);

        this.oTemplateLlamada = Response;

        if (this.oTemplateLlamada.Codigo != 0) {
          console.log('Error 1');
          return;
        }

        this.oTemplate = this.oTemplateLlamada.Contenido;
        this.BannerPrincipal = this.oTemplate.BannerPrincipal;
        this.BannerDistribuidor = this.oTemplate.BannerDistribuidores;
        this.BannerAsesor = this.oTemplate.BannerAsesores;
      },
      (error: TemplateLlamada) => {
        console.log('Error 2');
      }
    );
  }

  //--------------Video

  onActualizarVideo() {
    this.bCargandoVideo = true;

    var myFormData = new FormData();

    var DatosNuevos = {
      Video: this.oTemplate.Video,
    };

    myFormData.append('image', this.fileVideo[0]);
    myFormData.append('DatosForm', JSON.stringify(DatosNuevos));



    this._servicioTemplate.Update(myFormData).subscribe(
      (Response: TemplateLlamada) => {
        this.bErrorVideo = false;
        this.sMensajeError = '';
        this.bCargandoVideo = false;

        this.snackBar.openFromComponent(mensaje_correcto, {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 4500,
          panelClass: ['fondo_mensaje_template']
        });
        


      },
      (error) => {
        console.error(error);

        this.bErrorVideo = true;
        this.sMensajeError = error.error[Object.keys(error.error)[1]]
          ? error.error[Object.keys(error.error)[1]]
          : error.message;
        console.log('Error2 al guardar los datos');

        this.bCargandoVideo = false;
      }
    );
  }

  SeleccionarVideo(event) {

    this.bErrorVideo = false;
    this.sMensajeError = "";

    this.fileVideo = event.target.files;
    if (this.fileVideo.length === 0) return;
    const mimeType = this.fileVideo[0].type;
    if (mimeType.match(/video\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }



    if((this.fileVideo[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.fileVideo[0]);
    reader.onload = (_event) => {
      console.log(this.bVideo);

      this.bVideo = true;
      this.videoNuevo = (<FileReader>_event.target).result;
      this.oTemplate.Video.Video = this.fileVideo[0].name;

      
    };
  }

  //---------------Banner Principal-------------
  onAddBannerPrincipal() {
    let Add: Banner;

    Add = {
      Titulo: '',
      Link: '',
      UrlImagen: '../../../assets/images/banner_principal/desk/',
      Imagen: '',
      UrlImagenMovil: '../../../assets/images/banner_principal/movil/',
      ImagenMovil: '',
      Orden: '',
      nuevaImagen: '',
      nuevaImagenMovil: '',
      bImagen: false,
      bImagenMovil: false,
      fileBanner: {},
      fileBannerMovil: {},
    };

    this.BannerPrincipal.push(Add);

    console.log(this.BannerPrincipal);
  }

  onRemovBannerPrincipal(rowIndex: number) {
    console.log(this.BannerPrincipal);

    this.BannerPrincipal.splice(rowIndex, 1);
  }

  onActualizarBanner() {
    this.bCargandoBanner = true;

    var myFormData = new FormData();

    var DatosNuevos = {
      BannerPrincipal: this.oTemplate.BannerPrincipal.map(elem => ({
        Titulo: elem.Titulo,
        Link: elem.Link,
        UrlImagen: elem.UrlImagen,
        Imagen: elem.Imagen,
        UrlImagenMovil: elem.UrlImagenMovil,
        ImagenMovil: elem.ImagenMovil,
        Orden: elem.Orden
      }))
    
    };

    myFormData.append('DatosForm', JSON.stringify(DatosNuevos));

    var iContador = 0;

    for (
      iContador = 0;
      iContador < this.oTemplate.BannerPrincipal.length;
      iContador = iContador + 1
    ) {
      if (this.oTemplate.BannerPrincipal[iContador].bImagen) {
        console.log('image' + (iContador + 1));
        console.log(this.oTemplate.BannerPrincipal[iContador].fileBanner[0]);
        myFormData.append(
          'imageDesk' + (iContador + 1),
          this.oTemplate.BannerPrincipal[iContador].fileBanner[0]
        );
      }

      if (this.oTemplate.BannerPrincipal[iContador].bImagenMovil) {
        console.log('imageDesk' + (iContador + 1));
        console.log(
          this.oTemplate.BannerPrincipal[iContador].fileBannerMovil[0]
        );
        myFormData.append(
          'imageMovil' + (iContador + 1),
          this.oTemplate.BannerPrincipal[iContador].fileBannerMovil[0]
        );
      }
    }

    console.log(this.oTemplate.BannerPrincipal);

    console.log(myFormData);

    this._servicioTemplate.Update(myFormData).subscribe(
      (Response: TemplateLlamada) => {
        this.bErrorBanner = false;
        this.sMensajeError = '';
        this.bCargandoBanner = false;
        console.log('Los datos se guadaron');

        this.snackBar.openFromComponent(mensaje_correcto, {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 4500,
          panelClass: ['fondo_mensaje_template']
        });
        
      },
      (error) => {
        this.bErrorBanner = true;
        this.sMensajeError = error.error[Object.keys(error.error)[1]]
          ? error.error[Object.keys(error.error)[1]]
          : error.message;
        this.bCargandoBanner = false;
      }
    );
  }

  SeleccionarImagenBanner(event: any, rowIndex: number) {
    
    this.bErrorBanner = false;
    this.sMensajeError = "";

    this.oTemplate.BannerPrincipal[rowIndex].fileBanner = event.target.files;

    if (this.oTemplate.BannerPrincipal[rowIndex].fileBanner.length === 0)
      return;

    const mimeType =
      this.oTemplate.BannerPrincipal[rowIndex].fileBanner[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(
      this.oTemplate.BannerPrincipal[rowIndex].fileBanner[0]
    );
    if((this.oTemplate.BannerPrincipal[rowIndex].fileBanner[0].size/ 1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    reader.onload = (_event) => {
      this.oTemplate.BannerPrincipal[rowIndex].bImagen = true;
      this.oTemplate.BannerPrincipal[rowIndex].nuevaImagen = reader.result;
      this.oTemplate.BannerPrincipal[rowIndex].Imagen =
        this.oTemplate.BannerPrincipal[rowIndex].fileBanner[0].name;
    };
  }

  SeleccionarImagenBannerMovil(event: any, rowIndex: number) {
    this.bErrorBanner = false;
    this.sMensajeError = "";


    this.oTemplate.BannerPrincipal[rowIndex].fileBannerMovil =
      event.target.files;
    if (this.oTemplate.BannerPrincipal[rowIndex].fileBannerMovil.length === 0)
      return;

    const mimeType =
      this.oTemplate.BannerPrincipal[rowIndex].fileBannerMovil[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    if((this.oTemplate.BannerPrincipal[rowIndex].fileBannerMovil[0].size/ 1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(
      this.oTemplate.BannerPrincipal[rowIndex].fileBannerMovil[0]
    );
    reader.onload = (_event) => {
      this.oTemplate.BannerPrincipal[rowIndex].bImagenMovil = true;
      this.oTemplate.BannerPrincipal[rowIndex].nuevaImagenMovil = reader.result;
      this.oTemplate.BannerPrincipal[rowIndex].ImagenMovil =
        this.oTemplate.BannerPrincipal[rowIndex].fileBannerMovil[0].name;
    };
  }

  //--------------Gif------------------------------

  onActualizarGif() {
    this.bCargandoGif = true;

    var myFormData = new FormData();

    var DatosNuevos = {
      Gif: this.oTemplate.Gif,
    };

    myFormData.append('DatosForm', JSON.stringify(DatosNuevos));

    if (this.bImagenGif1) {
      myFormData.append('image1', this.fileGif1[0]);
    }

    if (this.bImagenGif2) {
      myFormData.append('image2', this.fileGif2[0]);
    }

    if (this.bImagenGif3) {
      myFormData.append('image3', this.fileGif3[0]);
    }

    this._servicioTemplate.Update(myFormData).subscribe(
      (Response: TemplateLlamada) => {
        if (Response.Codigo != 0) {
          this.bErrorGif = true;
          this.sMensajeError = Response.Mensaje;
          console.log('Error1 al guardar los datos');
          return;
        }

        this.bErrorGif = false;
        this.sMensajeError = '';
        console.log('Los datos se guadaron');

        this.snackBar.openFromComponent(mensaje_correcto, {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 4500,
          panelClass: ['fondo_mensaje_template']
        });
        
      },
      (error) => {
        this.bErrorGif = true;
        this.sMensajeError = error.error[Object.keys(error.error)[1]]
        ? error.error[Object.keys(error.error)[1]]
        : error.message;

      }
    );

    this.bCargandoGif = false;
  }

  SeleccionarImagenGif1(event) {

    this.bErrorGif = false;
    this.sMensajeError = "";

    this.fileGif1 = event.target.files;

    if (this.fileGif1.length === 0) return;

    const mimeType = this.fileGif1[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }


    if((this.fileGif1[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.fileGif1[0]);
    reader.onload = (_event) => {
      this.bImagenGif1 = true;
      this.imagenGif1 = reader.result;
      this.oTemplate.Gif.Imagen1 = this.fileGif1[0].name;
    };
  }

  SeleccionarImagenGif2(event) {

    this.bErrorGif = false;
    this.sMensajeError = "";


    this.fileGif2 = event.target.files;
    if (this.fileGif2.length === 0) return;

    const mimeType = this.fileGif2[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    
    if((this.fileGif2[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.fileGif2[0]);
    reader.onload = (_event) => {
      this.bImagenGif2 = true;
      this.imagenGif2 = reader.result;
      this.oTemplate.Gif.Imagen2 = this.fileGif2[0].name;
    };
  }

  SeleccionarImagenGif3(event) {

    this.bErrorGif = false;
    this.sMensajeError = "";


    this.fileGif3 = event.target.files;
    if (this.fileGif3 === 0) return;

    const mimeType = this.fileGif3[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    
    if((this.fileGif3[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.fileGif3[0]);
    reader.onload = (_event) => {
      this.bImagenGif3 = true;
      this.imagenGif3 = reader.result;
      this.oTemplate.Gif.Imagen3 = this.fileGif3[0].name;
    };
  }

  //----------------------Nosotros-----------------
  onActualizarNosotros() {
    this.bCargandoNosotros = true;

    var myFormData = new FormData();

    var DatosNuevos = {
      Nosotros: this.oTemplate.Nosotros,
    };

    myFormData.append('DatosForm', JSON.stringify(DatosNuevos));

    if (this.bImagenNosotros1) {
      myFormData.append('image1', this.fileNosotros1[0]);
    }

    if (this.bImagenNosotros2) {
      myFormData.append('image2', this.fileNosotros2[0]);
    }

    if (this.bImagenNosotros3) {
      myFormData.append('image3', this.fileNosotros3[0]);
    }

    if (this.bImagenNosotros4) {
      myFormData.append('image4', this.fileNosotros4[0]);
    }

    this._servicioTemplate.Update(myFormData).subscribe(
      (Response: TemplateLlamada) => {
        this.bErrorNosotros = false;
        this.sMensajeError = '';
        this.bCargandoNosotros = false;
        console.log('Los datos se guadaron');

        this.snackBar.openFromComponent(mensaje_correcto, {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 4500,
          panelClass: ['fondo_mensaje_template']
        });
        
      },
      (error) => {
        this.bErrorNosotros = true;
        this.sMensajeError = error.error[Object.keys(error.error)[1]]
          ? error.error[Object.keys(error.error)[1]]
          : error.message;
        console.log('Error2 al guardar los datos');
        this.bCargandoNosotros = false;
      }
    );
  }

  SeleccionarImagenNosotros1(event) {

    this.bErrorNosotros = false;
    this.sMensajeError = "";
	
    this.fileNosotros1 = event.target.files;
    if (this.fileNosotros1.length === 0) return;

    const mimeType = this.fileNosotros1[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    if((this.fileNosotros1[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.fileNosotros1[0]);
    reader.onload = (_event) => {
      this.bImagenNosotros1 = true;
      this.imagenNosotros1 = reader.result;
      this.oTemplate.Nosotros.Imagen1 = this.fileNosotros1[0].name;
    };
  }

  SeleccionarImagenNosotros2(event) {

    this.bErrorNosotros = false;
    this.sMensajeError = "";

    this.fileNosotros2 = event.target.files;
    if (this.fileNosotros2.length === 0) return;

    const mimeType = this.fileNosotros2[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    if((this.fileNosotros2[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.fileNosotros2[0]);
    reader.onload = (_event) => {
      this.bImagenNosotros2 = true;
      this.imagenNosotros2 = reader.result;
      this.oTemplate.Nosotros.Imagen2 = this.fileNosotros2[0].name;
    };
  }

  SeleccionarImagenNosotros3(event) {
    this.bErrorNosotros = false;
    this.sMensajeError = "";

    this.fileNosotros3 = event.target.files;
    if (this.fileNosotros3.length === 0) return;

    const mimeType = this.fileNosotros3[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    if((this.fileNosotros3[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.fileNosotros3[0]);
    reader.onload = (_event) => {
      this.bImagenNosotros3 = true;
      this.imagenNosotros3 = reader.result;
      this.oTemplate.Nosotros.Imagen3 = this.fileNosotros3[0].name;
    };
  }

  SeleccionarImagenNosotros4(event) {
    this.bErrorNosotros = false;
    this.sMensajeError = "";

    this.fileNosotros4 = event.target.files;
    if (this.fileNosotros4.length === 0) return;

    const mimeType = this.fileNosotros4[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    if((this.fileNosotros4[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.fileNosotros4[0]);
    reader.onload = (_event) => {
      this.bImagenNosotros4 = true;
      this.imagenNosotros4 = reader.result;
      this.oTemplate.Nosotros.Imagen4 = this.fileNosotros4[0].name;
    };
  }

  //------------------Imagen final-----------------

  onActualizarFinal() {
    this.bCargandoFinal = true;

    var myFormData = new FormData();

    var DatosNuevos = {
      ImagenFinal: this.oTemplate.ImagenFinal,
    };

    myFormData.append('DatosForm', JSON.stringify(DatosNuevos));

    myFormData.append('image', this.fileFinal[0]);

    this._servicioTemplate.Update(myFormData).subscribe(
      (Response: TemplateLlamada) => {
        this.bErrorFinal = false;
        this.sMensajeError = '';
        this.bCargandoFinal = false;
        console.log('Los datos se guadaron');
        this.snackBar.openFromComponent(mensaje_correcto, {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 4500,
          panelClass: ['fondo_mensaje_template']
        });
        
      },
      (error) => {
        this.bErrorFinal = true;
        this.sMensajeError = error.error[Object.keys(error.error)[1]]
          ? error.error[Object.keys(error.error)[1]]
          : error.message;

        this.bCargandoFinal = false;
      }
    );
  }

  SeleccionarImagenFinal(event) {

    this.bErrorFinal = false;
    this.sMensajeError = "";

    this.fileFinal = event.target.files;
    if (this.fileFinal.length === 0) return;

    const mimeType = this.fileFinal[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    if((this.fileFinal[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.fileFinal[0]);
    reader.onload = (_event) => {
      this.bImagenFinal = true;
      this.imagenFinal = reader.result;
      this.oTemplate.ImagenFinal.Imagen = this.fileFinal[0].name;
    };
  }

  //---------------Banner Distribuidor-------------
  onAddBannerDistribuidor() {
    let Add: Banner;

    Add = {
      Titulo: '',
      Link: '',
      UrlImagen: '../../../assets/images/banner_distribuidor/desk/',
      Imagen: '',
      UrlImagenMovil: '../../../assets/images/banner_distribuidor/movil/',
      ImagenMovil: '',
      Orden: '',
      nuevaImagen: '',
      nuevaImagenMovil: '',
      bImagen: false,
      bImagenMovil: false,
    };

    this.BannerDistribuidor.push(Add);

    console.log(this.BannerDistribuidor);
  }

  onRemovBannerDistribuidor(rowIndex: number) {
    console.log(this.BannerDistribuidor);

    this.BannerDistribuidor.splice(rowIndex, 1);
  }

  onActualizarDistribuidores() {
    this.bCargandoDistribuidores = true;

    var myFormData = new FormData();

 
    var DatosNuevos = {
      BannerDistribuidores: this.oTemplate.BannerDistribuidores.map(elem => ({
        Titulo: elem.Titulo,
        Link: elem.Link,
        UrlImagen: elem.UrlImagen,
        Imagen: elem.Imagen,
        UrlImagenMovil: elem.UrlImagenMovil,
        ImagenMovil: elem.ImagenMovil,
        Orden: elem.Orden
      }))
    
    };


    myFormData.append('DatosForm', JSON.stringify(DatosNuevos));

    var iContador = 0;

    for (
      iContador = 0;
      iContador < this.oTemplate.BannerDistribuidores.length;
      iContador = iContador + 1
    ) {
      if (this.oTemplate.BannerDistribuidores[iContador].bImagen) {
        myFormData.append(
          'imageDesk' + (iContador + 1),
          this.oTemplate.BannerDistribuidores[iContador].fileBanner[0]
        );
      }

      if (this.oTemplate.BannerDistribuidores[iContador].bImagenMovil) {
        console.log('imageDesk' + (iContador + 1));
        console.log(
          this.oTemplate.BannerDistribuidores[iContador].fileBannerMovil[0]
        );
        myFormData.append(
          'imageMovil' + (iContador + 1),
          this.oTemplate.BannerDistribuidores[iContador].fileBannerMovil[0]
        );
      }
    }

    this._servicioTemplate.Update(myFormData).subscribe(
      (Response: TemplateLlamada) => {
        this.bErrorDistribuidores = false;
        this.sMensajeError = '';
        console.log('Los datos se guadaron');
        this.bCargandoDistribuidores = false;

        this.snackBar.openFromComponent(mensaje_correcto, {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 4500,
          panelClass: ['fondo_mensaje_template']
        });
        
      },
      (error) => {
        this.bErrorDistribuidores = true;
        this.sMensajeError = error.error[Object.keys(error.error)[1]]
          ? error.error[Object.keys(error.error)[1]]
          : error.message;
        console.log('Error2 al guardar los datos');
        this.bCargandoDistribuidores = false;
      }
    );
  }

  SeleccionarImagenDistribuidores(event: any, rowIndex: number) {
    this.bErrorDistribuidores = false;
    this.sMensajeError = "";

    this.oTemplate.BannerDistribuidores[rowIndex].fileBanner =
      event.target.files;
    if (this.oTemplate.BannerDistribuidores[rowIndex].fileBanner.length === 0)
      return;

    const mimeType =
      this.oTemplate.BannerDistribuidores[rowIndex].fileBanner[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    if((this.oTemplate.BannerDistribuidores[rowIndex].fileBanner[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(
      this.oTemplate.BannerDistribuidores[rowIndex].fileBanner[0]
    );
    reader.onload = (_event) => {
      this.oTemplate.BannerDistribuidores[rowIndex].bImagen = true;
      this.oTemplate.BannerDistribuidores[rowIndex].nuevaImagen = reader.result;
      this.oTemplate.BannerDistribuidores[rowIndex].Imagen =
        this.oTemplate.BannerDistribuidores[rowIndex].fileBanner[0].name;
    };
  }

  SeleccionarImagenDistribuidoresMovil(event: any, rowIndex: number) {
    this.oTemplate.BannerDistribuidores[rowIndex].fileBannerMovil =
      event.target.files;
    if (
      this.oTemplate.BannerDistribuidores[rowIndex].fileBannerMovil.length === 0
    )
      return;

    const mimeType =
      this.oTemplate.BannerDistribuidores[rowIndex].fileBannerMovil[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.mensaje_error_formato();
      return;
    }

    if((this.oTemplate.BannerDistribuidores[rowIndex].fileBannerMovil[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(
      this.oTemplate.BannerDistribuidores[rowIndex].fileBannerMovil[0]
    );
    reader.onload = (_event) => {
      this.oTemplate.BannerDistribuidores[rowIndex].bImagenMovil = true;
      this.oTemplate.BannerDistribuidores[rowIndex].nuevaImagenMovil =
        reader.result;
      this.oTemplate.BannerDistribuidores[rowIndex].ImagenMovil =
        this.oTemplate.BannerDistribuidores[rowIndex].fileBannerMovil[0].name;
    };
  }

  //---------------Banner Asesores-------------
  onAddBannerAsesor() {
    let Add: Banner;

    Add = {
      Titulo: '',
      Link: '',
      UrlImagen: '../../../assets/images/banner_asesor/desk/',
      Imagen: '',
      UrlImagenMovil: '../../../assets/images/banner_asesor/movil/',
      ImagenMovil: '',
      Orden: '',
      nuevaImagen: '',
      nuevaImagenMovil: '',
      bImagen: false,
      bImagenMovil: false,
    };

    this.BannerAsesor.push(Add);

    console.log(this.BannerAsesor);
  }

  onRemovBannerAsesor(rowIndex: number) {
    console.log(this.BannerAsesor);

    this.BannerAsesor.splice(rowIndex, 1);
  }

  onActualizarAsesores() {
    this.bCargandoAsesores = true;

    var myFormData = new FormData();


    var DatosNuevos = {
      BannerAsesores: this.oTemplate.BannerAsesores.map(elem => ({
        Titulo: elem.Titulo,
        Link: elem.Link,
        UrlImagen: elem.UrlImagen,
        Imagen: elem.Imagen,
        UrlImagenMovil: elem.UrlImagenMovil,
        ImagenMovil: elem.ImagenMovil,
        Orden: elem.Orden
      }))
    
    };

    myFormData.append('DatosForm', JSON.stringify(DatosNuevos));

    var iContador = 0;

    for (
      iContador = 0;
      iContador < this.oTemplate.BannerAsesores.length;
      iContador = iContador + 1
    ) {
      if (this.oTemplate.BannerAsesores[iContador].bImagen) {
        myFormData.append(
          'imageDesk' + (iContador + 1),
          this.oTemplate.BannerAsesores[iContador].fileBanner[0]
        );
      }

      if (this.oTemplate.BannerAsesores[iContador].bImagenMovil) {
        console.log('imageDesk' + (iContador + 1));
        console.log(
          this.oTemplate.BannerAsesores[iContador].fileBannerMovil[0]
        );
        myFormData.append(
          'imageMovil' + (iContador + 1),
          this.oTemplate.BannerAsesores[iContador].fileBannerMovil[0]
        );
      }
    }

    this._servicioTemplate.Update(myFormData).subscribe(
      (Response: TemplateLlamada) => {
        this.bErrorAsesores = false;
        this.sMensajeError = '';
        console.log('Los datos se guadaron');
        this.bCargandoAsesores = false;

        this.snackBar.openFromComponent(mensaje_correcto, {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 4500,
          panelClass: ['fondo_mensaje_template']
        });
        
      },
      (error) => {
        this.bErrorAsesores = true;
        this.sMensajeError = error.error[Object.keys(error.error)[1]]
          ? error.error[Object.keys(error.error)[1]]
          : error.message;
        console.log('Error2 al guardar los datos');
        this.bCargandoAsesores = false;
      }
    );
  }

  SeleccionarImagenAsesor(event: any, rowIndex: number) {
    this.bErrorAsesores = false;
    this.sMensajeError = "";


    this.oTemplate.BannerAsesores[rowIndex].fileBanner = event.target.files;
    if (this.oTemplate.BannerAsesores[rowIndex].fileBanner === 0) return;

    const mimeType = this.oTemplate.BannerAsesores[rowIndex].fileBanner[0].type;
    if (mimeType.match(/image\/*/) == null) {
    
      this.mensaje_error_formato();
      return;
    }

    if((this.oTemplate.BannerAsesores[rowIndex].fileBanner[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(this.oTemplate.BannerAsesores[rowIndex].fileBanner[0]);
    reader.onload = (_event) => {
      this.oTemplate.BannerAsesores[rowIndex].bImagen = true;
      this.oTemplate.BannerAsesores[rowIndex].nuevaImagen = reader.result;
      this.oTemplate.BannerAsesores[rowIndex].Imagen =
        this.oTemplate.BannerAsesores[rowIndex].fileBanner[0].name;
    };
  }

  SeleccionarImagenAsesorMovil(event: any, rowIndex: number) {

    this.bErrorAsesores = false;
    this.sMensajeError = "";

    this.oTemplate.BannerAsesores[rowIndex].fileBannerMovil =
      event.target.files;
    if (this.oTemplate.BannerAsesores[rowIndex].fileBannerMovil.length === 0)
      return;

    const mimeType =
      this.oTemplate.BannerAsesores[rowIndex].fileBannerMovil[0].type;
    if (mimeType.match(/image\/*/) == null) {
  
      this.mensaje_error_formato();
      return;
    }

    if((this.oTemplate.BannerAsesores[rowIndex].fileBannerMovil[0].size/1024/1024)> 50)
    {
      this.mensaje_error_size();
      return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(
      this.oTemplate.BannerAsesores[rowIndex].fileBannerMovil[0]
    );
    reader.onload = (_event) => {
      this.oTemplate.BannerAsesores[rowIndex].bImagenMovil = true;
      this.oTemplate.BannerAsesores[rowIndex].nuevaImagenMovil = reader.result;
      this.oTemplate.BannerAsesores[rowIndex].ImagenMovil =
        this.oTemplate.BannerAsesores[rowIndex].fileBannerMovil[0].name;
    };
  }

mensaje_error_formato()
{
  this.snackBar.openFromComponent(mensaje_extension , {
    horizontalPosition: "center",
    verticalPosition: "top",
    duration: 4500,
    panelClass: ['fondo_mensaje_sesion']
  });
}

mensaje_error_size(){
  this.snackBar.openFromComponent(mensaje_size, {
    horizontalPosition: "center",
    verticalPosition: "top",
    duration: 4500,
    panelClass: ['fondo_mensaje_sesion']
  });
}


}

@Component({
  selector: 'mensaje-correcto-component',
  template: `<span class="mensaje-correcto-style">
  La actualización se realizó correctamente.
</span>
`,
  styles: [
    `
    .mensaje-correcto-style {
      color: white;
    }
  `,
  ],
})
export class mensaje_correcto {}


@Component({
  selector: 'mensaje-extension-component',
  template: `<span class="mensaje-extension-style">
  El tipo de archivo no esta soportado.
</span>
`,
  styles: [
    `
    .mensaje-extension-style {
      color: white;
    }
  `,
  ],
})
export class mensaje_extension {}


@Component({
  selector: 'mensaje-size-component',
  template: `<span class="mensaje-size-style">
  El tamaño del archivo no puede ser mayor a 50 mb.
</span>
`,
  styles: [
    `
    .mensaje-size-style {
      color: white;
    }
  `,
  ],
})
export class mensaje_size {}