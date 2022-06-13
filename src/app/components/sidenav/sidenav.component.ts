import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  public bCliente: boolean;
  public sCuenta: string;
  mobileQuery: MediaQueryList;

  public sCodigo: number | null = Number(sessionStorage.getItem('codigo'));
  public sTipo: string | null = sessionStorage.getItem('tipo');
  public sFilial: number | null = Number(sessionStorage.getItem('filial'));
  public sNombre: string | null = sessionStorage.getItem('nombre');

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.bCliente = false;
    this.sCuenta = '';
  }

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);


    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    if (this.sTipo == 'C') {
            this.bCliente = true;
            this.sCuenta='Distribuidor';
    } else if (this.sTipo == 'A')  {
      this.bCliente = false;
      this.sCuenta='Agente';
    }
    else{
      this.bCliente = false;
      this.sCuenta='Gerente';
    }
  }

  obtenMenu() {
    return sessionStorage.getItem('tipo');
  }

  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);
  }

  //Se agrega validacion si estamos en menu principal distribuidores mostramos carrucel
}
