import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

//Modelos
import {FiltrosRelacionPedidos} from 'src/app/models/relacionpedidos.filtros';
import {RelacionPedidos} from 'src/app/models/relacionpedidos';

//Servicios
import { ServicioRelacionPedido } from 'src/app/services/relacionpedidos.service';

@Component({
  selector: 'app-relacionpedidos',
  templateUrl: './relacionpedidos.component.html',
  styleUrls: ['./relacionpedidos.component.css'],
  providers:[ServicioRelacionPedido]
})
export class RelacionpedidosComponent implements OnInit {

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  public oBuscar: FiltrosRelacionPedidos;
  oRelacionPedRes: RelacionPedidos; 

  public bError: boolean=false;
  public sMensaje: string="";

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
    private _servicioRelacionPed: ServicioRelacionPedido) { 

      this.sCodigo = Number(sessionStorage.getItem('codigo'));
      this.sTipo = sessionStorage.getItem('tipo');
      this.sFilial  = Number(sessionStorage.getItem('filial'));
      this.sNombre = sessionStorage.getItem('nombre');

    //Inicializamos variables consulta pedidos
    this.oBuscar = new FiltrosRelacionPedidos('',0,'','',0,0,0,0,'','','','','','','','',0)
    this.oRelacionPedRes={} as RelacionPedidos;  

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    }

    ngOnInit(): void {


  
  
      //Se agrega validacion control de sesion distribuidores
      if(!this.sCodigo) {
        console.log('ingresa VALIDACION');
        this._router.navigate(['/']);
      }
    }

    shouldRun = true;

//Funcion para consultar la relacion de pedidos
consultaRelPed(){


  this.oBuscar.TipoUsuario = 'C'

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
          this.sMensaje="No se encontraron datos del cliente";
          //this.bBandera = false;
          return;
        }

        this.sMensaje="";
        //this.bBandera = true;
        //this.collectionSize = this.oRelacionPedRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos

      },
      (error:RelacionPedidos) => {

        this.oRelacionPedRes = error;

        console.log("error");
        console.log(this.oRelacionPedRes);
      
      }
    );

}

    
//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }

}
