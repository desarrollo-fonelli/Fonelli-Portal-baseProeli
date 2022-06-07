
import { Component, OnInit,ChangeDetectorRef, OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router,ActivatedRoute,Params } from '@angular/router';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

//Modelos
import {FiltrosConsultaPedidos} from 'src/app/models/consultapedidos.filtros';
import {FiltrosDetallePedidos} from 'src/app/models/detallepedido.filtros';
import {ConsultaPedido, Pedido} from 'src/app/models/consultapedidos';
import {DetallePedido, PedidoArticulo} from 'src/app/models/detallepedido';

//Servicios
import { ServicioConsultaPedidos } from 'src/app/services/consultapedidos.service';
import { ServicioDetallePedido } from 'src/app/services/detallepedido.service';


@Component({
  selector: 'app-consultapedidos',
  templateUrl: './consultapedidos.component.html',
  styleUrls: ['./consultapedidos.component.css'],
  providers:[ServicioConsultaPedidos,ServicioDetallePedido]
})
export class ConsultapedidosComponent implements OnInit {

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  public oBuscar: FiltrosConsultaPedidos;
  oPedidoRes: ConsultaPedido; 
  public oBuscaDetalle: FiltrosDetallePedidos;
  oPedidoDetalleRes: DetallePedido; 

  public bError: boolean=false;
  public sMensaje: string="";
  bBandera = false;
  bBanderaDet = false;
  bBanderaDetPro = false;
  bBanderaBtnPro = true;
  bBanderaBtnPed = false
  
  pedido: Pedido[];
  pedidoDet: PedidoArticulo[];

  page = 1;
  pageSize = 4;
  collectionSize = 0;
  //countries: Country[];
  
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

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioCPedidos: ServicioConsultaPedidos,
    private _servicioCPedidosDet: ServicioDetallePedido,
    private modalService: NgbModal) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener    );

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.sFilial  = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');

    //Inicializamos variables consulta pedidos
    this.oBuscar = new FiltrosConsultaPedidos('',0,0,0,'');
    this.oPedidoRes={} as ConsultaPedido;  
    this.pedido = [];

    //Inicializamos variables consulta detalle pedidos
    this.oBuscaDetalle = new FiltrosDetallePedidos('',0,'',0,0,0);
    this.oPedidoDetalleRes={} as DetallePedido;  
    this.pedidoDet = [];

    this.refreshCountries();
   
  }

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);    


    //Se agrega validacion control de sesion distribuidores
    if(!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }
  }

  shouldRun = true;





//Funcion para consultar los pedidos 
  consultaPedido(){
    console.log("consultaPedido");

    //Inicializamos el tipo de usuario por el momento
    this.oBuscar.TipoUsuario = "C" 

    console.log(this.oBuscar.ClienteCodigo);
    console.log(this.oBuscar.ClienteFilial);
    console.log(this.oBuscar.Status);   
    
 
    console.log(this.oBuscar);

    //Realizamos llamada al servicio de pedidos
    this._servicioCPedidos     
    

    .Get(this.oBuscar)
    .subscribe(
      (Response: ConsultaPedido) => {

        this.oPedidoRes = Response;
        this.pedido = this.oPedidoRes.Contenido.Pedidos
               

        console.log( this.collectionSize);
        console.log(this.oPedidoRes );
        console.log(this.pedido);

        if(this.oPedidoRes.Codigo != 0){
          this.bError= true;
          this.sMensaje="No se encontraron datos del cliente";
          this.bBandera = false;
          return;
        }

        this.sMensaje="";
        this.bBandera = true;
        this.collectionSize = this.oPedidoRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos

      },
      (error:ConsultaPedido) => {

        this.oPedidoRes = error;

        console.log("error");
        console.log(this.oPedidoRes);
      
      }
    );
    
  }

  //Funcion para consultar los pedidos detalle 
  consultaPedidoDetalle(folio: String){
    console.log("consultaPedido detalle : "+folio);

    //Inicializamos datos de encabezado requeridos para consultar detalle
    this.oBuscaDetalle.TipoUsuario= this.oBuscar.TipoUsuario
    this.oBuscaDetalle.ClienteCodigo= this.oBuscar.ClienteCodigo
    this.oBuscaDetalle.ClienteFilial= this.oBuscar.ClienteFilial
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
        console.log(this.oPedidoDetalleRes);
        console.log(this.pedidoDet);

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

 //Funcion para actualizar los valores de la tabla de acuerdo a los registros a mostrar
  refreshCountries() {
    //this.countries = COUNTRIES
    console.log("Inicio");
    console.log(this.pedido);

    this.pedido
      .map((c, i) => ({id: i + 1, ...c}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
      console.log("TErmina");
  }

    //modal pedido detalle
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

    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }

    verDetalleProd(){
      console.log("Entra ver detalle prod")
      this.bBanderaDet= false;
      this.bBanderaDetPro = true;
      
      this.bBanderaBtnPed = true//Buton pedido para ver detalle pedido
      this.bBanderaBtnPro = false//Buton produccion para ver detalle produccion

      
    }
    verDetallePed(){
      console.log("Entra ver detalle prod")
      this.bBanderaDet= true;
      this.bBanderaDetPro = false;

      this.bBanderaBtnPed = false//Buton pedido para ver detalle pedido
      this.bBanderaBtnPro = true//Buton produccion para ver detalle produccion
    }


  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }


}



