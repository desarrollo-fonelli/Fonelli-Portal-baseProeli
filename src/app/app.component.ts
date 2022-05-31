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
    private modalService: NgbModal,

    
  
  ) {
 

    /*this.MenuHomeAux = this.obtenMenu();

    if (this.MenuHomeAux == '2'){
      sessionStorage.setItem('idMenu', '2');
      console.log("Entra 2");
    }else{
      sessionStorage.setItem('idMenu', '1');
      console.log("Entra 1");
    }
    
    this.MenuHome = this.obtenMenu();
    console.log(this.MenuHome);*/
  }


  

 
}
