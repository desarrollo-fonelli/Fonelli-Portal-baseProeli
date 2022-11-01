import { Component, OnInit,ChangeDetectorRef, ElementRef, ViewChild,ViewChildren, OnDestroy, QueryList} from '@angular/core';
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
import { FiltrosReporteVentas } from 'src/app/models/reporteventas.filtros';
import { ReporteVentas, Cliente, Categorias as CliCategoriasCon, ClientesConVenta, TotalGeneralCategorias, Contenido } from 'src/app/models/reporteventas';
import {FiltrosClientes} from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido as ContenidoCli } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';
import { FiltrosCategorias } from 'src/app/models/categorias.filtros';
import { Categorias, Contenido as CategoriasCon } from 'src/app/models/categorias';
import { FiltrosAgente } from 'src/app/models/agentes.filtros';
import { Agentes, Contenido as AgentesCon } from 'src/app/models/agentes';
import { FiltrosTipoCliente } from 'src/app/models/tipocliente.filtros';
import { TipoCliente, Contenido as TiposClienteCon } from 'src/app/models/tipocliente';




//Servicios
import { ServicioReporteVentas } from 'src/app/services/reporteventas.service';
import { ServicioClientes } from 'src/app/services/clientes.service';
import { ServicioCategorias } from 'src/app/services/categorias.service';
import { ServicioAgentes } from 'src/app/services/agentes.service';
import { ServicioTiposCliente } from 'src/app/services/tiposclientes.service';





import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-reporteventas',
  templateUrl: './reporteventas.component.html',
  styleUrls: ['./reporteventas.component.css'],
  providers:[
    DecimalPipe,
    ServicioClientes,
    ServicioCategorias,
    ServicioReporteVentas,
    ServicioAgentes
  ]
})
export class ReporteventasComponent implements OnInit, OnDestroy {

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
  dtTrigger3: Subject<any> = new Subject();

  public oBuscar: FiltrosReporteVentas;
  oReporteVentasRes: ReporteVentas; 
  oClienteCont: Cliente[];
  oClienteConVentaCont: ClientesConVenta;
  oClienteGeneralCatCont: TotalGeneralCategorias[];

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

  public bMuestraTablaA: boolean  =false;
  public bMuestraTablaB: boolean  =false;

  bBandera: boolean;
  public isCollapsed = false;

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

  public oBuscarAgentes: FiltrosAgente;
  public oAgentes: Agentes; 
  public oAgentesCon: AgentesCon[];

  public bBanderaCliente: boolean;

  private _mobileQueryListener: () => void;

  sWidth: number;
  sHeight: number;

  //Datos tipo cliente
  public oBuscaTipoCliente: FiltrosTipoCliente;
  public oTipoCliente: TipoCliente; 
  public oTiposClienteCon: TiposClienteCon[];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private _route: ActivatedRoute,
    private _router: Router,
    private _servicioReporteVentas: ServicioReporteVentas,
    private modalService: NgbModal,
    private _servicioCClientes: ServicioClientes,
    private _servicioCategorias:ServicioCategorias,
    private _servicioAgentes: ServicioAgentes,
    private _servicioTiposCliente: ServicioTiposCliente) { 

      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

      this.sCodigo = Number(localStorage.getItem('codigo'));
      this.sTipo = localStorage.getItem('tipo');
      this.sFilial  = Number(localStorage.getItem('filial'));
      this.sNombre = localStorage.getItem('nombre');
  
      //Inicializamos variables consulta pedidos
      this.oBuscar = new FiltrosReporteVentas('','',0,0,0,0,0,0,'','','','','','','','','','','','','','',0)
      //this.oReporteVentasRes= {} as oReporteVentasRes; 


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

      this.oReporteVentasRes = {} as ReporteVentas;
      this.oReporteVentasRes.Contenido = {} as Contenido;
      this.oClienteConVentaCont = {} as ClientesConVenta;

    }

    ngOnInit(): void {

      this.dtOptions[0] = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        order:[],
        ordering:false,
        dom: 'flBtip',
        language: {
          url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },  
        buttons: [
          {
            extend: 'excelHtml5',
            title: 'Reporte de Ventas',
            text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
            className: "btnExcel btn"            
          }
        ]

        
      };

      this.dtOptions[1] = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        order:[],
        ordering:false,
        dom: 'flBtip',
        language: {
          url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },  
        buttons: [
          {
            extend: 'excelHtml5',
            title: 'Reporte de Ventas',
            text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
            className: "btnExcel btn"            
          }
        ]

        
      };

      this.dtOptions[2] = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        order:[],
        ordering:false,
        dom: 'lBtip',
        language: {
          url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },  
        buttons: [
          {
            extend: 'excelHtml5',
            title: 'Reporte de Ventas - Total General',
            text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
            className: "btnExcel btn"            
          }
        ]        
      };


      this.dtTrigger1.next("");
      
      this.dtTrigger2.next("");

      this.dtTrigger3.next("");
          

      console.log("La resolución de tu pantalla es: " + screen.width + " x " + screen.height);

      this.sWidth = screen.width;
      this.sHeight = (screen.height/2);
  
      //Se agrega validacion control de sesion distribuidores
      if(!this.sCodigo) {
        console.log('ingresa VALIDACION');
        this._router.navigate(['/']);
      }

      let date: Date = new Date();
      let mes;
      
      //Valida mes 
      if ((date.getMonth()+1).toString().length == 1){
        mes = '0'+(date.getMonth()+1);
      } else {
        mes = (date.getMonth()+1);
      }

      let fecha1Desde =   (date.getFullYear()-1)+'-01-01';          
      let fecha2Desde =   date.getFullYear()+'-01-01';
      //let fecha1Hasta =  (date.getFullYear()-1) +'-'+ mes +'-'+(date.getDate().toString().length == 1 ? '0' + (date.getDate()-1) : (date.getDate()-1)); 
      
      //let fecha2Hasta =  date.getFullYear() +'-'+ mes +'-'+(date.getDate().toString().length == 1 ? '0'+(date.getDate()-1) : (date.getDate()-1)); 
      let fecha1Hasta: string;
      let fecha2Hasta: string;
      //validacion dia anterior inicio de mes
      if(date.getDate() == 1){//es inicio de mes
        if(mes == '01'){
          mes = '12';
          fecha1Hasta = (date.getFullYear()-1) +'-'+ mes +'-'+'31'; 
          fecha2Hasta = (date.getFullYear()) +'-'+ mes +'-'+'31';          
        }else{
          mes = mes-1;
          if(mes < 10){
            fecha1Hasta = (date.getFullYear()-1) +'-0'+ mes +'-'+'31';
            fecha2Hasta = (date.getFullYear()) +'-0'+ mes +'-'+'31'; 
          } else {
            fecha1Hasta = (date.getFullYear()-1) +'-'+ mes +'-'+'31'; 
            fecha2Hasta = (date.getFullYear()) +'-'+ mes +'-'+'31';            
          }
        }        
      }else{

        fecha1Hasta = (date.getFullYear()-1) +'-'+ mes +'-'+(date.getDate().toString().length == 1 ? '0'+(date.getDate()-1) : (date.getDate()-1).toString().length == 1 ? '0'+(date.getDate()-1) : date.getDate()-1 );
        
        fecha2Hasta = (date.getFullYear()) +'-'+ mes +'-'+(date.getDate().toString().length == 1 ? '0'+(date.getDate()-1) : (date.getDate()-1).toString().length == 1 ? '0'+(date.getDate()-1) : date.getDate()-1 ); 
      }
console.log(mes,fecha1Hasta,fecha2Hasta);
      this.fechaHoy =  (date.getDate() +'-'+mes+'-'+ date.getFullYear());   

      switch(this.sTipo) { 
        case 'C':{    
          //Tipo cliente
          console.log('1');                           

           this.oBuscar.AgenteCodigo = this.sCodigo; 
           //this.oBuscar.ClienteHasta = this.sCodigo;   
           this.bCliente = true;    
           break; 
        } 
        case 'A': { 
           //Agente; 
           this.oBuscar.AgenteCodigo = this.sCodigo; 
           this.oBuscar.Usuario = this.sCodigo; 
           this.oBuscar.Tipo = "2";
           this.bCliente = false;    
           break; 
        } 
        default: { 
           //Gerente;
           this.oBuscar.Tipo = "1";
           this.oBuscar.Usuario = this.sCodigo;
           //this.oBuscar.AgenteCodigo = this.sCodigo;
           this.bCliente = false;     
           break; 
        } 
      } 


      
      this.oBuscar.Fecha1Desde = fecha1Desde;
      this.oBuscar.Fecha2Desde = fecha2Desde;
      this.oBuscar.Fecha1Hasta = fecha1Hasta;
      this.oBuscar.Fecha2Hasta = fecha2Hasta;
      this.oBuscar.OrdenReporte = 'C';
      this.oBuscar.DesglosaCliente = 'S';
      this.oBuscar.DesglosaCategoria = 'S';
      this.oBuscar.TipoOrigen = 'T';
      this.oBuscar.ClienteHasta = 999999;
      this.oBuscar.FilialHasta = 999;
      this.oBuscar.TipoUsuario = this.sTipo;
      this.oBuscar.TipoClienteDesde = 'AA';
      this.oBuscar.TipoClienteHasta = 'ZZ';

      /*this.oBuscar.TipoClienteDesde = 'GF';
      this.oBuscar.TipoClienteHasta = 'PR';
      this.oBuscar.ClienteHasta = 120;
      this.oBuscar.ClienteDesde = 50;
      this.oBuscar.SubcategoDesde = 'A';
      this.oBuscar.SubcategoHasta = 'Z';*/

      this.Buscar.TipoUsuario = this.sTipo;
      this.Buscar.Usuario = this.sCodigo;
       
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
              this.oSubCatDesde = this.oCategoriasCon.filter(x => x.CategoriaCodigo == this.oCategoriasRes.Contenido[0].CategoriaCodigo && x.Subcategoria !='');          
              this.oBuscar.SubcategoDesde = this.oSubCatDesde[0].Subcategoria;
      
              this.oSubCatHasta = this.oCategoriasCon.filter(x => x.CategoriaCodigo == this.oCategoriasRes.Contenido[0].CategoriaCodigo && x.Subcategoria !='');     
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
          //console.log("Tenemos categorias");
          
          this.oCategoriasRes = JSON.parse(localStorage.getItem('Categorias'));
          this.oCategoriasCon = this.oCategoriasRes.Contenido;
          this.oBuscar.CategoriaDesde = this.oCategoriasRes.Contenido[0].CategoriaCodigo; 
          this.oBuscar.CategoriaHasta = this.oCategoriasRes.Contenido[this.oCategoriasRes.Contenido?.length - 1].CategoriaCodigo; 
          
          this.oSubCatDesde = this.oCategoriasCon.filter(x => x.CategoriaCodigo == this.oCategoriasCon[0].CategoriaCodigo && x.Subcategoria !='');          
          this.oBuscar.SubcategoDesde = this.oSubCatDesde[0].Subcategoria;
   
          this.oSubCatHasta = this.oCategoriasCon.filter(x => x.CategoriaCodigo == this.oCategoriasCon[this.oCategoriasCon.length - 1].CategoriaCodigo && x.Subcategoria !='');     
          this.oBuscar.SubcategoHasta = this.oSubCatHasta[this.oSubCatHasta.length - 1].Subcategoria;
        }


      //Realizamos llamada al servicio de clientes 
      if (!localStorage.getItem('Clientes')){

       // console.log("no tenemos  Clientes");

        this._servicioCClientes
          .GetCliente(this.Buscar)
          .subscribe(
            (Response: Clientes) =>  {        

              this.oCliente = Response;  
              console.log("Respuesta cliente"+JSON.stringify(this.oCliente));    
              if(this.oCliente.Codigo != 0){     
                return false;
              }
        
            
            this.oContenido= this.oCliente.Contenido[0];
              this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
              this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
              this.oContacto =this.oCliente.Contenido[0].Contactos;
              return true;

          
            },
            (error:Clientes) => {  
              this.oCliente = error;
              console.log(this.oCliente);
              return false;
          
            }
            
          );
         // console.log("Termina carga Clientes");

        }else{
         // console.log("Ya tenemos  Clientes");


          this.oCliente = JSON.parse(localStorage.getItem('Clientes'));
          this.oContenido = this.oCliente.Contenido[0];
          this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
          this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
          this.oContacto =this.oCliente.Contenido[0].Contactos;

        }

  //Consulta agentes
  if (!localStorage.getItem('Agentes')){

    this._servicioAgentes
    .Get(this.oBuscarAgentes)
    .subscribe(
      (Response: Agentes) =>  {
        

        this.oAgentes = Response;

        console.log("Respuesta agentes"+JSON.stringify(this.oAgentes));


        if(this.oAgentes.Codigo != 0){
          this.bError= true;
          this.sMensaje="No se encontraron agentes";   
          return false;
        }
   
        this.oAgentesCon = this.oAgentes.Contenido;        
        if (this.sTipo =='A'){
          this.oBuscar.AgenteCodigo = this.sCodigo; 
        }else{
          this.oBuscar.AgenteCodigo = Number(this.oAgentes.Contenido[0].AgenteCodigo); 
        }
        
        
        return true;

     
      },
      (error:Agentes) => {

        this.oAgentes = error;

        console.log("error");
        console.log(this.oAgentes);

        return false;
     
      }
      
    );
  
  }else{//Ya tenemos agentes
  //  console.log("Ya tenemos agentes");

    this.oAgentesCon = JSON.parse(localStorage.getItem('Agentes'));
    if (this.sTipo =='A'){
      this.oBuscar.AgenteCodigo = this.sCodigo; 
    }else{
      this.oBuscar.AgenteCodigo = Number(this.oAgentesCon[0].AgenteCodigo); 
    }
    




  }


  //Consulta Tipos cliente
  if (!localStorage.getItem('TiposCliente')){
    console.log("Inicia carga Tipos cliente");

    this._servicioTiposCliente
    .Get(this.oBuscaTipoCliente)
    .subscribe(
      (Response: TipoCliente) =>  {          

        this.oTipoCliente = Response;  
        console.log("Respuesta TiposCliente: "+JSON.stringify(this.oTipoCliente));

        if(this.oTipoCliente.Codigo != 0){
          this.bError= true;
          this.sMensaje="No se encontraron tipos de cliente";   
          return false;
        }

        this.oTiposClienteCon = this.oTipoCliente.Contenido;           
        return true;

      },
      (error:TipoCliente) => {

        this.oTipoCliente = error;             
        console.log(this.oTipoCliente);
        return false;
    
      }
      
    );
   // console.log("Termina carga oTipoCliente");
 }else{//Ya tenemos clientes

    this.oTiposClienteCon = JSON.parse(localStorage.getItem('TiposCliente'));    

    this.oBuscar.TipoClienteDesde = this.oTiposClienteCon[0].TipoCodigo
    this.oBuscar.TipoClienteHasta = this.oTiposClienteCon[this.oTiposClienteCon.length -1 ].TipoCodigo    

  }

          


      
}


    //Funcion para consultar reporte de ventas
    consultaReporteVentas(){
      
    console.log(this.oBuscar);
    //this.oBuscar.TipoUsuario = this.sTipo
    //this.oBuscar.Usuario = this.sCodigo;
    this.bCargando = true;


    


     //Realizamos llamada al servicio de relacion de pedidos
     this._servicioReporteVentas
     .Get(this.oBuscar)
     .subscribe(
       (Response: ReporteVentas) => {
 
         this.oReporteVentasRes = Response;
         //this.pedido = this.oRelacionPedRes.Contenido.Pedidos
                
 
         //console.log( this.collectionSize);
         console.log("RESULTADO LLAMADA  "+JSON.stringify(this.oReporteVentasRes) );
         //console.log(this.pedido);
 
         if(this.oReporteVentasRes.Codigo != 0){
           this.bError= true;
           this.sMensaje="No se encontraron datos en reporte de ventas";
           this.bBandera = false;
           this.bCargando = false;
           return;
         }
 
         this.sMensaje="";

         //public bMuestraTablaA: boolean  =false;
         //public bMuestraTablaB: boolean  =false;

if(this.oBuscar.DesglosaCategoria == 'S' && this.oBuscar.DesglosaCliente =='S')
{
  this.bMuestraTablaA = true;
  this.bMuestraTablaB = false;
}
else if(this.oBuscar.DesglosaCategoria == 'N' && this.oBuscar.DesglosaCliente =='S')
{
  this.bMuestraTablaA = false;
  this.bMuestraTablaB = true;
}
else
{
  this.bMuestraTablaA = false;
  this.bMuestraTablaB = false;
}



         this.bBandera = true;
         /*if (this.oBuscar.OrdenReporte == 'C'){
          this.bFiltroOrden = true;//Es categoria
         }else{
          this.bFiltroOrden = false;//Es pieza o importe
         }*/

         /*if (this.oBuscar.Presentacion == 'R'){
          this.bFiltrResumido = true;//Es resumido
         }else{
          this.bFiltrResumido = false;//Es detallado
         }*/

         this.bCargando = false;         
         this.oClienteCont	= this.oReporteVentasRes.Contenido.Clientes
         this.oClienteConVentaCont = this.oReporteVentasRes.Contenido.ClientesConVenta
         this.oClienteGeneralCatCont = this.oReporteVentasRes.Contenido.TotalGeneralCategorias

         for(var cli of this.oClienteCont){
          for(var cat of cli.Categorias){
            for(var subCat of cat.Subcategorias){

                //lineas
                subCat.Piezas1Aux = this.formatoNumero(subCat.Piezas1);
                subCat.Gramos1Aux = this.formatoNumero(subCat.Gramos1);
                subCat.ImporteVenta1Aux = this.formatoMoneda(subCat.ImporteVenta1);
                subCat.PorcentajeImporte1Aux = this.formatoNumero(subCat.PorcentajeImporte1);
                subCat.ValorAgregado1Aux = this.formatoMoneda(subCat.ValorAgregado1);
                subCat.PorcentajeValorAgregado1Aux = this.formatoMoneda(subCat.PorcentajeValorAgregado1);
                
                subCat.Piezas2Aux = this.formatoNumero(subCat.Piezas2);
                subCat.Gramos2Aux = this.formatoNumero(subCat.Gramos2);
                subCat.ImporteVenta2Aux = this.formatoMoneda(subCat.ImporteVenta2);
                subCat.PorcentajeImporte2Aux = this.formatoNumero(subCat.PorcentajeImporte2);
                subCat.ValorAgregado2Aux = this.formatoMoneda(subCat.ValorAgregado2);     
                subCat.PorcentajeValorAgregado2Aux = this.formatoMoneda(subCat.PorcentajeValorAgregado2);     
                
            }
          }
          //Totales Cliente
          cli.TotalesClientexPiezas1 = this.formatoNumero(this.getTotalesxCliente(cli.Categorias,'Piezas1'))
          cli.TotalesClientexGramos1 = this.formatoNumero(this.getTotalesxCliente(cli.Categorias,'Gramos1'))
          cli.TotalesClientexImporteVenta1 = this.formatoMoneda(this.getTotalesxCliente(cli.Categorias,'ImporteVenta1'))
          cli.TotalesClientexPorcentajeImporte1 = this.formatoMoneda(this.getTotalesxCliente(cli.Categorias,'PorcentajeImporte1'))          
          cli.TotalesClientexValorAgregado1 = this.formatoMoneda(this.getTotalesxCliente(cli.Categorias,'ValorAgregado1'))
          cli.TotalesClientexPorcentajeValorAgregado1 = this.formatoMoneda(this.getTotalesxCliente(cli.Categorias,'PorcentajeValorAgregado1'))
          cli.TotalesClientexPiezas2 = this.formatoNumero(this.getTotalesxCliente(cli.Categorias,'Piezas2'))
          cli.TotalesClientexGramos2 = this.formatoNumero(this.getTotalesxCliente(cli.Categorias,'Gramos2'))
          cli.TotalesClientexImporteVenta2 = this.formatoMoneda(this.getTotalesxCliente(cli.Categorias,'ImporteVenta2'))
          cli.TotalesClientexPorcentajeImporte2 = this.formatoMoneda(this.getTotalesxCliente(cli.Categorias,'PorcentajeImporte2'))
          cli.TotalesClientexValorAgregado2 = this.formatoMoneda(this.getTotalesxCliente(cli.Categorias,'ValorAgregado2'))       
          cli.TotalesClientexPorcentajeValorAgregado2 = this.formatoMoneda(this.getTotalesxCliente(cli.Categorias,'PorcentajeValorAgregado2'))       
          

        }

        this.oReporteVentasRes.Contenido.TotalGeneralxPiezas1 = this.formatoNumero(this.getTotalesGeneral(this.oClienteCont,'Piezas1'))
        this.oReporteVentasRes.Contenido.TotalGeneralxGramos1 = this.formatoNumero(this.getTotalesGeneral(this.oClienteCont,'Gramos1'))
        this.oReporteVentasRes.Contenido.TotalGeneralxImporteVenta1 = this.formatoMoneda(this.getTotalesGeneral(this.oClienteCont,'ImporteVenta1'))
        this.oReporteVentasRes.Contenido.TotalGeneralxValorAgregado1 = this.formatoMoneda(this.getTotalesGeneral(this.oClienteCont,'ValorAgregado1')) 
        this.oReporteVentasRes.Contenido.TotalGeneralxPiezas2 = this.formatoNumero(this.getTotalesGeneral(this.oClienteCont,'Piezas2')) 
        this.oReporteVentasRes.Contenido.TotalGeneralxGramos2 = this.formatoNumero(this.getTotalesGeneral(this.oClienteCont,'Gramos2')) 
        this.oReporteVentasRes.Contenido.TotalGeneralxImporteVenta2 = this.formatoMoneda(this.getTotalesGeneral(this.oClienteCont,'ImporteVenta2')) 
        this.oReporteVentasRes.Contenido.TotalGeneralxValorAgregado2 = this.formatoMoneda(this.getTotalesGeneral(this.oClienteCont,'ValorAgregado2')) 

       

        //Totales General
        for(var cliGen of this.oClienteGeneralCatCont){
            for(var totSubCat of cliGen.TotalGeneralSubcatego){

               //lineas
              totSubCat.TotalPiezas1Aux = this.formatoNumero(totSubCat.TotalPiezas1);
              totSubCat.TotalGramos1Aux = this.formatoNumero(totSubCat.TotalGramos1);
              totSubCat.TotalImporte1Aux = this.formatoMoneda(totSubCat.TotalImporte1);
              totSubCat.TotalPorcentajeImporte1Aux = this.formatoNumero(totSubCat.TotalPorcentajeImporte1);
              totSubCat.TotalValorAgregado1Aux = this.formatoMoneda(totSubCat.TotalValorAgregado1);
              totSubCat.TotalPorcentajeValorAgregado1Aux = this.formatoMoneda(totSubCat.TotalPorcentajeValorAgregado1);
                
              totSubCat.TotalPiezas2Aux = this.formatoNumero(totSubCat.TotalPiezas2);
              totSubCat.TotalGramos2Aux = this.formatoNumero(totSubCat.TotalGramos2);
              totSubCat.TotalImporte2Aux = this.formatoMoneda(totSubCat.TotalImporte2);
              totSubCat.TotalPorcentajeImporte2Aux = this.formatoNumero(totSubCat.TotalPorcentajeImporte2);
              totSubCat.TotalValorAgregado2Aux = this.formatoMoneda(totSubCat.TotalValorAgregado2);     
              totSubCat.TotalPorcentajeValorAgregado2Aux = this.formatoMoneda(totSubCat.TotalPorcentajeValorAgregado2);     

            }   
        }

        this.oReporteVentasRes.Contenido.TotalGeneralCategxPiezas1 = this.formatoNumero(this.getTotalesGeneralCateg(this.oClienteGeneralCatCont,'TotalPiezas1'));
        this.oReporteVentasRes.Contenido.TotalGeneralCategxGramos1 = this.formatoNumero(this.getTotalesGeneralCateg(this.oClienteGeneralCatCont,'TotalGramos1'));
        this.oReporteVentasRes.Contenido.TotalGeneralCategxImporteVenta1 = this.formatoMoneda(this.getTotalesGeneralCateg(this.oClienteGeneralCatCont,'TotalImporte1'));
        this.oReporteVentasRes.Contenido.TotalGeneralCategxValorAgregado1 = this.formatoMoneda(this.getTotalesGeneralCateg(this.oClienteGeneralCatCont,'TotalValorAgregado1')) ;
        this.oReporteVentasRes.Contenido.TotalGeneralCategxPiezas2 = this.formatoNumero(this.getTotalesGeneralCateg(this.oClienteGeneralCatCont,'TotalPiezas2')) ;
        this.oReporteVentasRes.Contenido.TotalGeneralCategxGramos2 = this.formatoNumero(this.getTotalesGeneralCateg(this.oClienteGeneralCatCont,'TotalGramos2')) ;
        this.oReporteVentasRes.Contenido.TotalGeneralCategxImporteVenta2 = this.formatoMoneda(this.getTotalesGeneralCateg(this.oClienteGeneralCatCont,'TotalImporte2')) ;
        this.oReporteVentasRes.Contenido.TotalGeneralCategxValorAgregado2 = this.formatoMoneda(this.getTotalesGeneralCateg(this.oClienteGeneralCatCont,'TotalValorAgregado2')) ;

        this.isCollapsed = true;


      


        $("#firstTable").DataTable().destroy();
        this.dtTrigger1.next("");
        $("#secondTable").DataTable().destroy();
            this.dtTrigger2.next("");
        $("#thirdTable").DataTable().destroy();
        this.dtTrigger3.next("");
 
       },
       (error:ReporteVentas) => {
 
         this.oReporteVentasRes = error;
 
         console.log("error");
         console.log(this.oReporteVentasRes);
         this.sMensaje="No se encontraron datos en reporte de ventas";
         this.bCargando = false;
         this.bBandera = false;
       
       }
     );
  }

  // #### Obten totales por Cliente ####
  getTotalesxCliente(oCliCategoriasCon: CliCategoriasCon[], sValor: string): number {   
  let Total: number = 0;

  switch(sValor) {        
    case 'Piezas1': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.Piezas1;  
           }
      }
      break; 
    }
    case 'Gramos1': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.Gramos1;  
           }
      }
      break; 
    }
    case 'ImporteVenta1': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.ImporteVenta1;  
           }
      }
      break; 
    }
    case 'PorcentajeImporte1': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.PorcentajeImporte1;  
           }
      }
      break; 
    }
    case 'ValorAgregado1': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.ValorAgregado1;  
           }
      }
      break; 
    }
    case 'PorcentajeValorAgregado1': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.PorcentajeValorAgregado1;  
           }
      }
      break; 
    }
    case 'Piezas2': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.Piezas2;  
           }
      }
      break; 
    }
    case 'Gramos2': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.Gramos2;  
           }
      }
      break; 
    }
    case 'ImporteVenta2': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.ImporteVenta2;  
           }
      }
      break; 
    }
    case 'PorcentajeImporte2': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.PorcentajeImporte2;  
           }
      }
      break; 
    }
    case 'ValorAgregado2': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.ValorAgregado2;  
           }
      }
      break; 
    } 
    case 'PorcentajeValorAgregado2': { 
 
      for(var oCat of oCliCategoriasCon){ 
        for(var oSubCat of oCat.Subcategorias){  
              Total += oSubCat.PorcentajeValorAgregado2;  
           }
      }
      break; 
    } 
 
 }    

    Total = Number(Total.toFixed(2));
    return Total; 
  }
  // #### Obten totales por Cliente ####

  
  // #### Obten totales general categoria ####
  getTotalesGeneralCateg(oTotGenCat: TotalGeneralCategorias[], sValor: string): number {   
    let Total: number = 0;
  
    switch(sValor) {        
      case 'TotalPiezas1': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalPiezas1;  
             }
        }
        break; 
      }
      case 'TotalGramos1': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalGramos1;  
             }
        }
        break; 
      }
      case 'TotalImporte1': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalImporte1;  
             }
        }
        break; 
      }
      case 'TotalPorcentajeImporte1': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalPorcentajeImporte1;  
             }
        }
        break; 
      }
      case 'TotalValorAgregado1': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalValorAgregado1;  
             }
        }
        break; 
      }
      case 'TotalPorcentajeValorAgregado1': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalPorcentajeValorAgregado1;  
             }
        }
        break; 
      }
      case 'TotalPiezas2': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalPiezas2;  
             }
        }
        break; 
      }
      case 'TotalGramos2': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalGramos2;  
             }
        }
        break; 
      }
      case 'TotalImporte2': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalImporte2;  
             }
        }
        break; 
      }
      case 'TotalPorcentajeImporte2': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalPorcentajeImporte2;  
             }
        }
        break; 
      }
      case 'TotalValorAgregado2': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalValorAgregado2;  
             }
        }
        break; 
      } 
      case 'TotalPorcentajeValorAgregado2': { 
   
        for(var oCat of oTotGenCat){ 
          for(var oSubCat of oCat.TotalGeneralSubcatego){  
                Total += oSubCat.TotalPorcentajeValorAgregado2;  
             }
        }
        break; 
      } 
   
   }    
  

    Total = Number(Total.toFixed(2));
    return Total; 
    }
  // #### Obten totales general categoria ####

  // #### Obten totales por Cliente ####
   getTotalesGeneral(oClientes: Cliente[], sValor: string): number {   
    let Total: number = 0;
  
    switch(sValor) {        
      case 'Piezas1': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.Piezas1;  
              }
          }
        }
        break; 
      }
      case 'Gramos1': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.Gramos1;  
              }
          }
        }
        break; 
      }
      case 'ImporteVenta1': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.ImporteVenta1;  
              }
          }
        }
        break; 
      }
      case 'PorcentajeImporte1': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.PorcentajeImporte1;  
              }
          }
        }
        break; 
      }
      case 'ValorAgregado1': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.ValorAgregado1;  
              }
          }
        }
        break; 
      }
      case 'PorcentajeValorAgregado1': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.PorcentajeValorAgregado1;  
              }
          }
        }
        break; 
      }
      case 'Piezas2': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.Piezas2;  
              }
          }
        }
        break; 
      }
      case 'Gramos2': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.Gramos2;  
              }
          }
        }
        break; 
      }
      case 'ImporteVenta2': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.ImporteVenta2;  
              }
          }
        }
        break; 
      }
      case 'PorcentajeImporte2': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.PorcentajeImporte2;  
              }
          }
        }
        break; 
      }
      case 'ValorAgregado2': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.ValorAgregado2;  
              }
          }
        }
        break; 
      } 
      case 'PorcentajeValorAgregado2': { 
   
        for(var oCli of oClientes){ 
          for(var oCat of oCli.Categorias){ 
            for(var oSubCat of oCat.Subcategorias){  
                  Total += oSubCat.PorcentajeValorAgregado2;  
              }
          }
        }
        break; 
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

  cadenaaux = this.TablaReporteVentas(this.oBuscar.DesglosaCategoria, this.oBuscar.DesglosaCliente);

  let cadena =
  '<br><p>Desde Cliente: <strong>' +this.oBuscar.ClienteDesde +' - '+this.oBuscar.FilialDesde+' - '+ this.obtenNombreCliente(this.oBuscar.ClienteDesde)+'<br></strong> Hasta cliente: <strong>' +this.oBuscar.ClienteHasta +' - '+this.oBuscar.FilialHasta+' - '+this.obtenNombreCliente(this.oBuscar.ClienteHasta)+'</strong></p>' +      
  cadenaaux;


  var html = htmlToPdfmake(cadena);
  var pagewidth;
  console.log(html);
  if (this.oBuscar.DesglosaCategoria == 'S' && this.oBuscar.DesglosaCliente == 'S'){
    html[2].table.headerRows= 3;
    pagewidth = 1000;

  }else{
    html[2].table.headerRows= 3;
    pagewidth = 1200;

  }  
  
  
  const documentDefinition = { 
    pageOrientation: 'landscape',  
    
    pageSize: {
      width: pagewidth,
      height: 820
    },
    header: [
      {
        alignment: 'justify',
        heigth: 200,
        columns: [
          { 
            image: 'logo', 
            margin: [25,13],
            heigth: 40, 
            width: 180 
          },
          {
            width: 650,
            text: 'Reporte de ventas',
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

  formatoNumero(number){
    return new Intl.NumberFormat('en-US', {currency: 'USD', maximumFractionDigits: 2}).format(number);
  };





    //Modal clientes
    openClientes(Clientes: any, cliente: boolean) {
      console.log("Entra modal clientes");
      this.bCargandoClientes = true;
      this.bBanderaCliente = cliente;
      var result;
  
      try{
        //result = this.BuscaClientes()
        result = true;
  
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
  
        this.bCargandoClientes = false;
  
  
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
    console.log(sCategoria, bCategoria); // Aquí iría tu lógica al momento de seleccionar algo  

    if (bCategoria){//Es categoria desde
      this.oSubCatDesde = this.oCategoriasCon.filter(x => x.CategoriaCodigo == sCategoria && x.Subcategoria !='');
    }else{//Es categoria hasta
      this.oSubCatHasta = this.oCategoriasCon.filter(x => x.CategoriaCodigo == sCategoria && x.Subcategoria !='');
    }      
    console.log("Resultado del segundo = "+JSON.stringify(bCategoria ? this.oSubCatDesde : this.oSubCatHasta));
  }

  obtenNombreCliente(cliente: number): string {   
    let nombre: string = '';  
  
      for(var cliCon of this.oCliente.Contenido){ 
        if (cliCon.ClienteCodigo == String(cliente)){

          if (cliCon.ClienteFilial != '0'){
            nombre = "Cliente "+cliente+' - '+cliCon.ClienteFilial+' '+ cliCon.RazonSocial;
          }else{
            nombre = "Cliente "+cliente+' '+ cliCon.RazonSocial;
          }

          
          break
        }

              
         
    }
   
    return nombre; 
  }
  
  TablaReporteVentas(oDesgloceCategoria,oDesgloceCliente): string
  {

    var tabla = "";

    //DESGLOCE CATEGORIA SI CLIENTE SI
    if(oDesgloceCategoria == 'S' && oDesgloceCliente == 'S'){

      tabla =  '<table class="table table-hover table-striped" datatable [dtOptions]="dtOptions">'+'\n'+
        ' <thead>'+'\n'+
          ' <tr class="EncTabla"> '+'\n'+                
              ' <th class="table-success" scope="col"></th>'+'\n'+
              ' <th class="table-success" scope="col"></th>'+'\n'+
              ' <th class="table-warning" scope="col" colspan="6"  style="text-align:center;"> 1er Periodo</th>  '+'\n'+
              ' <th class="table-info" scope="col" colspan="6"  style="text-align:center;">2do Periodo</th>'+'\n'+
          ' </tr>'+'\n'+
          ' <tr class="EncTabla">'+'\n'+
            ' <th class="table-success" scope="col"></th>'+'\n'+
            ' <th class="table-success" scope="col"></th>'+'\n'+
            ' <th class="table-warning" scope="col" colspan="3"  style="text-align:center;"> desde '+this.oBuscar.Fecha1Desde+'</th>  '+'\n'+
            ' <th class="table-warning" scope="col" colspan="3"  style="text-align:center;">hasta '+this.oBuscar.Fecha1Hasta+' </th>'+'\n'+
            ' <th class="table-info" scope="col" colspan="3" style="text-align:center;"> desde '+this.oBuscar.Fecha2Desde+'</th>  '+'\n'+
            ' <th class="table-info" scope="col" colspan="3"  style="text-align:center;">hasta '+this.oBuscar.Fecha2Hasta+' </th>'+'\n'+
          '</tr>'+'\n'+
          '<tr   class="EncTabla">'+'\n'+
            ' <th style="background-color: #24a4cc; color: white;">NUM FIL</th>'+'\n'+
            ' <th colspan="4" style="background-color: #24a4cc; color: white; ">RAZON SOCIAL</th>'+'\n'+            
            ' <th style="background-color: #24a4cc; color: white;">S</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; text-align: center;">TL1</th>'+'\n'+
            ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white; text-align: center;">TL2</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; text-align: center;">TP</th>'+'\n'+
            ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white; text-align: center;">TC</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; text-align: center;">AG</th>    '+'\n'+            
            ' <th colspan="3"  style="background-color: #24a4cc;"></th>    '+'\n'+            
          '</tr> '+'\n'+                         
        '</thead>'+'\n'+
        '<tbody>'+'\n';

        this.oClienteCont.forEach(function(cli){
          tabla = tabla +   ' <tr  class="EncTabla">'+'\n'+
            ' <td class="FilasFonelli" colspan="5">'+cli.ClienteCodigo + ' ' + cli.ClienteFilial +' '+ cli.ClienteNombre +'</td>'+'\n'+
            ' <td class="FilasFonelli">'+cli.ClienteStatus+'</td>'+'\n'+
            ' <td class="FilasFonelli" style="text-align: center;">'+cli.Lista1+'</td>'+'\n'+
            ' <td class="FilasFonelli" style="text-align: center;">'+cli.Lista2+'</td>'+'\n'+
            ' <td class="FilasFonelli" style="text-align: center;">'+cli.TipoParidad+'</td>'+'\n'+
            ' <td class="FilasFonelli" style="text-align: center;">'+cli.TipoCliente+'</td>'+'\n'+
            ' <td class="FilasFonelli" style="text-align: center;">'+cli.AgenteCodigo+'</td>'+'\n'+
            ' <td colspan="3"></td>'+'\n'+            
          ' </tr>'+'\n'+


          ' <tr class="EncTabla"> '+'\n'+                
            ' <th style="background-color: #24a4cc; color: white;">Cat</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white;">Descripcion categoria</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white;">Piezas</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; ">Gramos</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; text-align: right;">Importe</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; ">%S/Tot</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; text-align: right;">Val Agreg</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; ">%S/Tot</th>              '+'\n'+
            ' <th style="background-color: #24a4cc; color: white;">Piezas</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white;;">Gramos</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; text-align: right;">Importe</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white;">%S/Tot</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; text-align: right;">Val Agreg</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white;">%S/Tot</th>     '+'\n'+
          ' </tr> '+'\n';


          cli.Categorias.forEach(function(cat){          

            cat.Subcategorias.forEach(function(subCat){
          
                tabla = tabla +   '<tr >'+'\n'+
                  ' <td class="FilasFonelli">'+cat.CategoriaCodigo + '' +subCat.SubcategoriaCodigo+'</td>'+'\n'+
                  ' <td class="FilasFonelli">'+cat.CategoriaNombre+ ' - ' +subCat.SubcategoriaNombre+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.Piezas1Aux+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.Gramos1Aux+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.ImporteVenta1Aux+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.PorcentajeImporte1Aux+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.ValorAgregado1Aux+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.PorcentajeValorAgregado1+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.Piezas2+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.Gramos2Aux+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.ImporteVenta2Aux+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.PorcentajeImporte2Aux+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.ValorAgregado2Aux+'</td>'+'\n'+
                  ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.PorcentajeValorAgregado2+'</td>'+'\n'+
                ' </tr>'+'\n';            
            });            
          });

          tabla = tabla +   '<tr >'+'\n'+  
            ' <td class="FilasFonelli"></td>'+'\n'+  
            ' <td class="FilasFonBold">Total cliente</td>'+'\n'+  
            ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexPiezas1+'</td>'+'\n'+  
            ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexGramos1+'</td>'+'\n'+  
            ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexImporteVenta1+'</td>'+'\n'+  
            ' <td class="FilasFonBold table-warning" style="text-align: right;"></td>'+'\n'+  
            ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexValorAgregado1+'</td>'+'\n'+  
            ' <td class="FilasFonBold table-warning" style="text-align: right;"></td>'+'\n'+  
            ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexPiezas2+'</td>'+'\n'+  
            ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexGramos2+'</td>'+'\n'+  
            ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexImporteVenta2+'</td>'+'\n'+  
            ' <td class="FilasFonBold table-info" style="text-align: right;"></td>'+'\n'+  
            ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexValorAgregado2+'</td>'+'\n'+  
            ' <td class="FilasFonBold table-info" style="text-align: right;"></td>                   '+'\n'+  
          ' </tr> '+'\n'; 
        });
        
      tabla = tabla +  
      '</tbody>'+'\n'+
      '</table>'+'\n';
    }

    //DESGLOCE CATEGORIA NO CLIENTE SI
    if(oDesgloceCategoria == 'N' && oDesgloceCliente == 'S'){

      tabla =' <table class="table table-hover table-striped" datatable [dtOptions]="dtOptions">'+'\n'+
              ' <thead>'+'\n'+
                ' <tr class="EncTabla">'+'\n'+
                  ' <th colspan="9" class="table-success" ></th>'+'\n'+                  
                  ' <th class="table-warning" scope="col" colspan="6" style="text-align:center;"> 1er Periodo</th>  '+'\n'+
                  ' <th class="table-info" scope="col" colspan="6" style="text-align:center;">2do Periodo</th>'+'\n'+
                ' </tr>'+'\n'+

                ' <tr class="EncTabla"> '+'\n'+                
                  ' <th colspan="9" class="table-success" scope="col"></th>'+'\n'+                  
                  ' <th class="table-warning" scope="col" colspan="3" style="text-align:center;"> desde '+this.oBuscar.Fecha1Desde+'</th>  '+'\n'+
                  ' <th class="table-warning" scope="col" colspan="3" style="text-align:center;">hasta '+this.oBuscar.Fecha1Hasta+' </th>'+'\n'+
                  ' <th class="table-info" scope="col" colspan="3" style="text-align:center;"> desde '+this.oBuscar.Fecha2Desde+'</th>  '+'\n'+
                  ' <th class="table-info" scope="col" colspan="3" style="text-align:center;">hasta '+this.oBuscar.Fecha2Hasta+' </th>'+'\n'+
                ' </tr>'+'\n'+
                
                ' <tr class="EncTabla">'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">Numero</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">Fil</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">RAZON SOCIAL</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">S</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align: right;">TL1</th>'+'\n'+
                  ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white;">TL2</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">TP</th>'+'\n'+
                  ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white;">TC</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align: right;">AG</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">Piezas</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; ">Gramos</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align: right;">Importe</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; ">%S/Tot</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align: right;">Val Agreg</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; ">%S/Tot</th>              '+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">Piezas</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;;">Gramos</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align: right;">Importe</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">%S/Tot</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align: right;">Val Agreg</th>'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">%S/Tot</th>     '+'\n'+
                ' </tr> '+'\n'+                
              ' </thead>'+'\n'+
              ' <tbody>'+'\n';

              this.oClienteCont.forEach(function(cli){

                tabla = tabla +    '<tr>  '+'\n'+
                  ' <td class="FilasFonelli">'+cli.ClienteCodigo+'</td>'+'\n'+
                  ' <td class="FilasFonelli">'+cli.ClienteFilial+'</td>'+'\n'+
                  ' <td class="FilasFonelli">'+cli.ClienteNombre+'</td>'+'\n'+
                  ' <td class="FilasFonelli">'+cli.ClienteStatus+'</td>'+'\n'+
                  ' <td class="FilasFonelli">'+cli.Lista1+'</td>'+'\n'+
                  ' <td class="FilasFonelli">'+cli.Lista2+'</td>'+'\n'+
                  ' <td class="FilasFonelli">'+cli.TipoParidad+'</td>'+'\n'+
                  ' <td class="FilasFonelli">'+cli.TipoCliente+'</td>'+'\n'+
                  ' <td class="FilasFonelli">'+cli.AgenteCodigo+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexPiezas1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexGramos1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexImporteVenta1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexPorcentajeImporte1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexValorAgregado1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+cli.TotalesClientexPorcentajeValorAgregado1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexPiezas2+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexGramos2+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexImporteVenta2+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexPorcentajeImporte2+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexValorAgregado2+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+cli.TotalesClientexPorcentajeValorAgregado2+'</td>'+'\n'+                  
                ' </tr>'+'\n' ;
              });

              tabla = tabla + ' <tr>'+'\n'+  
                  ' <td class="FilasFonelli"></td>'+'\n'+
                  ' <td class="FilasFonBold"></td>'+'\n'+
                  ' <td class="FilasFonBold"></td>'+'\n'+
                  ' <td class="FilasFonBold"></td>'+'\n'+
                  ' <td class="FilasFonBold"></td>'+'\n'+
                  ' <td class="FilasFonBold"></td>'+'\n'+
                  ' <td class="FilasFonBold"></td>'+'\n'+
                  ' <td class="FilasFonBold"></td>'+'\n'+
                  ' <td class="FilasFonBold"></td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralxPiezas1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralxGramos1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralxImporteVenta1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;"></td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralxValorAgregado1+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-warning" style="text-align: right;"></td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralxPiezas2+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralxGramos2+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralxImporteVenta2+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;"></td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralxValorAgregado2+'</td>'+'\n'+
                  ' <td class="FilasFonBold table-info" style="text-align: right;"></td>'+'\n'+
                ' </tr>'+'\n'+
              ' </tbody>'+'\n'+
              ' </table>'+'\n';
    }

    //CLIENTES CON VENTA

    
    tabla = tabla + '<br>'+'\n'+
    '<br>'+'\n'+
    '<h2 class="card-title" style="color: #24a4cc;">Clientes con venta</h2> '+'\n';

    tabla = tabla + 
    ' <table class="table table-md">'+'\n'+
      ' <thead>'+'\n'+
        ' <tr class="EncTabla">'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;"></th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;">1er Periodo</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;">2do Periodo</th>'+'\n'+
        ' </tr>'+'\n'+
      ' </thead>'+'\n'+
      ' <tbody> '+'\n'+
      ' <tr>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">Cliente con venta</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">'+this.oClienteConVentaCont.ClientesConVenta1+'</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">'+this.oClienteConVentaCont.ClientesConVenta2+'</td>                  '+'\n'+
      ' </tr>'+'\n'+
      ' <tr>  '+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">Cliente sin venta</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">'+this.oClienteConVentaCont.ClientesSinVenta1+'</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">'+this.oClienteConVentaCont.ClientesSinVenta2+'</td>                  '+'\n'+
      ' </tr>'+'\n'+
      ' <tr>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">Cliente totales</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">'+this.oClienteConVentaCont.ClientesTotales1+'</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align: right;">'+this.oClienteConVentaCont.ClientesTotales2+'</td>                  '+'\n'+
      ' </tr>'+'\n'+
      ' </tbody>'+'\n'+
    ' </table>'+'\n';

     //TOTAL GENERAL

     tabla = tabla + '<br>'+'\n'+
    '<br>'+'\n'+
    '<h2 class="card-title"  style="color: #24a4cc;">Total General</h2> '+'\n';

     tabla = tabla +
     '<table class="table table-hover table-striped "'+'\n'+
     ' <thead>'+'\n'+
       ' <tr class="EncTabla">'+'\n'+
         ' <th colspan="2" class="table-success" scope="col"></th>'+'\n'+         
         ' <th class="table-warning" scope="col" colspan="6" style="text-align:center;"> 1er Periodo</th>  '+'\n'+
         ' <th class="table-info" scope="col" colspan="6" style="text-align:center;">2do Periodo</th>'+'\n'+
       ' </tr>'+'\n'+
       ' <tr class="EncTabla">'+'\n'+
         ' <th colspan="2" class="table-success" scope="col"></th>'+'\n'+         
         ' <th class="table-warning" scope="col" colspan="3" style="text-align:center;"> desde '+this.oBuscar.Fecha1Desde+'</th>  '+'\n'+
         ' <th class="table-warning" scope="col" colspan="3" style="text-align:center;">hasta '+this.oBuscar.Fecha1Hasta+' </th>'+'\n'+
         ' <th class="table-info" scope="col" colspan="3" style="text-align:center;"> desde '+this.oBuscar.Fecha2Desde+'</th>  '+'\n'+
         ' <th class="table-info" scope="col" colspan="3" style="text-align:center;">hasta '+this.oBuscar.Fecha2Hasta+' </th>'+'\n'+
       ' </tr>'+'\n'+
       ' <tr class="EncTabla">'+'\n'+
         ' <th style="background-color: #24a4cc; color: white;">Cat</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white;">Descripcion categoria</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white;">Piezas</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white; ">Gramos</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white; text-align: right;">Importe</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white; text-align: center;">%S/Tot</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white; text-align: right;">Val Agreg</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white; text-align: center;">%S/Tot</th>              '+'\n'+
         ' <th style="background-color: #24a4cc; color: white;">Piezas</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white;;">Gramos</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white; text-align: right;">Importe</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white; text-align: center;">%S/Tot</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white; text-align: right;">Val Agreg</th>'+'\n'+
         ' <th style="background-color: #24a4cc; color: white; text-align: center;">%S/Tot</th>     '+'\n'+
       ' </tr>'+'\n'+
     ' </thead>'+'\n'+
     ' <tbody>'+'\n';

    this.oClienteGeneralCatCont.forEach(function(cat){

      cat.TotalGeneralSubcatego.forEach(function(subCat){
        tabla = tabla +
        ' <tr> '+'\n'+
          ' <td class="FilasFonelli">'+cat.CategoriaCodigo + '' +subCat.SubcategoriaCodigo+'</td>'+'\n'+
          ' <td class="FilasFonelli">'+cat.CategoriaNombre+ ' - ' +subCat.SubcategoriaNombre+'</td>'+'\n'+
          ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.TotalPiezas1Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.TotalGramos1Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.TotalImporte1Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.TotalPorcentajeImporte1Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.TotalValorAgregado1Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-warning" style="text-align: right;">'+subCat.TotalPorcentajeValorAgregado1Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.TotalPiezas2Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.TotalGramos2Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.TotalImporte2Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.TotalPorcentajeImporte2Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.TotalValorAgregado2Aux+'</td>'+'\n'+
          ' <td class="FilasFonelli table-info" style="text-align: right;">'+subCat.TotalPorcentajeValorAgregado2Aux+'</td>'+'\n'+
        ' </tr>'+'\n';
      });

    });

    ' <tr> '+'\n'+ 
      ' <td class="FilasFonelli"></td>'+'\n'+
      ' <td class="FilasFonBold"></td>'+'\n'+
      ' <td class="FilasFonBold table-warning" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralCategxPiezas1+'</td>'+'\n'+
      ' <td class="FilasFonBold table-warning" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralCategxGramos1+'</td>'+'\n'+
      ' <td class="FilasFonBold table-warning" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralCategxImporteVenta1+'</td>'+'\n'+
      ' <td class="FilasFonBold table-warning" style="text-align: right;"></td>'+'\n'+
      ' <td class="FilasFonBold table-warning" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralCategxValorAgregado1+'</td>'+'\n'+
      ' <td class="FilasFonBold table-warning" style="text-align: right;"></td>'+'\n'+
      ' <td class="FilasFonBold table-info" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralCategxPiezas2+'</td>'+'\n'+
      ' <td class="FilasFonBold table-info" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralCategxGramos2+'</td>'+'\n'+
      ' <td class="FilasFonBold table-info" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralCategxImporteVenta2+'</td>'+'\n'+
      ' <td class="FilasFonBold table-info" style="text-align: right;"></td>'+'\n'+
      ' <td class="FilasFonBold table-info" style="text-align: right;">'+this.oReporteVentasRes.Contenido.TotalGeneralCategxValorAgregado2+'</td>'+'\n'+
      ' <td class="FilasFonBold table-info" style="text-align: right;"></td>      '+'\n'+
    ' </tr>'+'\n'+
' </tbody>'+'\n'+               
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
    this.dtTrigger3.unsubscribe();
  }

  ngAfterViewInit(): void {
    //this.dtTrigger1.next("");
    //this.dtTrigger2.next("");
  }

}

