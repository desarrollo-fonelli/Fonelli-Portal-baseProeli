import { Component } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

//Modelos
import { Contacto } from './models/contacto';
import { LoginDistribuidor } from './models/loginDistribuidor';
import { LoginEjecutivo } from './models/loginEjecutivo';






//Servicios
import { ServicioContacto } from './services/contacto.service';
import { ServicioLoginDistribuidor } from './services/loginDistribuidor.service';
import { ServicioLoginEjecutivo } from './services/loginEjecutivo.service';

import { Router, ActivatedRoute, Params ,NavigationEnd} from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ServicioContacto,
  ServicioLoginDistribuidor,
ServicioLoginEjecutivo],
})
export class AppComponent {
  title = 'portal-fonelli';
  closeResult = '';
  //public MenuHomeAux: string | null;

  //public MenuHome: string | null;

  public ModalActivo?: NgbModalRef;

  public respuestaLoginDistribuidor: any;
  public alerLoginDistribuidor: boolean = false;

  public respuestaLoginEjecutivo: any;
  public alerLoginEjecutivo: boolean = false;

  public contacto_guardado: any;
  public mensaje_contacto_guardado: boolean = false;

  constructor(
    private modalService: NgbModal,private bnIdle: BnNgIdleService,public _router: Router

    
  
  ) {

    //Control de inactividad 
    this.bnIdle.startWatching(1800).subscribe((res) => {
      if(res) {
        if (localStorage.getItem('codigo') != null){
          console.log("hay datos");
          localStorage.clear();
          this._router.navigate(['/']);
        }
        
      }
    })

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-CT2Y958BMW', { 'page_path': event.urlAfterRedirects });
      }      
    })
 

    /*this.MenuHomeAux = this.obtenMenu();

    if (this.MenuHomeAux == '2'){
      localStorage.setItem('idMenu', '2');
      console.log("Entra 2");
    }else{
      localStorage.setItem('idMenu', '1');
      console.log("Entra 1");
    }
    
    this.MenuHome = this.obtenMenu();
    console.log(this.MenuHome);*/
  }


  

 
}
