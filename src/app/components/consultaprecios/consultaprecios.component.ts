import { Component, OnInit,ChangeDetectorRef, OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router,ActivatedRoute,Params } from '@angular/router';

//Modelos
import {FiltrosConsultaPrecios} from 'src/app/models/consultaprecios.filtros';
import {ConsultaPrecios} from 'src/app/models/consultaprecios';

//Servicios
import { ServicioConsultaPrecios } from 'src/app/services/consultaprecios.service';


@Component({
  selector: 'app-consultaprecios',
  templateUrl: './consultaprecios.component.html',
  styleUrls: ['./consultaprecios.component.css'],
  providers:[ServicioConsultaPrecios]
})
export class ConsultapreciosComponent implements OnInit {
 
  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  public bCliente: boolean;

  public oBuscar: FiltrosConsultaPrecios;
  oPreciosRes: ConsultaPrecios;
   //precios: Pedido[];

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

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private _route: ActivatedRoute,
    private _router: Router,
    private _servicioCPrecios: ServicioConsultaPrecios,) {

    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.sFilial  = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre')

    //Inicializamos variables consulta precios
    this.oBuscar = new FiltrosConsultaPrecios(0,0,0,0,'','','')
    this.oPreciosRes={} as ConsultaPrecios;  
    //this.pedido = [];

    this.bCliente=false;
  

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

   
  }

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);


    console.log('ingresa VALIDACION');
    //Se agrega validacion control de sesion distribuidores
    if(!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    switch(this.sTipo) { 
      case 'C':{    
        //Tipo cliente       

         this.oBuscar.ClienteCodigo = this.sCodigo; 
         this.oBuscar.ClienteFilial = this.sFilial;   
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

  //Funcion para consultar los pedidos 
  consultaPrecios(){
    console.log(this.oBuscar)
  }


//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }





}

