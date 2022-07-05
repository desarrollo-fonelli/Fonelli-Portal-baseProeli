import { Component, OnInit,ChangeDetectorRef, ElementRef, ViewChild} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';


//Modelos
import {FiltrosVentaArticuloCliente} from 'src/app/models/ventasclientearticulo.filtros';
import {VentasClienteArticulo, Articulo, Subcategorias, LineasProducto} from 'src/app/models/ventasclientearticulo';
import {FiltrosOficina} from 'src/app/models/oficina.filtros';
import {Oficina} from 'src/app/models/oficina';
import {FiltrosClientes} from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido as ContenidoCli } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';
import { FiltrosLineas } from 'src/app/models/lineas.filtros';
import { Lineas, Contenido as LineasCon } from 'src/app/models/lineas';
import { FiltrosCategorias } from 'src/app/models/categorias.filtros';
import { Categorias, Contenido as CategoriasCon } from 'src/app/models/categorias';




//Servicios
import { ServicioVentasClienteArticulo } from 'src/app/services/ventasclientearticulo.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { Contenido } from '../../models/ventasclientearticulo';
import { ServicioClientes } from 'src/app/services/clientes.service';
import { ServicioLineas } from 'src/app/services/lineas.service';
import { ServicioCategorias } from 'src/app/services/categorias.service';




import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-ventasclientearticulo',
  templateUrl: './ventasclientearticulo.component.html',
  styleUrls: ['./ventasclientearticulo.component.css'],
  providers:[ServicioVentasClienteArticulo,
    ServicioOficinas,
    DecimalPipe,
    ServicioClientes,
    ServicioLineas,
    ServicioCategorias
  ]
})
export class VentasclientearticuloComponent implements OnInit {

  @ViewChild('pdfTable') pdfTable: ElementRef;

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  searchtext = '';

  public oBuscar: FiltrosVentaArticuloCliente;
  oVentasCliRes: VentasClienteArticulo; 
  public oBuscarOfi: FiltrosOficina;
  oOficinasRes: Oficina; 

  public oBuscarLineas: FiltrosLineas;
  oLineasRes: Lineas; 
  oLineasCon: LineasCon[];
  public oBuscarCategorias: FiltrosCategorias;
  oCategoriasRes: Categorias; 
  oCategoriasCon: CategoriasCon[];
  oSubCatDesde: CategoriasCon[];
  oSubCatHasta: CategoriasCon[];
 

  public bError: boolean=false;
  public sMensaje: string="";
  public bCliente: boolean;
  public bFiltroOrden: boolean;
  public bFiltrResumido: boolean;
  bBandera: boolean;

  fechaHoy: String
  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  closeResult = '';
  public ModalActivo?: NgbModalRef;

  mobileQuery: MediaQueryList;

  public Buscar: FiltrosClientes;
  public oCliente: Clientes; 
  public oContenido : ContenidoCli;
  public oCondiciones : Condiciones;
  public oDatosGenerales : DatosGenerales;
  public oContacto : Contactos;

  public bBanderaCliente: boolean;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private _route: ActivatedRoute,
    private _router: Router,
    private _servicioVenClientes: ServicioVentasClienteArticulo,
    private _servicioOficinas:ServicioOficinas,
    private modalService: NgbModal,
    private _servicioCClientes: ServicioClientes,
    private _servicioLineas:ServicioLineas,
    private _servicioCategorias:ServicioCategorias) { 

      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

      this.sCodigo = Number(sessionStorage.getItem('codigo'));
      this.sTipo = sessionStorage.getItem('tipo');
      this.sFilial  = Number(sessionStorage.getItem('filial'));
      this.sNombre = sessionStorage.getItem('nombre');
  
      //Inicializamos variables consulta pedidos
      this.oBuscar = new FiltrosVentaArticuloCliente('',0,'','','','',0,0,0,0,'','','','','','','','','','','','','','',0)
      this.oVentasCliRes={} as VentasClienteArticulo; 
      this.oBuscarOfi =  new FiltrosOficina('',0)
      this.oOficinasRes = {} as Oficina;


      this.bCliente = false;
      this.bBandera = false;
      this.bFiltroOrden = false;
      this.bFiltrResumido = false;

      this.Buscar = new FiltrosClientes(0, 0, 0,'', 0);
	    this.oCliente={} as Clientes;
	    this.oContenido ={} as ContenidoCli;
	    this.oCondiciones ={} as Condiciones;
	    this.oDatosGenerales ={} as DatosGenerales;
	    this.oContacto ={} as Contactos;

    }

    ngOnInit(): void {
  
      //Se agrega validacion control de sesion distribuidores
      if(!this.sCodigo) {
        console.log('ingresa VALIDACION');
        this._router.navigate(['/']);
      }

      let date: Date = new Date
      let mes;
      
      //Valida mes 
      if (date.getMonth().toString.length == 1){
        mes = '0'+(date.getMonth()+1);
      }

      let fechaDesde =  date.getFullYear() +'-01-01';          
      let fechaHasta = (date.getFullYear()) +'-'+ mes +'-'+(date.getDate().toString.length == 1 ? '0'+(date.getDate()-1) : date.getDate());          
      this.fechaHoy =  (date.getDate() +'-'+mes+'-'+ date.getFullYear());   

      switch(this.sTipo) { 
        case 'C':{    
          //Tipo cliente
          console.log('1');                           

           this.oBuscar.ClienteDesde = this.sCodigo; 
           this.oBuscar.ClienteHasta = this.sCodigo;   
           this.bCliente = true;    
           break; 
        } 
        case 'A': { 
           //Agente; 
           this.bCliente = false;    
           break; 
        } 
        default: { 
           //Gerente;
           this.bCliente = false;     
           break; 
        } 
      } 


      this.oBuscar.TipoArticulo = 'T';   
      this.oBuscar.TipoOrigen = 'T';   
      this.oBuscar.OrdenReporte = 'C';   
      this.oBuscar.Presentacion = 'R';   
      this.oBuscar.FechaDesde = fechaDesde;
      this.oBuscar.FechaHasta = fechaHasta;
      this.oBuscar.LineaHasta = 'ZZ';
      this.oBuscar.ClaveHasta = 'ZZZZZZZZZZZ';
      this.oBuscar.CategoriaDesde = 'A';
      this.oBuscar.CategoriaHasta = 'Z';
      this.oBuscar.SubcategoriaDesde = '0';
      this.oBuscar.SubcategoriaHasta = '9';
      this.oBuscar.ClienteHasta = 999999;
      this.oBuscar.FilialHasta = 999;
      

      this.Buscar.TipoUsuario = this.sTipo;
      this.Buscar.Usuario = this.sCodigo;

      //Realizamos llamada al servicio de oficinas
      this._servicioOficinas 
      .Get(this.oBuscarOfi)
      .subscribe(
        (Response: Oficina) => {

          this.oOficinasRes = Response;
          //console.log("RESULTADO LLAMADA Oficinas "+JSON.stringify(this.oOficinasRes) );
          //console.log(this.pedido);

          if(this.oOficinasRes.Codigo != 0){
            this.bError= true;
            this.sMensaje="No se encontraron oficinas";
            return;
          }

          this.oBuscar.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo; 
          this.oBuscar.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo; 
          this.sMensaje="";

        },
        (error:Oficina) => {

          this.oOficinasRes = error;
          this.sMensaje="No se encontraron oficinas";
          console.log("error");
          console.log(this.oOficinasRes);
          return;
        
        }
      );

       //Realizamos llamada al servicio de lineas
       this._servicioLineas 
       .Get(this.oBuscarLineas)
       .subscribe(
         (Response: Lineas) => {
 
           this.oLineasRes = Response;
           //console.log("RESULTADO LLAMADA Oficinas "+JSON.stringify(this.oOficinasRes) );
           //console.log(this.pedido);
 
           if(this.oLineasRes.Codigo != 0){
             this.bError= true;
             this.sMensaje="No se encontraron Lineas";
             return;
           }
 
           this.oLineasCon = this.oLineasRes.Contenido
           this.oBuscar.LineaDesde = this.oLineasRes.Contenido[0].LineaCodigo; 
           this.oBuscar.LineaHasta = this.oLineasRes.Contenido[this.oLineasRes.Contenido?.length - 1].LineaCodigo; 
           this.sMensaje="";
 
         },
         (error:Lineas) => {
 
           this.oLineasRes = error;
           this.sMensaje="No se encontraron oficinas";
           console.log("error");
           console.log(this.oLineasRes);
           return;
         
         }
       );

       
          //Realizamos llamada al servicio de categorias 
          this._servicioCategorias 
          .Get(this.oBuscarCategorias)
          .subscribe(
            (Response: Categorias) => {
    
              this.oCategoriasRes = Response;
              //console.log("RESULTADO LLAMADA Oficinas "+JSON.stringify(this.oOficinasRes) );
              //console.log(this.pedido);
    
              if(this.oCategoriasRes.Codigo != 0){
                this.bError= true;
                this.sMensaje="No se encontraron Categorias";
                return;
              }
    
              this.oCategoriasCon = this.oCategoriasRes.Contenido;
              this.oBuscar.CategoriaDesde = this.oCategoriasRes.Contenido[0].CategoriaCodigo; 
              this.oBuscar.CategoriaHasta = this.oCategoriasRes.Contenido[this.oCategoriasRes.Contenido?.length - 1].CategoriaCodigo; 
              this.sMensaje="";


    
            },
            (error:Categorias) => {
    
              this.oCategoriasRes = error;
              this.sMensaje="No se encontraron categorias";
              console.log("error");
              console.log(this.oCategoriasRes);
              return;
            
            }
          );




      
    }


    //Funcion para consultar las ventas cliente articulo 
    consultaVentCArticulo(){
      
    console.log(this.oBuscar);
    this.oBuscar.TipoUsuario = this.sTipo
    this.oBuscar.Usuario = this.sCodigo
    this.bCargando = true;

     //Realizamos llamada al servicio de relacion de pedidos
     this._servicioVenClientes
     .Get(this.oBuscar)
     .subscribe(
       (Response: VentasClienteArticulo) => {
 
         this.oVentasCliRes = Response;
         //this.pedido = this.oRelacionPedRes.Contenido.Pedidos
                
 
         //console.log( this.collectionSize);
         console.log("RESULTADO LLAMADA  "+JSON.stringify(this.oVentasCliRes) );
         //console.log(this.pedido);
 
         if(this.oVentasCliRes.Codigo != 0){
           this.bError= true;
           this.sMensaje="No se encontraron datos de venta por artículo";
           this.bBandera = false;
           this.bCargando = false;
           return;
         }
 
         this.sMensaje="";
         this.bBandera = true;
         if (this.oBuscar.OrdenReporte == 'C'){
          this.bFiltroOrden = true;//Es categoria
         }else{
          this.bFiltroOrden = false;//Es pieza o importe
         }

         if (this.oBuscar.Presentacion == 'R'){
          this.bFiltrResumido = true;//Es resumido
         }else{
          this.bFiltrResumido = false;//Es detallado
         }

         this.bCargando = false;

         
         //this.oContenido	= this.oVentasCliRes.Contenido
         //this.collectionSize = this.oVentasCliRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos
 
       },
       (error:VentasClienteArticulo) => {
 
         this.oVentasCliRes = error;
 
         console.log("error");
         console.log(this.oVentasCliRes);
         this.sMensaje="No se encontraron datos de venta por artículo";
         this.bCargando = false;
         this.bBandera = false;
       
       }
     );
  }

  // #### Obten totales por lineas ####

  getTotalPiezasArticulo(oArticulo: Articulo[]): number {   
    let Total: number = 0;
  
    for(var art of oArticulo){ 
        Total += art.Piezas;    
    }
    Total = Number(Total.toFixed(2));
    return Total; 
   }

   getTotalPiezasPorArticulo(oArticulo: Articulo[]): number {   
    let Total: number = 0;
  
    for(var art of oArticulo){ 
        Total += art.PiezasPorcentaje;    
    }
    Total = Number(Total.toFixed(2));
    return Total; 
   }

   getTotalGramosArticulo(oArticulo: Articulo[]): number {   
    let Total: number = 0;
  
    for(var art of oArticulo){ 
        Total += art.Gramos;    
    }
    Total = Number(Total.toFixed(2));
    return Total; 
   }

   getTotalGramosPorArticulo(oArticulo: Articulo[]): number {   
    let Total: number = 0;
  
    for(var art of oArticulo){ 
        Total += art.GramosPorcentaje;    
    }
    Total = Number(Total.toFixed(2));
    return Total; 
   }

   getTotalImpVenArticulo(oArticulo: Articulo[]): number {   
    let Total: number = 0;
  
    for(var art of oArticulo){ 
        Total += art.ImporteVenta;    
    }
    Total = Number(Total.toFixed(2));
    return Total; 
   }

   // #### Obten totales por lineas ####

  // #### Obten totales por SubCategoria ####
  getTotalPiezasPorxSubCat(oLineaPro: LineasProducto[]): number {   
    let Total: number = 0;  
  
      for(var linPro of oLineaPro){ 
        for(var art of linPro.Articulos){ 
          Total += art.PiezasPorcentaje;       
        }    
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalPiezasxSubCat(oLineaPro: LineasProducto[]): number {   
    let Total: number = 0;  
  
      for(var linPro of oLineaPro){ 
        for(var art of linPro.Articulos){ 
          Total += art.Piezas;       
        }    
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalGramosxSubCat(oLineaPro: LineasProducto[]): number {
    let Total: number = 0;
  
  
    for(var linPro of oLineaPro){ 
      for(var art of linPro.Articulos){ 
        Total += art.Gramos;       
      }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
}


  getTotalGramosPorxSubCat(oLineaPro: LineasProducto[]): number {  
    let Total: number = 0;
  
  
      for(var linPro of oLineaPro){ 
        for(var art of linPro.Articulos){ 
          Total += art.GramosPorcentaje;       
        }    
      }
    Total = Number(Total.toFixed(2));
    return Total; 
  } 
   
   getTotalImpVenxSubCat(oLineaPro: LineasProducto[]): number {   
    let Total: number = 0;
  
  
    for(var linPro of oLineaPro){ 
      for(var art of linPro.Articulos){ 
        Total += art.ImporteVenta;       
      }    
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  } 
    
   // #### Obten totales por SubCategoria ####

  // #### Obten totales por Categoria ####
  getTotalPiezasxCategoria(oSubCat: Subcategorias[]): number {   
    let Total: number = 0;
  
    for(var subCat of oSubCat){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.Piezas;  
        }        
      }
          
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalPiezasPorxCategoria(oSubCat: Subcategorias[]): number {   
    let Total: number = 0;
  
    for(var subCat of oSubCat){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.PiezasPorcentaje;  
        }        
      }
          
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }


  getTotalGramosxCategoria(oSubCat: Subcategorias[]): number {   
    let Total: number = 0;
  
    for(var subCat of oSubCat){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.Gramos;  
        }        
      }
          
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }


  getTotalGramosPorxCategoria(oSubCat: Subcategorias[]): number {   
    let Total: number = 0;
  
    for(var subCat of oSubCat){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.GramosPorcentaje;  
        }        
      }
          
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

   getTotalImpVenxCategoria(oSubCat: Subcategorias[]): number {   
    let Total: number = 0;
  
    for(var subCat of oSubCat){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.ImporteVenta;  
        }        
      }
          
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }    
  // #### Obten totales por Categoria ####

  // #### Obten totales por Cliente ####
  getTotalPiezasxCliente(oContenido: Contenido[]): number {   
  let Total: number = 0;
  
  for(var oConte of oContenido){ 
    for(var oCat of oConte.Categorias){     
    for(var subCat of oCat.Subcategorias){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.Piezas;  
        }        
      }
    } 
    }
  }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalPiezasPorxCliente(oContenido: Contenido[]): number {   
    let Total: number = 0;
    
    for(var oConte of oContenido){ 
      for(var oCat of oConte.Categorias){     
      for(var subCat of oCat.Subcategorias){ 
        for(var linPro of subCat.LineasProducto){ 
          for(var art of linPro.Articulos){ 
            Total += art.PiezasPorcentaje;  
          }        
        }
      } 
      }
    }
      Total = Number(Total.toFixed(2));
      return Total; 
    }

  getTotalGramosxCliente(oContenido: Contenido[]): number {   
  let Total: number = 0;

  for(var oConte of oContenido){ 
    for(var oCat of oConte.Categorias){     
    for(var subCat of oCat.Subcategorias){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.Gramos;  
        }        
      }
    } 
    }
  }
    Total = Number(Total.toFixed(2));
    return Total; 
  }


  getTotalGramosPorxCliente(oContenido: Contenido[]): number {   
  let Total: number = 0;

  for(var oConte of oContenido){ 
    for(var oCat of oConte.Categorias){     
    for(var subCat of oCat.Subcategorias){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.GramosPorcentaje;  
        }        
      }
    } 
    }
  }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalImpVenxCliente(oContenido: Contenido[]): number {   
  let Total: number = 0;

  for(var oConte of oContenido){ 
    for(var oCat of oConte.Categorias){     
    for(var subCat of oCat.Subcategorias){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.ImporteVenta;  
        }        
      }
    } 
    }
  }
  Total = Number(Total.toFixed(2));
    return Total; 
  }   

// #### Obten totales por Cliente ####

downloadAsPDF() {

  const pdfTable = this.pdfTable.nativeElement;
  console.log(pdfTable);

  var cadenaaux = pdfTable.innerHTML;

  let cadena =
      '<br><p>Cliente: <strong>' +this.sCodigo +'-'+this.sFilial+' '+this.sNombre+'</strong></p>' +      
      cadenaaux;

  var html = htmlToPdfmake(cadena);
  console.log(html);
  const documentDefinition = { 
    pageOrientation: 'landscape', 
    header: [
      {
        alignment: 'justify',
        heigth: 200,
        columns: [
          { 
            image: 'logo', 
            margin: [25,13],
            heigth: 40, 
            width: 110 
          },
          {
            width: 600,
            text: 'Ventas por artículo',
            alignment: 'center',
            style: 'header',
            margin: [8,8]   
          },
          {
            width: 100,
            text: this.fechaHoy,
            alignment: 'right',
            margin: [2, 15]
          },
        ],
      },
    ],

    styles: {
      header: {
        fontSize: 22,        
        bold: true,
        color: '#24a4cc',
      },
      numeracion: {
        fontSize: 12,
      },
    },
    content: html,
  footer: function (currentPage, pageCount) {
    return [
      { text: currentPage.toString() + ' de ' + pageCount , alignment: 'right',  margin: [25, 20] }
    ]},
    images: {
      logo: 'data:image/png;base64,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',
    }
  };
  pdfMake.createPdf(documentDefinition).open();

  

}

  
  formatoMoneda(number){
    return new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD', maximumFractionDigits: 2}).format(number);
  };


    //Modal clientes
    openClientes(Clientes: any, cliente: boolean) {
      console.log("Entra modal clientes");
      this.bCargandoClientes = true;
      this.bBanderaCliente = cliente;
      var result;
  
      try{
        result = this.BuscaClientes()
  
        if(result){
          this.ModalActivo = this.modalService.open(Clientes, {
            ariaLabelledBy: 'Clientes',
            size: 'xl',
            scrollable: true
            
          });
      
          this.ModalActivo.result.then(
            (result) => {},
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              console.log('reason ' + reason);
              this.Buscar = new FiltrosClientes(0, 0, 0,'', 0);
            }
          );
        }
  
        //this.bCargandoClientes = false;
  
  
        console.log("respuesta"+result);
  
      }catch(err){
        
      }
    }
  

  //Funcion para seleccionar cliente
  obtenCliente(sCodigo: string, sFilial: string) {

    if (this.bBanderaCliente) {//Si es true es cliente desde
      this.oBuscar.ClienteDesde = Number(sCodigo);
      this.oBuscar.FilialDesde = Number(sFilial);
    }else{
      this.oBuscar.ClienteHasta = Number(sCodigo);
      this.oBuscar.FilialHasta = Number(sFilial);
    }

      

      this.ModalActivo.dismiss('Cross click');    
    }
    BuscaClientes():boolean{

      this._servicioCClientes
      .GetCliente(this.Buscar)
      .subscribe(
        (Response: Clientes) =>  {
          
  
          this.oCliente = Response;
  
          console.log("Respuesta cliente"+JSON.stringify(this.oCliente));
          this.bCargandoClientes =false;
  
  
          if(this.oCliente.Codigo != 0){
            this.bError= true;
            this.sMensaje="No se encontraron datos del cliente";
     
            return false;
          }
     
          this.oContenido = this.oCliente.Contenido[0];
          this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
          this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
          this.oContacto =this.oCliente.Contenido[0].Contactos;
          return true;
  
       
        },
        (error:Clientes) => {
  
          this.oCliente = error;
  
          console.log("error");
          console.log(this.oCliente);
          this.bCargandoClientes =false;
          return false;
       
        }
        
      );
      return true;
    } 
  
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cargaSubCat(sCategoria, bCategoria: boolean){
    console.log(sCategoria); // Aquí iría tu lógica al momento de seleccionar algo  

    if (bCategoria){//Es categoria desde
      this.oSubCatDesde = this.oCategoriasCon.filter(x => x.CategoriaCodigo == sCategoria);
    }else{//Es categoria hasta
      this.oSubCatHasta = this.oCategoriasCon.filter(x => x.CategoriaCodigo == sCategoria);
    }      
    console.log("Resultado del segundo = "+JSON.stringify(bCategoria ? this.oSubCatDesde : this.oSubCatHasta));
  }
  
  
//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }


}
