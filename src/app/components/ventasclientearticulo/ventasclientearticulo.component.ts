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

//Servicios
import { ServicioVentasClienteArticulo } from 'src/app/services/ventasclientearticulo.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { Contenido } from '../../models/ventasclientearticulo';

@Component({
  selector: 'app-ventasclientearticulo',
  templateUrl: './ventasclientearticulo.component.html',
  styleUrls: ['./ventasclientearticulo.component.css'],
  providers:[ServicioVentasClienteArticulo,ServicioOficinas, DecimalPipe]
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
 

  public bError: boolean=false;
  public sMensaje: string="";
  public bCliente: boolean;
  public bFiltroOrden: boolean;
  bBandera: boolean;

  fechaHoy: String

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private _route: ActivatedRoute,
    private _router: Router,
    private _servicioVenClientes: ServicioVentasClienteArticulo,
    private _servicioOficinas:ServicioOficinas) { 

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

    }

    ngOnInit(): void {
  
      //Se agrega validacion control de sesion distribuidores
      if(!this.sCodigo) {
        console.log('ingresa VALIDACION');
        this._router.navigate(['/']);
      }

      switch(this.sTipo) { 
        case 'C':{    
          //Tipo cliente
          console.log('1');
          //Realizamos llamada al servicio de oficinas

          this._servicioOficinas 
          .Get(this.oBuscarOfi)
          .subscribe(
            (Response: Oficina) => {

              this.oOficinasRes = Response;
              console.log("RESULTADO LLAMADA Oficinas "+JSON.stringify(this.oOficinasRes) );
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


          let date: Date = new Date
          let mes;
          
          //Valida mes 
          if (date.getMonth().toString.length == 1){
            mes = '0'+(date.getMonth()+1);
          }

          let fechaDesde =  date.getFullYear() +'-01-01';          
          let fechaHasta =  date.getFullYear() +'-'+ mes +'-'+(date.getDate()-1); 
          this.fechaHoy =  (date.getDate() +'-'+mes+'-'+ date.getFullYear());           

           this.oBuscar.ClienteDesde = this.sCodigo; 
           this.oBuscar.ClienteHasta = this.sCodigo;   
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
           this.bCliente = true;    
           break; 
        } 
        case 'A': { 
           //statements; 
           break; 
        } 
        default: { 
           //statements; 
           break; 
        } 
      } 

      
    }


    //Funcion para consultar las ventas cliente articulo 
    consultaVentCArticulo(){
    console.log(this.oBuscar);
    this.oBuscar.TipoUsuario = this.sTipo

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
           //this.bBandera = false;
           return;
         }
 
         this.sMensaje="";
         this.bBandera = true;
         if (this.oBuscar.OrdenReporte == 'C'){
          this.bFiltroOrden = true;
         }else{
          this.bFiltroOrden = false;
         }

         
         //this.oContenido	= this.oVentasCliRes.Contenido
         //this.collectionSize = this.oVentasCliRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos
 
       },
       (error:VentasClienteArticulo) => {
 
         this.oVentasCliRes = error;
 
         console.log("error");
         console.log(this.oVentasCliRes);
         this.sMensaje="No se encontraron datos de venta por artículo";
       
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
  var html = htmlToPdfmake(pdfTable.innerHTML);
  console.log(html);
  const documentDefinition = { pageOrientation: 'landscape', header: [

    {
    alignment: 'justify',
    columns: [
    /*{
    image: 'sampleImage.jpg',
    width: 100,
    height: 100,
    },*/
    {
    width:330,
    text: 'Consulta de pedidos', alignment: 'center',style: 'header'
    
    },
    {
    width: 100,
    text: this.fechaHoy, alignment: 'right' ,margin: [2, 10]
    }
    ]
    }
    ],
    
    styles: {
    header: {
    fontSize: 22,
    bold: true,
    color: '#24a4cc'
    },
    numeracion: {
    fontSize: 12
    
    },
    },content: html,
  footer: function (currentPage, pageCount) {
    return [
      { text: currentPage.toString() + ' de ' + pageCount , alignment: 'right',  margin: [25, 20] }
    ]}
  };
  pdfMake.createPdf(documentDefinition).open();

  

}

  
  formatoMoneda(number){
    return new Intl.NumberFormat('en-US', {currency: 'USD', maximumFractionDigits: 2}).format(number);
  };

//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }


}
