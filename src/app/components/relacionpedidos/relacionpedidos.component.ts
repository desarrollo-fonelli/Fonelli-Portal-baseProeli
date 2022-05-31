import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-relacionpedidos',
  templateUrl: './relacionpedidos.component.html',
  styleUrls: ['./relacionpedidos.component.css']
})
export class RelacionpedidosComponent implements OnInit {

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
    private _router: Router) { 
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    }

    ngOnInit(): void {

      const sCodigo :number | null = Number(sessionStorage.getItem('codigo'));
      const sTipo :string | null = sessionStorage.getItem('tipo');
      const sFilial :number | null = Number(sessionStorage.getItem('filial'));
      const sNombre :string | null = sessionStorage.getItem('nombre');
  
  
      //Se agrega validacion control de sesion distribuidores
      if(!sCodigo) {
        console.log('ingresa VALIDACION');
        this._router.navigate(['/']);
      }
    }

    shouldRun = true;

    
//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }

}
