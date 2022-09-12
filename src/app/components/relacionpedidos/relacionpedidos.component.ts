import { Component, OnInit,OnDestroy,ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs';

//Modelos
import {FiltrosRelacionPedidos} from 'src/app/models/relacionpedidos.filtros';
import {RelacionPedidos, Pedido, TipoPedido, Contenido as ContenidoGen} from 'src/app/models/relacionpedidos';
import {FiltrosOficina} from 'src/app/models/oficina.filtros';
import {Oficina} from 'src/app/models/oficina';
import {FiltrosDetallePedidos} from 'src/app/models/detallepedido.filtros';
import {DetallePedido, PedidoArticulo} from 'src/app/models/detallepedido';
import {FiltrosClientes} from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';

//Servicios
import { ServicioRelacionPedido } from 'src/app/services/relacionpedidos.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { ServicioDetallePedido } from 'src/app/services/detallepedido.service';
import { ServicioClientes } from 'src/app/services/clientes.service';


@Component({
  selector: 'app-relacionpedidos',
  templateUrl: './relacionpedidos.component.html',
  styleUrls: ['./relacionpedidos.component.css'],
  providers:[ServicioRelacionPedido,ServicioOficinas,ServicioDetallePedido, DecimalPipe, ServicioClientes]
})
export class RelacionpedidosComponent implements OnInit,OnDestroy {

  @ViewChild('pdfTable') pdfTable: ElementRef;
  
  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;
  searchtext = '';

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  public oBuscar: FiltrosRelacionPedidos;
  oRelacionPedRes: RelacionPedidos; 
  public oBuscarOfi: FiltrosOficina;
  oOficinasRes: Oficina; 
  public oBuscaDetalle: FiltrosDetallePedidos;
  oPedidoDetalleRes: DetallePedido; 
  //oContenido: ContenidoRelPed; 

  public isCollapsed = false;

  pedidoDet: PedidoArticulo[];

  public bError: boolean=false;
  public sMensaje: string="";
  public sMensajeModal: string="";
  public bCliente: boolean;
  bBandera: boolean;
  bBanderaDet = false;


  fechaHoy: String
  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  closeResult = '';
  public ModalActivo?: NgbModalRef;

  mobileQuery: MediaQueryList;

  public Buscar: FiltrosClientes;
  public oCliente: Clientes; 
  public oContenido : Contenido;
  public oCondiciones : Condiciones;
  public oDatosGenerales : DatosGenerales;
  public oContacto : Contactos;

  public sClienteDesdeCod: string;
  public sClienteDesdeFil: string;
  public sClienteDesdeNom: string;
  
  public sClienteHastaCod: string;
  public sClienteHastaFil: string;
  public sClienteHastaNom: string;

  public bBanderaCliente: boolean;

   private _mobileQueryListener: () => void;

  
  sWidth: number;
  sHeight: number;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioRelacionPed: ServicioRelacionPedido,
    private _servicioOficinas:ServicioOficinas,
    private _servicioCPedidosDet: ServicioDetallePedido,
    private modalService: NgbModal,
    private _servicioCClientes: ServicioClientes) { 

      this.sCodigo = Number(localStorage.getItem('codigo'));
      this.sTipo = localStorage.getItem('tipo');
      this.sFilial  = Number(localStorage.getItem('filial'));
      this.sNombre = localStorage.getItem('nombre');

    //Inicializamos variables consulta pedidos
    this.oBuscar = new FiltrosRelacionPedidos('',0,'','',0,0,0,0,'','','','','','','','',0)
    this.oRelacionPedRes={} as RelacionPedidos;  
    this.oBuscarOfi =  new FiltrosOficina('',0)
    this.oOficinasRes = {} as Oficina;
    //this.oContenido = {} as ContenidoRelPed;

     //Inicializamos variables consulta detalle pedidos
     this.oBuscaDetalle = new FiltrosDetallePedidos('',0,'',0,0,0);
     this.oPedidoDetalleRes={} as DetallePedido;  
     this.pedidoDet = [];

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.bCliente = false;
    this.bBandera = false;

    this.Buscar = new FiltrosClientes(0, 0, 0,'', 0);
    this.oCliente={} as Clientes;
    this.oContenido ={} as Contenido;
    this.oCondiciones ={} as Condiciones;
    this.oDatosGenerales ={} as DatosGenerales;
    this.oContacto ={} as Contactos;
}

    

    ngOnInit(): void {  
  
      console.log("La resolución de tu pantalla es: " + screen.width + " x " + screen.height);

      this.sWidth = screen.width;
      this.sHeight = (screen.height/2);

      this.dtOptions = {
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
            text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
            title: 'Relacion de Pedidos',
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
      let dia;
      
      //Valida mes 
      if (date.getMonth().toString().length == 1){
        mes = '0'+(date.getMonth()+1);
      }
       //Valida dia 
       if (date.getDate().toString().length == 1){
        dia = '0'+(date.getDate());
      }

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

      console.log("--"+fechaActual);
      console.log("--"+fechaAyer);

      switch(this.sTipo) { 
        case 'C':{    
          //Tipo cliente               

           this.oBuscar.ClienteDesde = this.sCodigo; 
           this.oBuscar.FilialHasta = this.sFilial;   
           this.oBuscar.ClienteHasta = this.sCodigo; 
           this.oBuscar.FilialHasta = this.sFilial; 
         
           this.bCliente = true;    

           break; 
        } 
        case 'A': { 
           //Agente; 
           this.bCliente = false;  
           this.oBuscar.ClienteHasta = 999999;
           this.oBuscar.FilialHasta = 999;
           this.oBuscar.Usuario = this.sCodigo;
           break; 
        } 
        default: { 
           //Gerente; 
           this.oBuscar.ClienteHasta = 999999;
           this.oBuscar.FilialHasta = 999;
           this.oBuscar.Usuario = this.sCodigo;
           this.bCliente = false;  
           break; 
        } 
     } 

    this.oBuscar.Status = 'A';
    this.oBuscar.TipoPedido = 'T';
    this.oBuscar.TipoOrigen = 'T';
    this.oBuscar.SoloAtrasados = 'T';
    this.oBuscar.FechaPedidoDesde = '2000-01-01';
    this.oBuscar.FechaPedidoHasta = fechaAyer;
    this.oBuscar.FechaCancelacDesde = '2000-01-01';
    this.oBuscar.FechaCancelacHasta = fechaActual;
    this.oBuscar.TipoUsuario = this.sTipo;

    this.Buscar.TipoUsuario = this.sTipo;
    this.Buscar.Usuario = this.sCodigo;

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
      //console.log("Ya tenemos oficina");

      this.oOficinasRes = JSON.parse(localStorage.getItem('Oficinas'));

      this.oBuscar.OficinaDesde = this.oOficinasRes.Contenido[0].OficinaCodigo; 
      this.oBuscar.OficinaHasta = this.oOficinasRes.Contenido[this.oOficinasRes.Contenido?.length - 1].OficinaCodigo; 

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

    }





//Funcion para consultar la relacion de pedidos
consultaRelPed(){

  //this.oBuscar.TipoUsuario = this.sTipo? this.sTipo : 'C';
  console.log(this.oBuscar);
  this.bCargando = true;

    //Realizamos llamada al servicio de relacion de pedidos
    this._servicioRelacionPed    
    

    .Get(this.oBuscar)
    .subscribe(
      (Response: RelacionPedidos) => {

        this.oRelacionPedRes = Response;        //this.pedido = this.oRelacionPedRes.Contenido.Pedidos
               

        //console.log( this.collectionSize);
        console.log("RESULTADO LLAMADA  "+JSON.stringify(this.oRelacionPedRes) );
        //console.log(this.pedido);

        if(this.oRelacionPedRes.Codigo != 0){
          this.bError= true;
          this.sMensaje="No se encontraron datos relación de pedidos";
          this.bCargando = false;
          this.bBandera = false;
          return;
        }

        for(var ContRelPed of this.oRelacionPedRes.Contenido){
          for(var tiPe of ContRelPed.TipoPedido){
            for(var pedido of tiPe.Pedidos){
        
              pedido.CantidadPedidaAux = this.reemplaza(this.formatoMoneda(pedido.CantidadPedida),'$');
              pedido.CantidadPedidaImporteAux = this.formatoMoneda(pedido.CantidadPedidaImporte);
              pedido.CantidadPedidaValorAgregadoAux = this.formatoMoneda(pedido.CantidadPedidaValorAgregado);
              pedido.CantidadSurtidaAux = this.reemplaza(this.formatoMoneda(pedido.CantidadSurtida),'$');
              pedido.CantidadSurtidaImporteAux = this.formatoMoneda(pedido.CantidadSurtidaImporte);
              pedido.CantidadSurtidaValorAgregadoAux = this.formatoMoneda(pedido.CantidadSurtidaValorAgregado);
              pedido.DiferenciaCantidadSurtidoAux = this.reemplaza(this.formatoMoneda(pedido.DiferenciaCantidadSurtido),'$');
              pedido.DiferenciaImporteSurtidoAux = this.formatoMoneda(pedido.DiferenciaImporteSurtido);
              pedido.DiferenciaValorAgregadoAux = this.formatoMoneda(pedido.DiferenciaValorAgregado);
              
            }            
            
            tiPe.TotalPedidos = this.getTotalPedidos(tiPe.Pedidos)
            tiPe.TotalCanPed = this.reemplaza(this.formatoMoneda(this.getTotalCanPed(tiPe.Pedidos)),'$')
            tiPe.TotlImportes = this.formatoMoneda(this.getTotalImportes(tiPe.Pedidos))
            tiPe.TotalCPValorAgregado = this.formatoMoneda(this.getTotalCPValorAgregado(tiPe.Pedidos))
            tiPe.TotalCanSurtida = this.reemplaza(this.formatoMoneda(this.getTotalCanSurtida(tiPe.Pedidos)),'$')
            tiPe.TotalCanSurtidaImporte = this.formatoMoneda(this.getTotalCanSurtidaImporte(tiPe.Pedidos))
            tiPe.TotalCSValorImporte = this.formatoMoneda(this.getTotalCSValorImporte(tiPe.Pedidos))
            tiPe.TotalDifCantidadSurt = this.reemplaza(this.formatoMoneda(this.getTotalDifCantidadSurt(tiPe.Pedidos)),'$')
            tiPe.TotalDifImporteSurtido = this.formatoMoneda(this.getTotalDifImporteSurtido(tiPe.Pedidos))
            tiPe.TotalDifValorAgregado = this.formatoMoneda(this.getTotalDifValorAgregado(tiPe.Pedidos))
            tiPe.TotalCantPedidaProd = this.getTotalCantPedidaProd(tiPe.Pedidos)
            tiPe.TotalCantidadProd = this.getTotalCantidadProd(tiPe.Pedidos)
            tiPe.TotalDifCantidadProd = this.getTotalDifCantidadProd(tiPe.Pedidos)   
          }
          
          
          ContRelPed.TotalPedidosOficina = this.getTotalPedidosOficina(ContRelPed.TipoPedido)   
          ContRelPed.TotalCanPedOficina = this.reemplaza(this.formatoMoneda(this.getTotalCanPedOficina(ContRelPed.TipoPedido)),'$')   
          ContRelPed.TotalImportesOficina = this.formatoMoneda(this.getTotalImportesOficina(ContRelPed.TipoPedido))
          ContRelPed.TotalCPValorAgregadoOficina = this.formatoMoneda(this.getTotalCPValorAgregadoOficina(ContRelPed.TipoPedido))   
          ContRelPed.TotalCanSurtidaOficina = this.reemplaza(this.formatoMoneda(this.getTotalCanSurtidaOficina(ContRelPed.TipoPedido)),'$')      
          ContRelPed.TotalCanSurtidaImporteOficina = this.formatoMoneda(this.getTotalCanSurtidaImporteOficina(ContRelPed.TipoPedido))   
          ContRelPed.TotalCSValorImporteOficina = this.formatoMoneda(this.getTotalCSValorImporteOficina(ContRelPed.TipoPedido))
          ContRelPed.TotalDifCantidadSurtOficina = this.reemplaza(this.formatoMoneda(this.getTotalDifCantidadSurtOficina(ContRelPed.TipoPedido)),'$')
          ContRelPed.TotalDifImporteSurtidoOficina = this.formatoMoneda(this.getTotalDifImporteSurtidoOficina(ContRelPed.TipoPedido))   
          ContRelPed.TotalDifValorAgregadoOficina = this.formatoMoneda(this.getTotalDifValorAgregadoOficina(ContRelPed.TipoPedido))   
          ContRelPed.TotalCantPedidoProdOficina = this.getTotalCantPedidoProdOficina(ContRelPed.TipoPedido)   
          ContRelPed.TotalCantidadProducidaOficina = this.getTotalCantidadProducidaOficina(ContRelPed.TipoPedido)   
          ContRelPed.TotalDifCantidadProdOficina = this.getTotalDifCantidadProdOficina(ContRelPed.TipoPedido) 
        }

        //Totales generales
        this.oRelacionPedRes.TotalPedidosGranTotal = this.getTotalPedidosGranTotal(this.oRelacionPedRes.Contenido) 
        this.oRelacionPedRes.TotalCanPedGranTotal = this.reemplaza(this.formatoMoneda(this.getTotalCanPedGranTotal(this.oRelacionPedRes.Contenido)),'$') 
        this.oRelacionPedRes.TotalImportesGranTotal = this.formatoMoneda(this.getTotalImportesGranTotal(this.oRelacionPedRes.Contenido))
        this.oRelacionPedRes.TotalCPValorAgregadoGranTotal = this.formatoMoneda(this.getTotalCPValorAgregadoGranTotal(this.oRelacionPedRes.Contenido) )
        this.oRelacionPedRes.TotalCanSurtidaGranTotal = this.reemplaza(this.formatoMoneda(this.getTotalCanSurtidaGranTotal(this.oRelacionPedRes.Contenido)),'$') 
        this.oRelacionPedRes.TotalCanSurtidaImporteGranTotal = this.formatoMoneda(this.getTotalCanSurtidaImporteGranTotal(this.oRelacionPedRes.Contenido))
        this.oRelacionPedRes.TotalCSValorImporteGranTotal = this.formatoMoneda(this.getTotalCSValorImporteGranTotal(this.oRelacionPedRes.Contenido))
        this.oRelacionPedRes.TotalDifCantidadSurtGranTotal = this.reemplaza(this.formatoMoneda(this.getTotalDifCantidadSurtGranTotal(this.oRelacionPedRes.Contenido)),'$')  
        this.oRelacionPedRes.TotalDifImporteSurtidoGranTotal =  this.formatoMoneda(this.getTotalDifImporteSurtidoGranTotal(this.oRelacionPedRes.Contenido))
        this.oRelacionPedRes.TotalDifValorAgregadoGranTotal =  this.formatoMoneda(this.getTotalDifValorAgregadoGranTotal(this.oRelacionPedRes.Contenido)) 
        this.oRelacionPedRes.TotalCantPedProdGranTotal = this.getTotalCantPedProdGranTotal(this.oRelacionPedRes.Contenido) 
        this.oRelacionPedRes.TotalCantidadProdGranTotal = this.getTotalCantidadProdGranTotal(this.oRelacionPedRes.Contenido) 
        this.oRelacionPedRes.TotalDifCantidadProdGranTotal = this.getTotalDifCantidadProdGranTotal(this.oRelacionPedRes.Contenido) 

        
        this.sMensaje="";
        this.bBandera = true;
        this.bCargando = false;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next("");
        });

        
        this.isCollapsed = true;
        

      },
      (error:RelacionPedidos) => {

        this.oRelacionPedRes = error;
        this.sMensaje="No se encontraron datos relación de pedidos";
        console.log("error");
        console.log(this.oRelacionPedRes);
        this.bBandera = false;
        this.bCargando = false;
      
      }
    );

}


//##### TOTALES PEDIDOS #####
getTotalPedidos(Pedido: Pedido[]): number {
  return Pedido.length; 
 }

 getTotalCanPed(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.CantidadPedida).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalImportes(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.CantidadPedidaImporte).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalCPValorAgregado(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.CantidadPedidaValorAgregado).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalCanSurtida(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.CantidadSurtida).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalCanSurtidaImporte(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.CantidadSurtidaImporte).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalCSValorImporte(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.CantidadSurtidaValorAgregado).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalDifCantidadSurt(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.DiferenciaCantidadSurtido).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalDifImporteSurtido(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.DiferenciaImporteSurtido).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalDifValorAgregado(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.DiferenciaValorAgregado).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalCantPedidaProd(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.CantidadPedidaProduccion).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalCantidadProd(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.CantidadProducida).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalDifCantidadProd(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.DiferenciaCantidadProducido).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }
 

 //##### TOTALES OFICINA #####
 getTotalPedidosOficina(TipoPedido: TipoPedido[]): number {  
  let total = TipoPedido.map(item => item.Pedidos.length).reduce((total,actual) => total + actual,0);
  return total; 
 }

 getTotalCanPedOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.CantidadPedida;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalImportesOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.CantidadPedidaImporte;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCPValorAgregadoOficina(TipoPedido: TipoPedido[]): number {
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.CantidadPedidaValorAgregado;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCanSurtidaOficina(TipoPedido: TipoPedido[]): number { 
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.CantidadSurtida;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCanSurtidaImporteOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.CantidadSurtidaImporte;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCSValorImporteOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.CantidadSurtidaValorAgregado;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalDifCantidadSurtOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.DiferenciaCantidadSurtido;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalDifImporteSurtidoOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.DiferenciaImporteSurtido;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total;   
 }

 getTotalDifValorAgregadoOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.DiferenciaValorAgregado;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total;   
 }

 getTotalCantPedidoProdOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.CantidadPedidaProduccion;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total;   
 }

 getTotalCantidadProducidaOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.CantidadProducida;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total;   
 }

  getTotalDifCantidadProdOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.DiferenciaCantidadProducido;
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total;   
 }

  //##### TOTALES OFICINA #####


  
 //##### GRAN TOTAL #####
 getTotalPedidosGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

    for(var val of RelacionPed){
      for(var tipPed of val.TipoPedido){
        Total +=tipPed.Pedidos.length          
      }
      
    }      
  return Total;
 }

 getTotalCanPedGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.CantidadPedida
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalImportesGranTotal(RelacionPed: ContenidoGen[]): number { 
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.CantidadPedidaImporte
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCPValorAgregadoGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.CantidadPedidaValorAgregado
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCanSurtidaGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.CantidadSurtida
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCanSurtidaImporteGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.CantidadSurtidaImporte
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCSValorImporteGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.CantidadSurtidaValorAgregado
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalDifCantidadSurtGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.DiferenciaCantidadSurtido
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalDifImporteSurtidoGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.DiferenciaImporteSurtido
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalDifValorAgregadoGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.DiferenciaValorAgregado
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCantPedProdGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.CantidadPedidaProduccion
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCantidadProdGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.CantidadProducida
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalDifCantidadProdGranTotal(RelacionPed: ContenidoGen[]): number {    
  let Total: number = 0;

  for(var tiPe of RelacionPed){
    for(var tipPed of tiPe.TipoPedido){
      for(var ped of tipPed.Pedidos){
        Total += ped.DiferenciaCantidadProducido
      }
      
    }    
  }
  Total = Number(Total.toFixed(2));
  return Total; 
 }

  //##### GRAN TOTAL #####

 //###### MODAL PEDIDO DETALLE ####
 openPedidoDetalle(PedidoDetalle: any, folio: string, cliente: string, filial: string) {
  console.log(folio);
  this.consultaPedidoDetalle(folio,cliente,filial);
  
  
  this.ModalActivo = this.modalService.open(PedidoDetalle, {
    ariaLabelledBy: 'PedidoDetalle',
    size: 'xl',
    scrollable: true
  });

  

  this.ModalActivo.result.then(
    (result) => {},
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('reason ' + reason);
    }
  );
  
}
 //###### MODAL PEDIDO DETALLE ####

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

 //###### CONSULTA DETALLE PEDIDO ####
consultaPedidoDetalle(folio: String, cliente: string, filial: string){
  console.log("consultaPedido detalle : "+folio);

  //Inicializamos datos de encabezado requeridos para consultar detalle
  this.oBuscaDetalle.TipoUsuario= this.oBuscar.TipoUsuario;
  this.oBuscaDetalle.ClienteCodigo= Number(cliente);
  this.oBuscaDetalle.ClienteFilial= Number(filial);
  this.oBuscaDetalle.PedidoFolio= Number(folio); 
  this.oBuscaDetalle.PedidoLetra= 'C';
  this.oBuscaDetalle.Usuario= this.sCodigo;

  console.log("----------"+this.oBuscaDetalle);

  //Realizamos llamada al servicio de pedidos
  this._servicioCPedidosDet    
  .Get(this.oBuscaDetalle)
  .subscribe(
    (Response: DetallePedido) => {

      this.oPedidoDetalleRes = Response;
      
      if(this.oPedidoDetalleRes.Codigo != 0){
        console.log(1);
        this.bError= true;
        this.sMensajeModal="No se encontro detalle de pedido";        
        this.bBanderaDet = false;  
        return;
      }

      
      this.pedidoDet = this.oPedidoDetalleRes.Contenido.PedidoArticulos
             

      //console.log( this.collectionSize);
      console.log("Respuesta : " +JSON.stringify(this.oPedidoDetalleRes));
      console.log("Detalle pedido : " +JSON.stringify(this.pedidoDet)); 
   

      

      
      this.bBanderaDet = true;
      this.sMensaje="";
      //this.collectionSize = this.oPedidoRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos

    },
    (error:DetallePedido) => {

      this.oPedidoDetalleRes = error;

      console.log("error");
      console.log(this.oPedidoDetalleRes);
    
    }
  );
  
}
//###### CONSULTA DETALLE PEDIDO #### 

//###### TOTALES DETALLE PEDIDO ####
getTotalPedidosDetalle(Pedido: PedidoArticulo[]): number {
  let Total: number = 0;

  for(var ped of Pedido){
    Total += ped.CantidadPedida 
  }

  Total = Number(Total.toFixed(2));
  return Total; 
 }


 getTotalCanSurDetalle(Pedido: PedidoArticulo[]): number {
  let Total: number = 0;

  for(var ped of Pedido){
    Total += ped.CantidadSurtida 
  }

  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalDifSurtidaDetalle(Pedido: PedidoArticulo[]): number {
  let Total: number = 0;

  for(var ped of Pedido){
    Total += ped.DiferenciaSurtido 
  }

  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalCanAProdDetalle(Pedido: PedidoArticulo[]): number {
  let Total: number = 0;

  for(var ped of Pedido){
    Total += ped.CantidadPedidoProduccion 
  }

  Total = Number(Total.toFixed(2));
  return Total; 
 }


 getTotalCanProducidaDetalle(Pedido: PedidoArticulo[]): number {
  let Total: number = 0;

  for(var ped of Pedido){
    Total += ped.CantidadProducida 
  }

  Total = Number(Total.toFixed(2));
  return Total; 
 }

 getTotalDifProducidaDetalle(Pedido: PedidoArticulo[]): number {
  let Total: number = 0;

  for(var ped of Pedido){
    Total += ped.DiferenciaProducido 
  }

  Total = Number(Total.toFixed(2));
  return Total; 
 }

 //###### TOTALES DETALLE PEDIDO ####
downloadAsPDF() {

  console.log("Activa tabla para imprimir");


  const pdfTable = this.pdfTable.nativeElement;


  var cadenaaux = pdfTable.innerHTML;

  cadenaaux = this.TablaRelacionPedidos();

 
  let cadena =
      '<br><p>Desde Cliente: <strong>' +this.oBuscar.ClienteDesde +' - '+this.oBuscar.FilialDesde+' - '+ this.obtenNombreCliente(this.oBuscar.ClienteDesde)+'<br></strong> Hasta cliente: <strong>' +this.oBuscar.ClienteHasta +' - '+this.oBuscar.FilialHasta+' - '+this.obtenNombreCliente(this.oBuscar.ClienteHasta)+'</strong></p>' +      
      cadenaaux;

  var html = htmlToPdfmake(cadena);

  html[2].table.headerRows= 1;
  console.log( html[2].table);
  const documentDefinition = { 
pageSize: {
      width: 1500,
      height: 820
    },
    pageOrientation: 'landscape',
    header: [

    {
    alignment: 'justify',
    columns: [
      { 
        image: 'logo', 
        margin: [25,13],
        heigth: 40, 
        width: 160 
      },
    {
      width:1120,
      text: 'Relación de pedidos',
      alignment: 'center',
      style: 'header',
      margin: [8,8]    
    },
    {
      width: 170,
      text: this.fechaHoy, 
      alignment: 'right',
      margin: [2, 15]
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
    ]},
    images: {
      logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAAAyCAYAAAA5vcscAAABG2lDQ1BpY2MAACjPY2BgMnB0cXJlEmBgyM0rKQpyd1KIiIxSYD/PwMbAzAAGicnFBY4BAT4gdl5+XioDBvh2jYERRF/WBZnFQBrgSi4oKgHSf4DYKCW1OJmBgdEAyM4uLykAijPOAbJFkrLB7A0gdlFIkDOQfQTI5kuHsK+A2EkQ9hMQuwjoCSD7C0h9OpjNxAE2B8KWAbFLUitA9jI45xdUFmWmZ5QoGFpaWio4puQnpSoEVxaXpOYWK3jmJecXFeQXJZakpgDVQtwHBoIQhaAQ0wBqtNAk0d8EASgeIKzPgeDwZRQ7gxBDgOTSojIok5HJmDAfYcYcCQYG/6UMDCx/EGImvQwMC3QYGPinIsTUDBkYBPQZGPbNAQDAxk/9PAA7dgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABcSAAAXEgFnn9JSAAAAB3RJTUUH5gYUFh0XOOZRTgAAAV96VFh0UmF3IHByb2ZpbGUgdHlwZSBpY2MAADjLnVTZjYQwDP1PFVuCb5NymECk7b+BdSBhYIU0h1FAenbs54v0W0r6aaIGCZoQg6CIkCgQbpAttro4KYkLEeikWWcC8FKbOg7DSZKhsbOHIwUFKUNhq9U4Cm9IjaiNEQ5gYVoOZh9K+tB+Dv7g5NK59AyYkomps+354kjbHu5RIegXMPcLKEahO/AHDDxFOSUK2h2VHglW8zO+PPGL/XrgzdHWj11R5YjsJ5xgejI641iejFpq08gZQNhqUM9Ols0tNASMnNtD0dsoRY30NAaCw4rbfVucUyhztLldJ4f2NtyU3fWlhocgXlzGrKU2bDT1mBPlT9v+bfu/d3SsxkkqaxviMciIFkt3Z3gnMYgaVbR/MMaebvVLrwxe6QeRS2q54DYvUud916SWO8Ys09K+M9A+RzXrbWpkjD1s+2XAY80l/QF3Q+fh33T4dgAAD3xJREFUeNrtnXmUXEUVxn89W5iE7AkMkoWEMRoSQCEGBBNRQIhBBIQjcgBR4YB6MBoWF44oKiKKYthECIIYWRRlFRGUJQESMEACaALGLJKEyUq2mYSZzLR/fPfNq65+r/t1TyeQOe87p8/0vFfvvltVt+69detWNaRIkSJFitKQCb40zpi7w16y6PRxsfcaJk6pyDuaZk6r6Dui6CWhU2k+dhbKrW/S+pdKq2nmNGoirmeA2grUdzvQUUL5XvbejojnqpzvWfsE37cB7SU0SD9gT2AgUGfPrwWagC3us6tmXUs2m1eFGqAn0GbvrbLPViDbMHFKQQF16poBWq0OVcbLdqPTA6i3e37dMjhKxWuPVvsEqLc23W78Bqi1erTZ+4qhp5XvKp1a46nDqTtO/QGa7b6E09GaGeDrwHHOg+WgGvgrcBXQ0ThjbkHtacwdDIwFDgVGOvxsBdY5jV6HBKuXNdblwCM+QU8wewLjgQOB/tZIvYA9gBHAYCScjwL3AP8G2HPC+UCeNugHnAAcBgwx3muBGcDNwbsLCGiV8XI0sL9d2w78E3jM/o40+vsDBxEOznY0kFqcdu4P9LUy91ibBxgLHGD1HmnPVwP/BV4G5gEvJOjP/Y3WB6y9AjqLHDovJqAzGPio8TLOaGSsPs8bX48hAc3TnB8CvgHMBpaSO0KJ+D9KgLPAMOB84Fng6QRMd1i5Z4BlwB+QQK0HLjA6wYjtAYwGvgocCQz1iXmCeQRwGvA6EuKl1hhZq/9AJAhfBi4DzgauAW7ENKknbGuB31qn/hgJGcAo66wnIp7x6/oUGgC/Ak4EfmDvbLYyC4HXrBMfsPpmgZ8AvydXOIcApwNfsjq6mIuEZrzRGQSstve9QHLL9rzROgy4DxgAvAl8DwlmUjpvWt/2Bn4DfMquXwlcjxRQJy1XODPAbsAVwMPAWx7hwMS0ONd2J1pg+wKTyTXHxRAwNR9YhUboXOuMNq/sQiSwd+C5II5g1gFfQx13GXBvxDvbkMb8M/B3YCrwLeCnwBjgIiSMUc+9ZI36EWuHBuAXwKlIsIoJ6CrgNuB9wHQcl4LQVC9BAjcaWAncgrSLi0VoUDcjLZoh1+1pBxYA/0PCudT+j3SFYhDQ+RewHAnnEuuHcuhsQIPmRGQ1ZiP3KgeucNZZ4SOAcwiFzvVpNgMXIqE5A5jilIFc8wPwkDVcbAXczjPB6nDKbwtoB+Uc4VuFtNsA7/mgXt82Xi/AEUxfWJxnNgE/tPdfCpxlDTcFaHEFzXmmA5iDXIQPI7P3c+ALwJq4ujrPL7cOXh/TFhgPAG9jrk0EnTbg18DnrQ/avTKu79rmt2mJfRPw056UTgzPAZ0O4ymPjqvZ3gYeRyN5Cer4m9FovQ2ZsvusbAaZh9vs/izk2yxC6nqN0Xma0kZW4koansO0lIfTge+gEXlHzLOd15zr7Uj7/cX+PwsNwjgeqpBGmuLwMRlp6t28zoh6PpgAlTJxjGuLpai9M+XQ2lmIEeRInn2z+whyqvcC7gZuQL7Atcgn+iXSmlngb8B1yG+qQp0zFQnDAGSOn9zBFXwDDQxXCBqR1qxD/s2WAo0SRXMLMA1p0hrkOw/x3uG34Vzkq6+2a2cjlyJT4LlKowW5Y9u7SujdghpQHNJm7G1Ic9yPzNMLEBluakamcj1yAz6HNNUK4BI0C74G0whFZuolwevoqFDLqWhyshY58uVgNvJpjwX2Az4J3FSgfBWKTlyCBLuntccyNMiLzeArhYpaqXcaUROWecg0fxG4GDjTPmfY50w0MxyPYlYX2zN3oknEOagjF+5gvvcK+Hc6vQ8wyb6vQrPDxELhlNuKJkgg7XcMhWO/gVm6FYVy2tGk8Erg8KBQJTVo31FHuvT2RKEe303ZpdEpnJ52m47iV8+gjvk4CtsE349F/umpKD55JerQC5C/eWsM3bLRMHGK2xm9gZPJF5ghyKyDZoRJAsNxmOc8Pxpn4lUA7Wimf7v9Pxy5QgFPXRXQ9oBGfcNY9/oE47FbIS7UswI16tEoCLwJOfjnIS2xCZnuqci8P44E9zjkFqyGighmNTKRwac3iqFORTFZ34w1WBnQzLZkM9e6cYXbBpvs+wAUpkmCZmTSH7X/xyFtmkS4C6EeCeERwMfsM9nedQXhCku3QY5wesL0R+ToX4jieIOAc5HGAjn9PYCrkUBMRX7a/RXkb380SK6xz3Tk9F9KuAzmop7QR65Dwl0S1s+/J/i6hTAoXkNpS7pNaKVtvv3/aRSw7gFla896JJiTkOWaBJyE/P2RlDnjfzcjb7LjTI62oBnoGNQxC5CWnAL8A83sH0Kz9D5ISBdiQfoKmfP/oFWR7Uhj1wH7oNWhLPkhiDbCTuqLOnRLkhdFoJ1Q87aiUFtBNM2c5greAmurGcjdOA+Fe64uk5/1aKl2uXMtg/zNH9LdNWcEXkOxzZNQA1+DRv/ZKPg8166PRbPVJRXmrxnFThejlZEF9p7z7bo/uNx158H2KVdT1RJqyzVYoLwYvMnIU2jCuBEJz3etLctF1GpcE4pJd8W/flciUjgXnT7O1XyDkQY9FwnJDWgl4iC7/xXU6PURz1aMR6/TlyMXwu+sFWiZD7Rmvl+pL3MEuT+h/zqPhMIZwetdSOO1Gc2fAYd0pUEiZuSLSJZ4sUuhJkGZVSgwfw7wJ7QqdAryqW5EoaXr2Qkj1zGbbWgRwA84r0YafYzV7SjjuZwMq32Ra9CKkiZK8ukcXrNoEWMo0vgjkR/9WeQ2lL2i47xjo31yrES5IaVKhbyKrI4VRdLEjJtQx1+I1tevQh0/Ha3S3FKR2pSGzjViB1k0kALTfgwWximjwSciAX+KMOZZEpyO2AZ8n3CN/1AUchpIFycynhbNIG1fiSXMjLVdjwrRKdknLiicjnleiVaMjkXhiwfRuvYo5OBXKnRUFEFnuB8PTxGuje+DFgyA4gLq3B+BwmLrUJhmY/DuLiBI/5tj/5+Mllm7nNjt8N0X+AxlRCkiaO2O8laTWNdCdPqgaEXJdEpJabsX+XkXIdM0CIWNHiy3IWJQVpKzt7pzOZrpgyZvwapRrIA61zMot/M9yJd+okDZINE4CV+gCeMUNLmrRoN9QLl1jqjPeDQgy1pf92gdjpTPti7SmYA057aIewVRVJqd0FIzcubvQhlKw9BMdGtQrivwOjzjfO+8X4Lmmo8SL24kXKVpBma67/JCPwHOQlrtmzjr6REpX6DJ4t7I9G2P49F7z/MoJnwLGuDFELRFkDUe18GDkGbuTO72yrl0KEAH1LeXkp/36W4RqUpAZx80wF8i333J+DT99itFc2IVvxvlLt5JaKLKhrcsGTRyX6dyDX7ZuMbwBOMRlDo3C2mAO1Cssb9Lz2UF+dQnoDjqtVjHxAhmPXA8Wr49JIZmHG8PoKB8G45/GFG/nk79B6PVphokYMGnp12/CfgE4aqWi77IvwUNpkaPRrXR7YtWBW9HfbzZo9OPcKWrEJ1+yN//HdLmm8nHEPtba7Ry2gAS+gGO9uxAKXLDUXJrNrjfRVQDH0QjdjKaIb+JBOlytK9kHQohvUoBM+hpqaeRD3aafX6EoguPo20SwbLs3kgIFqGoxGqXnod6lP0+CW1baEHZSEON7hsJebsZ+bYHRBQdTrifahjyVzMoT/R4tLAQbIzbw8o2WDk35DUaDcyjUUL0eiTM1yGt+LbTlnVIYPZDwrWRcBfAfkbnGMLtM71RlGYhuaY/oDMGCbtLZ5D183ut7ZqsXqcgy7YMxc63QgmzOm8T3B7WgV0WTuusKqQlexFmRgeNX0Oo+jei5N6iJj5Cg/WzzhpjHRnQexP5gIvwtE5M1nwdCjPVWud2EO5CXAmsLYG3/iih5gFyd00ORj5vtdF3dxoEbo87QDuccsusXqBBN9iecc1zp4vgIeu9byVagBiCBKtcOiuQgAa5EVXILw5W/gJr0Ir88ta4rcGRcLRnFsU+O69XAB0owF8xNM2cRq+h4+g9ojNjbQPK05yd5NkCaEVapxJ4C4W+fKwhYptHGVhhn65iObnLpuViM9qHlAjv6pT+7oyuBqhTpEiRIkWKFClSpEiRIkWKFClSpEiRIkWKFCnKRrpC9A4i6qjznZGwvaugrCznXQF+x7udXkgoKnE2vpOHEPseB1Uo06nZvViI/yT1TcJTIT6TtNuOHkil5nPu0micMddv4EyBezuLh31QGllOmajn3km8Ezx1W81p6IlyIxdEXB+PUtbeRqfprfLKHIjS84ITnt9v391yh6L0uyDFbx7h1mSQ4B1EmFq3AB2s4KIf8Zk6B6PczddIhip0TE1PwtTD5whT6EDnpq4kNwF4FEr7C/hoMForI94xHKXiPVtupyRFd9ecu5OfzFuDjjTchvYHLUYJzlFnGR1lf/dC2eb+6SGNKNl2Dtp+sc67PwzliM5BgjkRCaOLEdjORM/M9rJ3jif/hyXiUIsGxDzj50U8d4EwCdjFvigpey/7fwgRZ+0jS3MwOqdqQEKeykZ3F073yPAAwfaAOSjHcyE6d32sV24+ynKfgDLfZ5Hf0SCB6IGSZf2NZR1Ia60nTM72rVVcVv8YQo3eSHIEx5a3I43t8xT1vq1IE04kPIOqs5wjgEOs7JPoiPEdim4lnIE/V2Q015N/AMRGnBNLHDyOTPc6lGHuYzeUXT+W0DS6qEEdfio6GeUVon8AoZN/h+6BaPCsQ3uUkkRWskijHYYG1BiS9XEV2l7yCrIWce7eIdZWG5Cb08fju6LoVsJpyKCtCcHBX/4xiE3o8KvAtFUhweoUPkdAtyJ/b3HEPZDf9hg67nAW+dto25FGug9lkkcdyRgldKORNm40XgchX6+YIFQhTfsQ2voxh/hdjz6q0b6qDcha+NgT+Zr9jb8MO1h7dscJURZtyBqIOvhl7/5baBPV8Wj/UD+knV6PobcZ+7WHiNBJBu0B2mTfXyV3W0QLEvCtaDfoMWhCtNmj7wptFZqQ3EG4We015BcuLVL3DuOl0N6uLeSb+hbCPUzPoMHqm/8RaBAGk8veVvda8n+KpyLojsIJ2nUZzKJXR9x/GWnKgaiz8so4k5PZxDf+w8i0BR3p/3bTK869DegACp/WTHI3t2XRqSXu7z0txo4QL4I2pMlbC5SZGcHDS4QDpANtDfY17Hxyj4HcjIR1h51D363MuqMp2pEGWx1zH+Q7LXbLxGia2N/WRFpqOeFGshbvfiu5gtBCvmBsI9f0ZiPoRF2LQhb7Dc4CZaLq40+c2sgX8KifpGmhGx5amyJFihS7Lv4Pnn8JG3f/qJMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDYtMjBUMjI6Mjg6NDIrMDA6MDCycKOmAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA2LTIwVDIyOjI4OjQyKzAwOjAwwy0bGgAAADd0RVh0aWNjOmNvcHlyaWdodABDb3B5cmlnaHQgMTk5OSBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZDFs/20AAAAgdEVYdGljYzpkZXNjcmlwdGlvbgBBZG9iZSBSR0IgKDE5OTgpsLrq9gAAAABJRU5ErkJggg==',
    }
  };
  pdfMake.createPdf(documentDefinition).open();

  
  

}

formatoMoneda(number){
  return new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD', maximumFractionDigits: 2}).format(number);
};

reemplaza(valor: string, valorAReemplazar: string){
  let res: string;
  res = valor.replace(valorAReemplazar,'');
  return res;     
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

  obtenNombreCliente(cliente: number): string {   
    let nombre: string = '';  
  
      for(var cliCon of this.oCliente.Contenido){ 
        if (cliCon.ClienteCodigo == String(cliente)){
          nombre = cliCon.RazonSocial;
          break;
        }             
         
    }
    return nombre;
  }

  TablaRelacionPedidos(): string
  {

    var tabla = "";

   tabla =  '<table class="table table-hover table-striped" datatable [dtOptions]="dtOptions"  >  '+'\n'+      
              '<thead >'+'\n'+
                '<tr class="EncTabla" > '+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">PEDIDO</th><!--Pedido folio -->'+'\n'+
                  ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white;" >TP</th><!--Pedido codigo -->'+'\n'+
                  ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white;">L</th><!-- Pedido letra -->              '+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">CLTE</th><!--Cliente codigo -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">FIL</th><!--Cliente filial -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:center;"><div class="size">FECHA PEDIDO</div></th><!--Fecha pedido -->'+'\n'+
                  ' <th *ngIf="!bCliente"  style="background-color: #24a4cc; color: white; text-align:center;"><div class="size">FECHA APROD</div></th><!--Fecha pedido produccion -->'+'\n'+
                  ' <th  style="background-color: #24a4cc; color: white; text-align:center;"><div class="size">FECHA CANCOP</div></th><!--Fecha cancelacion -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white;">S</th><!--Pedido status -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:center;" >DIAS ATRAS</th><!--Dias atraso -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:center;">CANT PEDID</th><!--Cantidad perdida -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;">IMPORTE</th><!-- Cantidad perdida importe -->'+'\n'+
                  ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white; text-align:right;">VALOR AGREGADO</th><!---->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:center;">CANT SURTID</th><!--Cantidad surtida -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;">IMPORTE</th><!--Cantidad surtida importe -->'+'\n'+
                  ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white; text-align:right;">VALOR AGREGADO</th><!-- -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;">DIFER</th><!--Diferencia cantidad producto -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;">IMPORTE</th><!--Diferencia importe surtido -->'+'\n'+
                  ' <th *ngIf="!bCliente" style="background-color: #24a4cc; color: white; text-align:right;">VALOR AGREGADO</th><!--Valor agregado -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;">PEDIDO A PROD</th><!--Pedido a prod -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;">CANT PROD</th><!--Cantidad a prod -->'+'\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;">DIFER</th><!--Cantidad a prod -->'+'\n'+
                '</tr>'+'\n'+
              '</thead>'+'\n'+
              '<tbody>'+'\n';


              this.oRelacionPedRes.Contenido.forEach(function(relPed){
                tabla = tabla +   '<tr class="table-info">' + '\n' +                
                ' <td class="sticky" colspan="4">'+relPed.OficinaFonelliNombre+'</td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td *ngIf="!bCliente"></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td *ngIf="!bCliente"></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td *ngIf="!bCliente"></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td *ngIf="!bCliente"></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td ></td> '+'\n'+
                ' <td ></td> '+'\n'+
                '</tr>' +'\n';

                relPed.TipoPedido.forEach(function(tipoPed){

                  tipoPed.Pedidos.forEach(function(pedido){

                    tabla = tabla +   '<tr >' + '\n' +
                      ' <td class="FilasFonelli text-left sticky"><u>'+pedido.PedidoFolio+'</u></td>'+'\n'+
                      ' <td *ngIf="!bCliente" class="FilasFonelli text-left">'+tipoPed.TipoPedidoCodigo+'</td>'+'\n'+
                      ' <td *ngIf="!bCliente" class="FilasFonelli text-left">'+pedido.PedidoLetra+'</td>'+'\n'+
                      ' <td class="FilasFonelli text-left">'+pedido.ClienteCodigo+'</td>'+'\n'+
                      ' <td class="FilasFonelli text-left">'+pedido.ClienteFilial+'</td>'+'\n'+
                      ' <td class="FilasFonelli">'+pedido.FechaPedido+'</td>'+'\n'+
                      ' <td *ngIf="!bCliente" class="FilasFonelli text-left">'+pedido.FechaPedidoProduccion+'</td>'+'\n'+
                      ' <td class="FilasFonelli text-left">'+pedido.FechaCancelacion+'</td>'+'\n'+
                      ' <td class="FilasFonelli text-left">'+pedido.PedidoStatus+'</td>'+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.DiasAtraso+'</td>'+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.CantidadPedidaAux+'</td>'+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.CantidadPedidaImporteAux+'</td>'+'\n'+
                      ' <td *ngIf="!bCliente" class="FilasFonelli" style="text-align:right;">'+pedido.CantidadPedidaValorAgregadoAux+'</td>                '+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.CantidadSurtidaAux+'</td>                '+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.CantidadSurtidaImporteAux+'</td>                '+'\n'+
                      ' <td *ngIf="!bCliente" class="FilasFonelli" style="text-align:right;">'+pedido.CantidadSurtidaValorAgregadoAux+'</td>                '+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.DiferenciaCantidadSurtidoAux+'</td>                '+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.DiferenciaImporteSurtidoAux+'</td>                '+'\n'+
                      ' <td *ngIf="!bCliente" class="FilasFonelli" style="text-align:right;">'+pedido.DiferenciaValorAgregadoAux+'</td>                '+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.CantidadPedidaProduccion+'</td>                '+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.CantidadProducida+'</td>                '+'\n'+
                      ' <td class="FilasFonelli" style="text-align:right;">'+pedido.DiferenciaCantidadProducido+'</td>                '+'\n'+
                    '</tr>'+'\n';
                  });

                  //TOTAL PEDIDOS
                  tabla = tabla +   '<tr >' + '\n' +
                    '<td *ngIf="!bCliente"></td>'+'\n'+
                    '<td *ngIf="!bCliente"></td>'+'\n'+
                    '<td class="FilasFonBold">Total</td>'+'\n'+
                    '<td class="FilasFonBold">'+tipoPed.TotalPedidos+'</td>'+'\n'+
                    '<td></td>'+'\n'+
                    '<td class="FilasFonBold">Pedidos</td>'+'\n'+
                    '<td *ngIf="!bCliente"></td>'+'\n'+
                    '<td class="FilasFonBold">'+tipoPed.TipoPedido+'</td>'+'\n'+
                    '<td></td>'+'\n'+
                    '<td></td>   '+'\n'+
                    '<td class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalCanPed+'</td>'+'\n'+
                    '<td class="FilasFonBold" style="text-align:right;">'+tipoPed.TotlImportes+'</td>                  '+'\n'+
                    '<td *ngIf="!bCliente" class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalCPValorAgregado+'</td>'+'\n'+
                    '<td class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalCanSurtida+'</td>'+'\n'+
                    '<td class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalCanSurtidaImporte+'</td>'+'\n'+
                    '<td *ngIf="!bCliente" class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalCSValorImporte+'</td>'+'\n'+
                    '<td class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalDifCantidadSurt+'</td>'+'\n'+
                    '<td class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalDifImporteSurtido+'</td>'+'\n'+
                    '<td *ngIf="!bCliente" class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalDifValorAgregado+'</td>'+'\n'+
                    '<td class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalCantPedidaProd+'</td>'+'\n'+
                    '<td class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalCantidadProd+'</td>'+'\n'+
                    '<td class="FilasFonBold" style="text-align:right;">'+tipoPed.TotalDifCantidadProd+'</td>                  '+'\n'+
                  '</tr>'+'\n';
                });

                //TOTAL OFICINA
                tabla = tabla +   '<tr >' + '\n' +
                  '<td *ngIf="!bCliente"></td>'+'\n'+
                  '<td *ngIf="!bCliente"></td>'+'\n'+
                  '<td class="FilasFonBold">Total</td>'+'\n'+
                  '<td class="FilasFonBold">'+relPed.TotalPedidosOficina+'</td>'+'\n'+
                  '<td></td>'+'\n'+
                  '<td class="FilasFonBold">Pedidos</td>'+'\n'+
                  '<td *ngIf="!bCliente"></td>'+'\n'+
                  '<td class="FilasFonBold">OFICINA</td>'+'\n'+
                  '<td></td>'+'\n'+
                  '<td></td> '+'\n'+
                  '<td class="FilasFonBold" style="text-align:right;">'+relPed.TotalCanPedOficina+'</td>'+'\n'+
                  '<td class="FilasFonBold" style="text-align:right;">'+relPed.TotalImportesOficina+'</td>'+'\n'+
                  '<td *ngIf="!bCliente" class="FilasFonBold" style="text-align:right;">'+relPed.TotalCPValorAgregadoOficina+'</td>'+'\n'+
                  '<td class="FilasFonBold" style="text-align:right;">'+relPed.TotalCanSurtidaOficina+'</td>'+'\n'+
                  '<td class="FilasFonBold" style="text-align:right;">'+relPed.TotalCanSurtidaImporteOficina+'</td>'+'\n'+
                  '<td *ngIf="!bCliente" class="FilasFonBold" style="text-align:right;">'+relPed.TotalCSValorImporteOficina+'</td>'+'\n'+
                  '<td class="FilasFonBold" style="text-align:right;">'+relPed.TotalDifCantidadSurtOficina+'</td>'+'\n'+
                  '<td class="FilasFonBold" style="text-align:right;">'+relPed.TotalDifImporteSurtidoOficina+'</td>  '+'\n'+
                  '<td *ngIf="!bCliente" class="FilasFonBold" style="text-align:right;">'+relPed.TotalDifValorAgregadoOficina+'</td>  '+'\n'+
                  '<td class="FilasFonBold" style="text-align:right;">'+relPed.TotalCantPedidoProdOficina+'</td>  '+'\n'+
                  '<td class="FilasFonBold" style="text-align:right;">'+relPed.TotalCantidadProducidaOficina+'</td>  '+'\n'+
                  '<td class="FilasFonBold" style="text-align:right;">'+relPed.TotalDifCantidadProdOficina+'</td>    '+'\n'+
                '</tr>'+'\n';

              });

            //GRAN TOTALES
          tabla = tabla +   '<tr >' + '\n' +
            ' <td *ngIf="!bCliente"></td>'+'\n'+
            ' <td *ngIf="!bCliente"></td>'+'\n'+
            ' <td></td>'+'\n'+
            ' <td class="FilasFonBold">'+this.oRelacionPedRes.TotalPedidosGranTotal+'</td>'+'\n'+
            
            ' <td></td>'+'\n'+
            ' <td class="FilasFonBold">Pedidos</td>'+'\n'+
            ' <td *ngIf="!bCliente"></td>'+'\n'+
            ' <td class="FilasFonBold">GRAN TOTAL</td>'+'\n'+
            ' <td></td>'+'\n'+
            ' <td></td> '+'\n'+
            ' <td class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalCanPedGranTotal+'</td>'+'\n'+
            ' <td class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalImportesGranTotal+'</td>'+'\n'+
            ' <td  *ngIf="!bCliente" class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalCPValorAgregadoGranTotal+'</td>'+'\n'+
            ' <td class="FilasFonBold " style="text-align:right;">'+this.oRelacionPedRes.TotalCanSurtidaGranTotal+'</td>'+'\n'+
            ' <td class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalCanSurtidaImporteGranTotal+'</td>'+'\n'+
            ' <td  *ngIf="!bCliente" class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalCSValorImporteGranTotal+'</td>'+'\n'+
            ' <td class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalDifCantidadSurtGranTotal+'</td>'+'\n'+
            ' <td class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalDifImporteSurtidoGranTotal+'</td>'+'\n'+
            ' <td *ngIf="!bCliente" class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalDifValorAgregadoGranTotal+'</td>'+'\n'+
            ' <td class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalCantPedProdGranTotal+'</td>'+'\n'+
            ' <td class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalCantidadProdGranTotal+'</td>'+'\n'+
            ' <td class="FilasFonBold" style="text-align:right;">'+this.oRelacionPedRes.TotalDifCantidadProdGranTotal+'</td>'+'\n'+
          ' </tr>'+'\n';        
     
          '</tbody>'+ '\n' +          
        '</table>';



          return tabla;


  }



//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    localStorage.clear();
    this._router.navigate(['/']);    
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next("");
  }

}