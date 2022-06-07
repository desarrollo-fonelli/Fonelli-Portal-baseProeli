import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';


//Modelos
import {FiltrosVentaArticuloCliente} from 'src/app/models/ventasclientearticulo.filtros';
import {VentasClienteArticulo} from 'src/app/models/ventasclientearticulo';

//Servicios
import { ServicioVentasClienteArticulo } from 'src/app/services/ventasclientearticulo.service';

@Component({
  selector: 'app-ventasclientearticulo',
  templateUrl: './ventasclientearticulo.component.html',
  styleUrls: ['./ventasclientearticulo.component.css'],
  providers:[ServicioVentasClienteArticulo]
})
export class VentasclientearticuloComponent implements OnInit {

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  public oBuscar: FiltrosVentaArticuloCliente;
  oVentasCliRes: VentasClienteArticulo; 

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
    private _servicioVenClientes: ServicioVentasClienteArticulo) { 

      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);

      this.sCodigo = Number(sessionStorage.getItem('codigo'));
      this.sTipo = sessionStorage.getItem('tipo');
      this.sFilial  = Number(sessionStorage.getItem('filial'));
      this.sNombre = sessionStorage.getItem('nombre');
  
      //Inicializamos variables consulta pedidos
      this.oBuscar = new FiltrosVentaArticuloCliente(0,'','','','',0,0,0,0,'','','','','','','','','','','','','','',0)
      this.oVentasCliRes={} as VentasClienteArticulo; 

    }

    ngOnInit(): void {
  
      //Se agrega validacion control de sesion distribuidores
      if(!this.sCodigo) {
        console.log('ingresa VALIDACION');
        this._router.navigate(['/']);
      }
    }

    shouldRun = true;

    //Funcion para consultar las ventas cliente articulo 
    consultaVentCArticulo(){
    console.log(this.oBuscar);
  }

    
//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }


}
