import { Component, OnInit,ChangeDetectorRef, OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router,ActivatedRoute,Params } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
 

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

   
   
  }

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }





  obtenMenu(){
    return sessionStorage.getItem('tipo');
  }

    //Funcion para cerrar sesion y redireccionar al home
    EliminaSesion() {
      sessionStorage.clear();
      this._router.navigate(['/']);    
    }
  
  


//Se agrega validacion si estamos en menu principal distribuidores mostramos carrucel


}