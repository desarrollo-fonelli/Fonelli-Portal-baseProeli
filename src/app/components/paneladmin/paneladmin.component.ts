import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher, BreakpointObserver } from '@angular/cdk/layout';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-paneladmin',
  templateUrl: './paneladmin.component.html',
  styleUrls: ['./paneladmin.component.css']
})
export class PaneladminComponent implements OnInit {

  public bCliente: boolean;
  public sCuenta: string;
  mobileQuery: MediaQueryList;

  public sCodigo: string| null = sessionStorage.getItem('codigo');
  public sTipo: string | null = sessionStorage.getItem('tipo');
  public sFilial: number | null = Number(sessionStorage.getItem('filial'));
  public sNombre: string | null = sessionStorage.getItem('nombre');

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private breakpointObserver: BreakpointObserver
  ) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit(): void {

    this.mobileQuery.removeListener(this._mobileQueryListener);
    

    //Se agrega validacion control de sesion distribuidores


  }

  toggle(nav: MatSidenav) {
    const isSmallScreen = this.breakpointObserver.isMatched(
      "(max-width: 599px)"
    );
    if (isSmallScreen) {
      nav.toggle();
    }
  }

    //Funcion para cerrar sesion y redireccionar al home
    EliminaSesion() {
      sessionStorage.clear();
      this._router.navigate(['/']);
    }



}
