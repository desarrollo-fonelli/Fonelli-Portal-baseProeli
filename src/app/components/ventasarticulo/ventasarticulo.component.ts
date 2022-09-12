import { Component, OnInit,OnDestroy,ChangeDetectorRef, ElementRef,ViewChildren, ViewChild, QueryList} from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


//Modelos
import { FiltrosVentasArticulo} from 'src/app/models/ventasarticulo.filtros';
import { VentasArticulo, Articulo, LineasProducto,Subcategorias, Contenido} from 'src/app/models/ventasarticulo';
import { VentasArticuloPzasImp, Detalle, Subcategorias as SubcategoriasPI, Contenido as ContenidoCatPI } from 'src/app/models/ventasarticuloPzasImp';
import { FiltrosOficina} from 'src/app/models/oficina.filtros';
import { Oficina} from 'src/app/models/oficina';
import { FiltrosLineas } from 'src/app/models/lineas.filtros';
import { Lineas, Contenido as LineasCon } from 'src/app/models/lineas';
import { FiltrosCategorias } from 'src/app/models/categorias.filtros';
import { Categorias, Contenido as CategoriasCon } from 'src/app/models/categorias';


//Servicios
import { ServicioVentasArticulo } from 'src/app/services/ventasarticulo.service';
import { ServicioVentasArticuloPzasImp } from 'src/app/services/ventasArticuloPzasImp.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { ServicioLineas } from 'src/app/services/lineas.service';
import { ServicioCategorias } from 'src/app/services/categorias.service';
import { Contenido as AgentesCon } from 'src/app/models/agentes';


import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-ventasarticulo',
  templateUrl: './ventasarticulo.component.html',
  styleUrls: ['./ventasarticulo.component.css'],
  providers:[ServicioOficinas,
    DecimalPipe,  
    ServicioLineas,
    ServicioCategorias,
    ServicioVentasArticulo,
    ServicioVentasArticuloPzasImp
  ]
})
export class VentasarticuloComponent implements OnInit, OnDestroy {

  @ViewChild('pdfTable') pdfTable: ElementRef;

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  searchtext = '';

  @ViewChildren(DataTableDirective) 
  datatableElementList: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();


  public oBuscar: FiltrosVentasArticulo;
  oVentasArticuloRes: VentasArticulo; 
  oVentasArticuloPzasImpRes: VentasArticuloPzasImp; 
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

  bBanderaPzIm: boolean;
  bBanderaCat: boolean;
  public isCollapsed = false;

  fechaHoy: String
  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  closeResult = '';
  public ModalActivo?: NgbModalRef;

  mobileQuery: MediaQueryList;


  public bBanderaCliente: boolean;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private _route: ActivatedRoute,
    private _router: Router,    
    private _servicioOficinas:ServicioOficinas,
    private modalService: NgbModal,    
    private _servicioLineas:ServicioLineas,
    private _servicioCategorias:ServicioCategorias,
    private _servicioVentasArticulo: ServicioVentasArticulo,
    private _servicioVentasArticuloPzasImp: ServicioVentasArticuloPzasImp) { 

      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

      this.sCodigo = Number(localStorage.getItem('codigo'));
      this.sTipo = localStorage.getItem('tipo');
      this.sFilial  = Number(localStorage.getItem('filial'));
      this.sNombre = localStorage.getItem('nombre');
  
      //Inicializamos variables consulta pedidos
      this.oBuscar = new FiltrosVentasArticulo('',0,'','','','','','','','','','','','','','','','',0)
      this.oVentasArticuloRes={} as VentasArticulo; 
      this.oBuscarOfi =  new FiltrosOficina('',0)
      this.oOficinasRes = {} as Oficina;

      this.oVentasArticuloPzasImpRes = {} as VentasArticuloPzasImp;

      this.bCliente = false;
      this.bBandera = false;
      this.bFiltroOrden = false;
      this.bFiltrResumido = false;

    }

    ngOnInit(): void {

   
  
      this.dtOptions[0] = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        destroy:true,
        fixedHeader: { 
          header: true, 
          footer: false 
          },
        order:[],
        ordering:false,
        dom: 'flBtip',
        language: {
          url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },  
        buttons: [
          {
            extend: 'excelHtml5',
            title: 'Ventas por Articulo',
            text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
            className: "btnExcel btn"            
          }
        ]
     
        
      };
      this.dtOptions[1] = {
        pagingType: 'full_numbers',
        destroy:true,
        pageLength: 10,
        processing: true,
        fixedHeader: { 
          header: true, 
          footer: false 
          },
        order:[],
        ordering:false,
        dom: 'flBtip"',
        language: {
          url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },  
        buttons: [
          {
            extend: 'excelHtml5',
            title: 'Ventas por Articulo',
            text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
            className: "btnExcel btn"            
          }
        ]
     
        
      };

  
      //Se agrega validacion control de sesion distribuidores
      if(!this.sCodigo) {
        console.log('ingresa VALIDACION');
        this._router.navigate(['/']);
      }

      let date: Date = new Date
      let mes;
      
      //Valida mes 
      if (date.getMonth().toString().length == 1){
        mes = '0'+(date.getMonth()+1);
      }

      let fechaDesde =  date.getFullYear() +'-01-01';          
      let fechaActual = (date.getFullYear()+1) +'-'+ mes +'-'+(date.getDate().toString().length == 1 ? '0'+(date.getDate()) : date.getDate());          
      let fechaAyer: string;
      //validacion dia anterior inicio de mes
      if(date.getDate() == 1){//es inicio de mes
        if(mes == '01'){
          mes = '12';
          fechaAyer = (date.getFullYear()-1) +'-'+ mes +'-'+'30';          
        }else{
          mes = mes-1;
          fechaAyer = (date.getFullYear()) +'-0'+ mes +'-'+'30';          
        }        
      }else{
        fechaAyer = (date.getFullYear()) +'-'+ mes +'-'+(date.getDate().toString().length == 1 ? '0'+(date.getDate()-1) : (date.getDate()-1).toString().length == 1 ? '0'+(date.getDate()-1) : date.getDate()-1 );                  
      }
      this.fechaHoy =  (date.getDate() +'-'+mes+'-'+ date.getFullYear());   

      switch(this.sTipo) { 
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


      /*this.oBuscar.TipoArticulo = 'T';   
      this.oBuscar.TipoOrigen = 'T';   
      this.oBuscar.OrdenReporte = 'C';   
      this.oBuscar.Presentacion = 'R';   
      this.oBuscar.FechaDesde = fechaDesde;
      this.oBuscar.FechaHasta = fechaAyer;
      this.oBuscar.LineaHasta = 'ZZ';
      this.oBuscar.ClaveHasta = 'ZZZZZZZZZZZ';
      this.oBuscar.CategoriaDesde = 'A';
      this.oBuscar.CategoriaHasta = 'Z';
      this.oBuscar.SubcategoriaDesde = '0';
      this.oBuscar.SubcategoriaHasta = '9';
      this.oBuscar.ClienteHasta = 999999;
      this.oBuscar.FilialHasta = 999;*/
      
      this.oBuscar.TipoArticulo = 'T';
      this.oBuscar.TipoOrigen = 'T';
      this.oBuscar.OrdenReporte = 'C';
      this.oBuscar.Presentacion = 'R';
      this.oBuscar.FechaDesde = fechaDesde;
      this.oBuscar.FechaHasta = fechaAyer;
      this.oBuscar.LineaHasta = 'ZZ';
      this.oBuscar.ClaveHasta = 'Z';
      
      this.oBuscar.Usuario = this.sCodigo;

      //Llenamos oficinas
     if (!localStorage.getItem('Oficinas')){
     // console.log("NO tenemos oficina");

      this._servicioOficinas 
      .Get(this.oBuscarOfi)
      .subscribe(
        (Response: Oficina) => {
 
          this.oOficinasRes = Response;
          //console.log("RESULTADO LLAMADA Oficinas "+JSON.stringify(this.oOficinasRes) );              
 
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
          console.log("error");
          console.log(this.oOficinasRes);
        
        }
      ); 
     
    }else{
    //  console.log("Ya tenemos oficina");

      this.oOficinasRes = JSON.parse(localStorage.getItem('Oficinas'));

      this.oBuscar.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo; 
      this.oBuscar.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo; 

     }


     //Consulta lineas de producto
    if (!localStorage.getItem('Lineas')){

      //  console.log("Lineas no existen");


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
        }else{
          //console.log("Lineas ya existen");

          this.oLineasRes = JSON.parse(localStorage.getItem('Lineas'));
          this.oLineasCon = this.oLineasRes.Contenido
          this.oBuscar.LineaDesde = this.oLineasRes.Contenido[0].LineaCodigo; 
          this.oBuscar.LineaHasta = this.oLineasRes.Contenido[this.oLineasRes.Contenido?.length - 1].LineaCodigo; 

        }

       
          //Realizamos llamada al servicio de categorias 
          if (!localStorage.getItem('Categorias')){

            //console.log("No tenemos categorias");
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

                this.oSubCatDesde = this.oCategoriasCon.filter(x => x.CategoriaCodigo == this.oCategoriasCon[0].CategoriaCodigo && x.Subcategoria !='');          
                this.oBuscar.SubcategoDesde = this.oSubCatDesde[0].Subcategoria;
       
                this.oSubCatHasta = this.oCategoriasCon.filter(x => x.CategoriaCodigo == this.oCategoriasCon[this.oCategoriasCon.length - 1].CategoriaCodigo && x.Subcategoria !='');     
                this.oBuscar.SubcategoHasta = this.oSubCatHasta[this.oSubCatHasta.length - 1].Subcategoria;
         

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

          }else{
           // console.log("Tenemos categorias");
            
            this.oCategoriasRes = JSON.parse(localStorage.getItem('Categorias'));
            this.oCategoriasCon = this.oCategoriasRes.Contenido;
            this.oBuscar.CategoriaDesde = this.oCategoriasCon[0].CategoriaCodigo; 
            this.oBuscar.CategoriaHasta = this.oCategoriasCon[this.oCategoriasCon.length - 1].CategoriaCodigo; 

            this.oSubCatDesde = this.oCategoriasCon.filter(x => x.CategoriaCodigo == this.oCategoriasCon[0].CategoriaCodigo && x.Subcategoria !='');          
            this.oBuscar.SubcategoDesde = this.oSubCatDesde[0].Subcategoria;
   
            this.oSubCatHasta = this.oCategoriasCon.filter(x => x.CategoriaCodigo == this.oCategoriasCon[this.oCategoriasCon.length - 1].CategoriaCodigo && x.Subcategoria !='');     
            this.oBuscar.SubcategoHasta = this.oSubCatHasta[this.oSubCatHasta.length - 1].Subcategoria;
     
          }

          
   
      this.dtTrigger1.next("");
      
      this.dtTrigger2.next("");
          

      
    }


    //Funcion para consultar las ventas cliente articulo 
    consultaVentasArticulo(){
      
    console.log(this.oBuscar);
    this.oBuscar.TipoUsuario = this.sTipo
    this.oBuscar.Usuario = this.sCodigo
    this.bCargando = true;
    this.bBandera = false;

    if (this.oBuscar.OrdenReporte == 'C'){
      this.bFiltroOrden = true;//Es categoria
    }else{
      this.bFiltroOrden = false;//Es pieza o importe
    }

    console.log("Imprime bandera"+this.bBandera);

    if(this.bFiltroOrden){//Ventas por articulo CATEGORIA
      console.log("Entra a categoria");

      //Realizamos llamada al servicio ventas articulo x CATEGORIA
     this._servicioVentasArticulo
     .Get(this.oBuscar)
     .subscribe(
       (Response: VentasArticulo) => {
 
         this.oVentasArticuloRes = Response;
         //this.pedido = this.oRelacionPedRes.Contenido.Pedidos
                
 
         //console.log( this.collectionSize);
         console.log("RESULTADO LLAMADA  "+JSON.stringify(this.oVentasArticuloRes) );
         //console.log(this.pedido);
 
         if(this.oVentasArticuloRes.Codigo != 0){
           this.bError= true;
           this.sMensaje="No se encontraron datos de venta por artículo";
           this.bBandera = false;
           this.bCargando = false;
           return;
         }
 
         this.sMensaje="";
         this.bBandera = true;
       

         if (this.oBuscar.Presentacion == 'R'){
          this.bFiltrResumido = true;//Es resumido
         }else{
          this.bFiltrResumido = false;//Es detallado
         }

         this.bCargando = false;

        for(var venArt of this.oVentasArticuloRes.Contenido){
          for(var subCat of venArt.Subcategorias){
            for(var linPro of subCat.LineasProducto){
              for(var art of linPro.Articulos){
                //lineas
                art.PiezasPorcentajeAux = this.reemplaza(this.formatoMoneda(art.PiezasPorcentaje),'$');
                art.GramosAux = this.reemplaza(this.formatoMoneda(art.Gramos),'$');
                art.GramosPorcentajeAux = this.reemplaza(this.formatoMoneda(art.GramosPorcentaje),'$');
                art.ImporteVentaAux = this.reemplaza(this.formatoMoneda(art.ImporteVenta),'$');
              }
              //Totales lineas
              linPro.TotalPiezasArticulo = this.getTotalPiezasArticulo(linPro.Articulos)
              linPro.TotalPiezasPorArticulo = this.reemplaza(this.formatoMoneda(this.getTotalPiezasPorArticulo(linPro.Articulos)),'$')
              linPro.TotalGramosArticulo = this.reemplaza(this.formatoMoneda(this.getTotalGramosArticulo(linPro.Articulos)),'$')
              linPro.TotalGramosPorArticulo = this.reemplaza(this.formatoMoneda(this.getTotalGramosPorArticulo(linPro.Articulos)),'$')
              linPro.TotalImpVenArticulo = this.formatoMoneda(this.getTotalImpVenArticulo(linPro.Articulos))
            }
            //Totales SubCategorias
            subCat.TotalPiezasxSubCat = this.getTotalPiezasxSubCat(subCat.LineasProducto)
            subCat.TotalPiezasPorxSubCat = this.reemplaza(this.formatoMoneda(this.getTotalPiezasPorxSubCat(subCat.LineasProducto)),'$')
            subCat.TotalGramosxSubCat = this.reemplaza(this.formatoMoneda(this.getTotalGramosxSubCat(subCat.LineasProducto)),'$')
            subCat.TotalGramosPorxSubCat = this.reemplaza(this.formatoMoneda(this.getTotalGramosPorxSubCat(subCat.LineasProducto)),'$')
            subCat.TotalImpVenxSubCat = this.formatoMoneda(this.getTotalImpVenxSubCat(subCat.LineasProducto))
          }

          //Totales Categoria
          venArt.TotalPiezasxCategoria = this.getTotalPiezasxCategoria(venArt.Subcategorias)
          venArt.TotalGramosxCategoria = this.reemplaza(this.formatoMoneda(this.getTotalGramosxCategoria(venArt.Subcategorias)),'$')          
          venArt.TotalImpVenxCategoria = this.formatoMoneda(this.getTotalImpVenxCategoria(venArt.Subcategorias))
        }
        //Totales generales
        this.oVentasArticuloRes.TotalPiezasxCliente = this.getTotalPiezasGeneral(this.oVentasArticuloRes.Contenido) 
        this.oVentasArticuloRes.TotalGramosxCliente = this.reemplaza(this.formatoMoneda(this.getTotalGramosGeneral(this.oVentasArticuloRes.Contenido)),'$') 
        this.oVentasArticuloRes.TotalImpVenxCliente = this.formatoMoneda(this.getTotalImpVenGeneral(this.oVentasArticuloRes.Contenido))                     


        $("#firstTable").DataTable().destroy();
        this.dtTrigger1.next("");
       // $("#secondTable").DataTable().destroy();
         //   this.dtTrigger2.next("");
  
    

         this.isCollapsed = true;


       },
       (error:VentasArticulo) => {
 
         this.oVentasArticuloRes = error;
 
         console.log("error");
         console.log(this.oVentasArticuloRes);
         this.sMensaje="No se encontraron datos de venta por artículo";
         this.bCargando = false;
         this.bBandera = false;
       
       }
     );


    }else{//Ventas por articulo PIEZAS e IMPORTE

      console.log("Entra a Piezas e importe");
        
    
        //Realizamos llamada al servicio ventas cliente articulo por piezas o importe
        this._servicioVentasArticuloPzasImp
        .Get(this.oBuscar)
        .subscribe(
          (Response: VentasArticuloPzasImp) => {
    
            this.oVentasArticuloPzasImpRes = Response;
            //this.pedido = this.oRelacionPedRes.Contenido.Pedidos                    
    
            //console.log( this.collectionSize);
            console.log("RESULTADO LLAMADA por Pieza y importe "+JSON.stringify(this.oVentasArticuloPzasImpRes));
            //console.log(this.pedido);
    
            if(this.oVentasArticuloPzasImpRes.Codigo != 0){
              this.bError= true;
              this.sMensaje="No se encontraron datos de venta por artículo piezas y importe";
              this.bBanderaPzIm = false;
              this.bCargando = false;
              return;
            }

            for(var venArt of this.oVentasArticuloPzasImpRes.Contenido){
              for(var subCat of venArt.Subcategorias){
                for(var artDet of subCat.Detalle){
                 
                    //Lineas
                    artDet.PiezasAux = this.reemplaza(this.formatoMoneda(artDet.Piezas),'$');
                    artDet.PiezasPorcentajeAux = this.reemplaza(this.formatoMoneda(artDet.PiezasPorcentaje),'$');
                    artDet.GramosAux = this.reemplaza(this.formatoMoneda(artDet.Gramos),'$');
                    artDet.GramosPorcentajeAux = this.reemplaza(this.formatoMoneda(artDet.GramosPorcentaje),'$');
                    artDet.ImporteVentaAux = this.reemplaza(this.formatoMoneda(artDet.ImporteVenta),'$');
                  
               
                }
                   //Totales SubCategoria
                   subCat.TotalPiezasxSubCat = this.getTotalPiezasxSubCatPI(subCat.Detalle)
                   subCat.TotalPiezasPorxSubCat = this.reemplaza(this.formatoMoneda(this.getTotalPiezasPorxSubCatPI(subCat.Detalle)),'$')
                   subCat.TotalGramosxSubCat = this.reemplaza(this.formatoMoneda(this.getTotalGramosxSubCatPI(subCat.Detalle)),'$')
                   subCat.TotalGramosPorxSubCat = this.reemplaza(this.formatoMoneda(this.getTotalGramosPorxSubCatPI(subCat.Detalle)),'$')
                   subCat.TotalImpVenxSubCat = this.formatoMoneda(this.getTotalImpVenxSubCatPI(subCat.Detalle))
 
              }

              //Totales Categoria
              venArt.TotalPiezasxCategoria = this.getTotalPiezasxCatPI(venArt.Subcategorias)
              venArt.TotalGramosxCategoria = this.reemplaza(this.formatoMoneda(this.getTotalGramosxCatPI(venArt.Subcategorias)),'$')          
              venArt.TotalImpVenxCategoria = this.formatoMoneda(this.getTotalImpVenxCatPI(venArt.Subcategorias))
            }

            //Totales generales
            this.oVentasArticuloPzasImpRes.TotalPiezasGeneral = this.getTotalGenPiezasGeneralPI(this.oVentasArticuloPzasImpRes.Contenido) 
            this.oVentasArticuloPzasImpRes.TotalGramosGeneral = this.reemplaza(this.formatoMoneda(this.getTotalGenGramosGeneralPI(this.oVentasArticuloPzasImpRes.Contenido)),'$') 
            this.oVentasArticuloPzasImpRes.TotalImpVenGeneral = this.formatoMoneda(this.getTotalGenImpVenGeneralPI(this.oVentasArticuloPzasImpRes.Contenido))                     
    
            this.sMensaje="";
            this.bBanderaPzIm = true;
            this.bBandera = true;
            this.bCargando = false;
            this.isCollapsed = true;

           
           // $("#firstTable").DataTable().destroy();
            //this.dtTrigger1.next("");

            $("#secondTable").DataTable().destroy();
            this.dtTrigger2.next("");
        
    
          },
          (error:VentasArticuloPzasImp) => {
    
            this.oVentasArticuloPzasImpRes = error;
    
            console.log("error");
            console.log(this.oVentasArticuloPzasImpRes);
            this.sMensaje="No se encontraron datos de venta por artículo piezas y importe";
            this.bBanderaPzIm = false;
            this.bBandera = false;
          
          }
        );
    }


     
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
  getTotalPiezasGeneral(oContenido: Contenido[]): number {   
  let Total: number = 0;
  
  for(var oConte of oContenido){    
    for(var subCat of oConte.Subcategorias){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.Piezas;  
        }        
      }    
    }
  }
    Total = Number(Total.toFixed(2));
    return Total; 
  }
  
  getTotalGramosGeneral(oContenido: Contenido[]): number {   
  let Total: number = 0;

  for(var oConte of oContenido){ 
    for(var subCat of oConte.Subcategorias){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.Gramos;  
        }        
      }
    } 
    
  }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalImpVenGeneral(oContenido: Contenido[]): number {   
  let Total: number = 0;

  for(var oConte of oContenido){   
    for(var subCat of oConte.Subcategorias){ 
      for(var linPro of subCat.LineasProducto){ 
        for(var art of linPro.Articulos){ 
          Total += art.ImporteVenta;  
        }        
      }
    } 
    
  }
  Total = Number(Total.toFixed(2));
    return Total; 
  }   



    // #### Obten totales por SubCategoria piezas o importe ####
  
    getTotalPiezasPorxSubCatPI(oDetArt: Detalle[]): number {   
      let Total: number = 0;  
    
      for(var detArt of oDetArt){  
        Total += detArt.PiezasPorcentaje;     
      }
      Total = Number(Total.toFixed(2));
      return Total; 
    }
  
    getTotalPiezasxSubCatPI(oDetArt: Detalle[]): number {   
      let Total: number = 0;  
  
    
      for(var detArt of oDetArt){           
            Total += detArt.Piezas; 
      }
      console.log("TOTAL"+Total)
      Total = Number(Total.toFixed(2));
      return Total; 
    }
  
    getTotalGramosxSubCatPI(oDetArt: Detalle[]): number {
      let Total: number = 0;    
    
      for(var detArt of oDetArt){   
          Total += detArt.Gramos;
      }
    Total = Number(Total.toFixed(2));
    return Total; 
    }  
  
    getTotalGramosPorxSubCatPI(oDetArt: Detalle[]): number {  
      let Total: number = 0;    
    
      for(var detArt of oDetArt){  
            Total += detArt.GramosPorcentaje; 
      }
        
      Total = Number(Total.toFixed(2));
      return Total; 
    } 
     
     getTotalImpVenxSubCatPI(oDetArt: Detalle[]): number {   
      let Total: number = 0;
    
    
      for(var detArt of oDetArt){  
          Total += detArt.ImporteVenta;          
      }
      Total = Number(Total.toFixed(2));
      return Total; 
    } 
      
     // #### Obten totales por SubCategoria piezas o importe ####
  
  // #### Obten totales por Categoria piezas o importe ####  
 
  getTotalPiezasxCatPI(oSubCat: SubcategoriasPI[]): number {   
    let Total: number = 0;  

  
    for(var cat of oSubCat){         
      for(var detArt of cat.Detalle){            
          Total += detArt.Piezas;      
      }  
    }
    console.log("TOTAL"+Total)
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalGramosxCatPI(oSubCat: SubcategoriasPI[]): number {
    let Total: number = 0;
  
  
    for(var cat of oSubCat){         
      for(var detArt of cat.Detalle){  
        Total += detArt.Gramos;      
      }
  }
  Total = Number(Total.toFixed(2));
  return Total; 
}
   
   getTotalImpVenxCatPI(oSubCat: SubcategoriasPI[]): number {   
    let Total: number = 0;
  
  
    for(var cat of oSubCat){         
      for(var detArt of cat.Detalle){ 
        Total += detArt.ImporteVenta; 
      }     
        
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  } 
    
   // #### Obten totales por Categoria piezas o importe ####

   // #### Obten totales generales piezas o importe####
  getTotalGenPiezasGeneralPI(oCateg: ContenidoCatPI[]): number {   
    let Total: number = 0;
  
    for(var cat of oCateg){ 
      for(var subCat of cat.Subcategorias){ 
        for(var art of subCat.Detalle){ 
          Total += art.Piezas;  
        }        
      }
          
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }
  getTotalGenGramosGeneralPI(oCateg: ContenidoCatPI[]): number {   
    let Total: number = 0;
  
    for(var cat of oCateg){ 
      for(var subCat of cat.Subcategorias){ 
        for(var art of subCat.Detalle){  
          Total += art.Gramos;  
        }        
      }
          
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }
   getTotalGenImpVenGeneralPI(oCateg: ContenidoCatPI[]): number {   
    let Total: number = 0;
  
    for(var cat of oCateg){ 
      for(var subCat of cat.Subcategorias){ 
        for(var art of subCat.Detalle){ 
          Total += art.ImporteVenta;  
        }        
      }
          
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }    
  // #### Obten totales generales por Categoria ####




// #### Obten totales por Cliente ####

downloadAsPDF() {

  const pdfTable = this.pdfTable.nativeElement;


  var cadenaaux = pdfTable.innerHTML;

  cadenaaux = this.TablaVentasArticulo(this.bFiltrResumido);


  var html = htmlToPdfmake(cadenaaux);
  html[0].table.headerRows=1;
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

    number = Number((number).toFixed(2));
    console.log("importante"+number);
    if (number == 99){
      number = 100;
    }

    return new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD', maximumFractionDigits: 2}).format(number);
  };




  reemplaza(valor: string, valorAReemplazar: string){    
    let res: string;
    res = valor.replace(valorAReemplazar,'');
    return res;     
  }; 


  
  
  cargaSubCat(sCategoria, bCategoria: boolean){
    console.log(sCategoria); // Aquí iría tu lógica al momento de seleccionar algo  

    if (bCategoria){//Es categoria desde
      this.oSubCatDesde = this.oCategoriasCon.filter(x => x.CategoriaCodigo == sCategoria && x.Subcategoria !='') ;
    }else{//Es categoria hasta
      this.oSubCatHasta = this.oCategoriasCon.filter(x => x.CategoriaCodigo == sCategoria && x.Subcategoria !='');
    }      
    console.log("Resultado del segundo = "+JSON.stringify(bCategoria ? this.oSubCatDesde : this.oSubCatHasta));
  }
  


  TablaVentasArticulo(bFiltro): string
  {

    var tabla = "";
    
    if (bFiltro){

      tabla =  '<table class="table table-hover table-striped  " datatable [dtOptions]="dtOptions">'+'\n'+
      ' <thead>'+'\n'+
        ' <tr class="EncTabla">'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;">LN</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;">DESCRIPCION LÍNEA</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;">COLECCIÓN</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white; text-align: right;">PIEZAS</th>'+'\n'+
          ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white; text-align: right;">%P/CAT</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white; text-align: right;">GRAMOS</th>'+'\n'+
          ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white; text-align: right;">%G/CAT</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white; text-align: right;">IMPORTE VENTA</th>              '+'\n'+
        ' </tr>'+'\n'+
        ' </thead>'+'\n'+
        ' <tbody>'+'\n';

    }else{

      tabla =  '<table class="table table-hover table-striped  " datatable [dtOptions]="dtOptions">'+'\n'+
      ' <thead>'+'\n'+
        ' <tr class="EncTabla">'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;">CÓDIGO</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;">DESCRIPCIÓN</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;">TIPO</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white; text-align: right;">PIEZAS</th>'+'\n'+
          ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white; text-align: right;">%P/CAT</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white; text-align: right;">GRAMOS</th>'+'\n'+
          ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white; text-align: right;">%G/CAT</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white; text-align: right;">IMPORTE VENTA</th>              '+'\n'+
        ' </tr>'+'\n'+
      ' </thead>'+'\n'+
      ' <tbody>'+'\n';
    }



  
        


    this.oVentasArticuloRes.Contenido.forEach(function(venArt){
      tabla = tabla +   ' <tr class="table-info">'+'\n'+                    
        ' <td class="FilasFonelli">'+'CATEGORIA'+' '+venArt.CategoriaCodigo + ': ' + venArt.CategoriaNombre +'</td>'+'\n'+
        ' <td></td>'+'\n'+
        ' <td></td>'+'\n'+
        ' <td></td>'+'\n'+
        ' <td></td>'+'\n'+
        ' <td></td> '+'\n'+
        ' <td></td>'+'\n'+
        ' <td></td>'+'\n'+
      ' </tr>'+'\n';

      venArt.Subcategorias.forEach(function(subCat){
        tabla = tabla +
        ' <tr class="table-warning" >'+'\n'+
          ' <td class="FilasFonelli">'+subCat.SubcategoriaCodigo + ' : ' + subCat.SubcategoriaNombre +'</td>   '+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td> '+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td>'+'\n'+
        '</tr> '+'\n';

            

        subCat.LineasProducto.forEach(function(linPro){


          //DETALLADO
          if(!bFiltro){
            tabla = tabla + ' <tr> '+'\n'+
              ' <td class=""><strong>'+linPro.LineaCodigo + ' - ' + linPro.LineaDescripc +'</strong></td>'+'\n'+
              ' <td></td>'+'\n'+
              ' <td></td>'+'\n'+
              ' <td></td>'+'\n'+
              ' <td></td>'+'\n'+
              ' <td></td> '+'\n'+
              ' <td></td>'+'\n'+
              ' <td></td> '+'\n'+
            ' </tr> '+'\n';

            linPro.Articulos.forEach(function(art){              
              tabla = tabla +   '<tr >' + '\n' +
                ' <td class="FilasFonelli">'+art.ArticuloCodigo+'</td>'+'\n'+
                ' <td class="FilasFonelli">'+art.ArticuloDescripc+'</td>'+'\n'+
                ' <td class="FilasFonelli">'+art.ArticuloTipo+'</td>'+'\n'+
                ' <td class="FilasFonelli" style="text-align: right;">'+art.Piezas+'</td>'+'\n'+
                ' <td *ngIf="!bCliente" class="FilasFonelli" style="text-align: right;">'+art.PiezasPorcentajeAux+'</td>'+'\n'+
                ' <td class="FilasFonelli" style="text-align: right;">'+art.GramosAux+'</td>'+'\n'+
                ' <td *ngIf="!bCliente" class="FilasFonelli" style="text-align: right;">'+art.GramosPorcentajeAux+'</td>'+'\n'+
                ' <td class="FilasFonelli" style="text-align: right;">'+art.ImporteVentaAux+'</td>'+'\n'+
              ' </tr>'+'\n';            
            });   

            //DETALLADO
            tabla = tabla + ' <tr> '+'\n'+
              ' <td class="FilasFonelli"></td>'+'\n'+
              ' <td class="FilasFonelli"></td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align: right;">Total Línea</td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align: right;">'+linPro.TotalPiezasArticulo+'</td>'+'\n'+
              ' <td *ngIf="!bCliente" class="FilasFonelli" style="text-align: right;">'+linPro.TotalPiezasPorArticulo+'</td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align: right;">'+linPro.TotalGramosArticulo+'</td>'+'\n'+
              ' <td *ngIf="!bCliente" class="FilasFonelli" style="text-align: right;">'+linPro.TotalGramosPorArticulo+'</td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align: right;">'+linPro.TotalImpVenArticulo+'</td>'+'\n'+
            ' </tr> '+'\n';

          }
      


          if(bFiltro){
            //RESUMIDO

            tabla = tabla + ' <tr> '+'\n'+
              ' <td class="FilasFonelli">'+linPro.LineaCodigo+'</td>'+'\n'+
              ' <td class="FilasFonelli">'+linPro.LineaDescripc+'</td>'+'\n'+
              ' <td class="FilasFonelli">'+linPro.ColeccionDescripc+'</td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align: right;">'+linPro.TotalPiezasArticulo+'</td>'+'\n'+
              ' <td *ngIf="!bCliente" class="FilasFonelli" style="text-align: right;">'+linPro.TotalPiezasPorArticulo+'</td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align: right;">'+linPro.TotalGramosArticulo+'</td>'+'\n'+
              ' <td *ngIf="!bCliente" class="FilasFonelli" style="text-align: right;">'+linPro.TotalGramosPorArticulo+'</td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align: right;">'+linPro.TotalImpVenArticulo+'</td>'+'\n'+
            ' </tr>'+'\n';

          }       
        });

        //TOTAL SUBCATEGORIA
        tabla = tabla + ' <tr> '+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td>'+'\n'+
          ' <td class="FilasFonelli" style="text-align: right;">Total SubCategoria</td>'+'\n'+
          ' <td class="FilasFonBold" style="text-align: right;">'+subCat.TotalPiezasxSubCat+'</td>'+'\n'+
          ' <td *ngIf="!bCliente" class="FilasFonBold" style="text-align: right;">'+subCat.TotalPiezasPorxSubCat+'</td>'+'\n'+
          ' <td class="FilasFonBold" style="text-align: right;">'+subCat.TotalGramosxSubCat+'</td>'+'\n'+
          ' <td *ngIf="!bCliente" class="FilasFonBold" style="text-align: right;">'+subCat.TotalGramosPorxSubCat+'</td>'+'\n'+
          ' <td class="FilasFonBold" style="text-align: right;">'+subCat.TotalImpVenxSubCat+'</td>'+'\n'+
        ' </tr>'+'\n';
      
      });

      //TOTAL CATEGORIA
      tabla = tabla + ' <tr> '+'\n'+
        ' <td></td>'+'\n'+
        ' <td></td>      '+'\n'+
        ' <td class="FilasFonelli" style="text-align: right;">Total Categoria</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">'+venArt.TotalPiezasxCategoria+'</td>'+'\n'+
        ' <td *ngIf="!bCliente" class="FilasFonBold" style="text-align: right;"></td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">'+venArt.TotalGramosxCategoria+'</td>'+'\n'+
        ' <td *ngIf="!bCliente" class="FilasFonBold" style="text-align: right;"></td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">'+venArt.TotalImpVenxCategoria+'</td>'+'\n'+
      ' </tr>'+'\n';
    });

    //TOTAL CLIENTE
    tabla = tabla + ' <tr> '+'\n'+
    ' <td></td>'+'\n'+
    ' <td></td>      '+'\n'+
    ' <td class="FilasFonBold" style="text-align: right; color: #183e6f;">Total General</td>'+'\n'+
    ' <td class="FilasFonBold" style="text-align: right; color: #183e6f;">'+this.oVentasArticuloRes.TotalPiezasxCliente+'</td>'+'\n'+
    ' <td *ngIf="!bCliente" class="FilasFonBold" style="text-align: right; color: #183e6f; "></td>'+'\n'+
    ' <td class="FilasFonBold" style="text-align: right; color: #183e6f;">'+this.oVentasArticuloRes.TotalGramosxCliente+'</td>'+'\n'+
    ' <td *ngIf="!bCliente" class="FilasFonBold" style="text-align: right; color: #183e6f;"></td>'+'\n'+
    ' <td class="FilasFonBold" style="text-align: right; color: #183e6f;">'+this.oVentasArticuloRes.TotalImpVenxCliente+'</td>'+'\n'+
  ' </tr>'+'\n'+
  ' </tbody>' + '\n' +          
  ' </table>';



    return tabla;


  }

  
//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    localStorage.clear();
    this._router.navigate(['/']);    
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger1.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }

  ngAfterViewInit(): void {
    //this.dtTrigger1.next("");
    //this.dtTrigger2.next("");
  }


}


