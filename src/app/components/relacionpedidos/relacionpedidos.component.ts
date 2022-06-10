import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

//Modelos
import {FiltrosRelacionPedidos} from 'src/app/models/relacionpedidos.filtros';
import {RelacionPedidos, Pedido, TipoPedido, Contenido as ContenidoGen} from 'src/app/models/relacionpedidos';
import {FiltrosOficina} from 'src/app/models/oficina.filtros';
import {Oficina} from 'src/app/models/oficina';
import {FiltrosDetallePedidos} from 'src/app/models/detallepedido.filtros';
import {DetallePedido, PedidoArticulo} from 'src/app/models/detallepedido';

//Servicios
import { ServicioRelacionPedido } from 'src/app/services/relacionpedidos.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { Contenido } from '../../models/oficina';
import { ServicioDetallePedido } from 'src/app/services/detallepedido.service';

@Component({
  selector: 'app-relacionpedidos',
  templateUrl: './relacionpedidos.component.html',
  styleUrls: ['./relacionpedidos.component.css'],
  providers:[ServicioRelacionPedido,ServicioOficinas,ServicioDetallePedido]
})
export class RelacionpedidosComponent implements OnInit {

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  public oBuscar: FiltrosRelacionPedidos;
  oRelacionPedRes: RelacionPedidos; 
  public oBuscarOfi: FiltrosOficina;
  oOficinasRes: Oficina; 
  public oBuscaDetalle: FiltrosDetallePedidos;
  oPedidoDetalleRes: DetallePedido; 
  //oContenido: ContenidoRelPed; 

  pedidoDet: PedidoArticulo[];

  public bError: boolean=false;
  public sMensaje: string="";
  public bCliente: boolean;
  bBandera: boolean;
  bBanderaDet = false;

  closeResult = '';
  public ModalActivo?: NgbModalRef;

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from(
    {length: 50},
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  );

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioRelacionPed: ServicioRelacionPedido,
    private _servicioOficinas:ServicioOficinas,
    private _servicioCPedidosDet: ServicioDetallePedido,
    private modalService: NgbModal) { 

      this.sCodigo = Number(sessionStorage.getItem('codigo'));
      this.sTipo = sessionStorage.getItem('tipo');
      this.sFilial  = Number(sessionStorage.getItem('filial'));
      this.sNombre = sessionStorage.getItem('nombre');

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

              console.log("error");
              console.log(this.oOficinasRes);
            
            }
          );

           this.oBuscar.ClienteDesde = this.sCodigo; 
           this.oBuscar.ClienteHasta = this.sCodigo;   
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

    shouldRun = true;

//Funcion para consultar la relacion de pedidos
consultaRelPed(){


  this.oBuscar.TipoUsuario = this.sTipo? this.sTipo : 'C';

  console.log(this.oBuscar);

    //Realizamos llamada al servicio de relacion de pedidos
    this._servicioRelacionPed    
    

    .Get(this.oBuscar)
    .subscribe(
      (Response: RelacionPedidos) => {

        this.oRelacionPedRes = Response;
        //this.pedido = this.oRelacionPedRes.Contenido.Pedidos
               

        //console.log( this.collectionSize);
        console.log("RESULTADO LLAMADA  "+JSON.stringify(this.oRelacionPedRes) );
        //console.log(this.pedido);

        if(this.oRelacionPedRes.Codigo != 0){
          this.bError= true;
          this.sMensaje="No se encontraron datos relacion de pedidos";
          //this.bBandera = false;
          return;
        }

        this.sMensaje="";
        this.bBandera = true;
        //this.oContenido	= this.oRelacionPedRes.Contenido
        //this.collectionSize = this.oRelacionPedRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos

      },
      (error:RelacionPedidos) => {

        this.oRelacionPedRes = error;
        this.sMensaje="No se encontraron datos relacion de pedidos";
        console.log("error");
        console.log(this.oRelacionPedRes);
      
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

 getTotalDifCantidadPro(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.DiferenciaCantidadProducido).reduce((total,actual) => total + actual,0);
  total = Number(total.toFixed(2));
  return total;
 }

 getTotalDifImporteSurtido(Pedido: Pedido[]): number {
  let total = Pedido.map(item => item.DiferenciaImporteSurtido).reduce((total,actual) => total + actual,0);
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

 getTotalDifCantidadProOficina(TipoPedido: TipoPedido[]): number {   
  let Total: number = 0;

  for(var tiPe of TipoPedido){
    for(var val of tiPe.Pedidos){
      Total += val.DiferenciaCantidadProducido;
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

 getTotalDifCantidadProGranTotal(RelacionPed: ContenidoGen[]): number {    
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

  //##### GRAN TOTAL #####

 //###### MODAL PEDIDO DETALLE ####
 openPedidoDetalle(PedidoDetalle: any, folio: string) {
  console.log(folio);
  this.consultaPedidoDetalle(folio);
  
  
  this.ModalActivo = this.modalService.open(PedidoDetalle, {
    ariaLabelledBy: 'PedidoDetalle',
    size: 'lg',
    backdrop: 'static'      
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
consultaPedidoDetalle(folio: String){
  console.log("consultaPedido detalle : "+folio);

  //Inicializamos datos de encabezado requeridos para consultar detalle
  this.oBuscaDetalle.TipoUsuario= this.oBuscar.TipoUsuario
  this.oBuscaDetalle.ClienteCodigo= this.sCodigo
  this.oBuscaDetalle.ClienteFilial= this.sFilial
  this.oBuscaDetalle.PedidoFolio= Number(folio) 
  this.oBuscaDetalle.PedidoLetra= 'C'

  console.log(this.oBuscaDetalle);

  //Realizamos llamada al servicio de pedidos
  this._servicioCPedidosDet    
  .Get(this.oBuscaDetalle)
  .subscribe(
    (Response: DetallePedido) => {

      this.oPedidoDetalleRes = Response;
      this.pedidoDet = this.oPedidoDetalleRes.Contenido.PedidoArticulos
             

      //console.log( this.collectionSize);
      console.log("Respuesta : " +JSON.stringify(this.oPedidoDetalleRes));
      console.log("Detalle pedido : " +JSON.stringify(this.pedidoDet)); 
   

      if(this.oPedidoDetalleRes.Codigo != 0){
        this.bError= true;
        this.sMensaje="No se encontro detalle de pedido";        
        this.bBanderaDet = false;  
        return;
      }

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
    
//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }

}
