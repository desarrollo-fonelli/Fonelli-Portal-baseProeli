import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';


//Modelos
import {FiltrosVentaArticuloCliente} from 'src/app/models/ventasclientearticulo.filtros';
import {VentasClienteArticulo} from 'src/app/models/ventasclientearticulo';
import {FiltrosOficina} from 'src/app/models/oficina.filtros';
import {Oficina} from 'src/app/models/oficina';

//Servicios
import { ServicioVentasClienteArticulo } from 'src/app/services/ventasclientearticulo.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';

@Component({
  selector: 'app-ventasclientearticulo',
  templateUrl: './ventasclientearticulo.component.html',
  styleUrls: ['./ventasclientearticulo.component.css'],
  providers:[ServicioVentasClienteArticulo,ServicioOficinas]
})
export class VentasclientearticuloComponent implements OnInit {

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  public oBuscar: FiltrosVentaArticuloCliente;
  oVentasCliRes: VentasClienteArticulo; 
  public oBuscarOfi: FiltrosOficina;
  oOficinasRes: Oficina; 
 

  public bError: boolean=false;
  public sMensaje: string="";
  public bCliente: boolean;
  bBandera: boolean;

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

              console.log("error");
              console.log(this.oOficinasRes);
            
            }
          );

           this.oBuscar.ClienteDesde = this.sCodigo; 
           this.oBuscar.ClienteHasta = this.sCodigo;   
           //this.oBuscar.CarteraHasta= 'Z';   
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
           this.sMensaje="No se encontraron datos del cliente";
           //this.bBandera = false;
           return;
         }
 
         this.sMensaje="";
         this.bBandera = true;
         //this.oContenido	= this.oVentasCliRes.Contenido
         //this.collectionSize = this.oVentasCliRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos
 
       },
       (error:VentasClienteArticulo) => {
 
         this.oVentasCliRes = error;
 
         console.log("error");
         console.log(this.oVentasCliRes);
       
       }
     );
  }

    
//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }


}
