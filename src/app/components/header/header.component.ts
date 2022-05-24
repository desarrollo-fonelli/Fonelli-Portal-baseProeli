import { Component, OnInit } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

//Modelos
import { Contacto } from '../../models/contacto';
import { LoginDistribuidor } from '../../models/loginDistribuidor';
import { LoginEjecutivo } from '../../models/loginEjecutivo';

//Servicios
import { ServicioContacto } from '../../services/contacto.service';
import { ServicioLoginDistribuidor } from '../../services/loginDistribuidor.service';
import { ServicioLoginEjecutivo } from '../../services/loginEjecutivo.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  closeResult = '';
  
  public ModeloContacto: Contacto;
  public ModeloLoginDistribuidor: LoginDistribuidor;
  public ModeloLoginEjecutivo: LoginEjecutivo;

  public ModalActivo?: NgbModalRef;

  public respuestaLoginDistribuidor: any;
  public alerLoginDistribuidor: boolean = false;

  public respuestaLoginEjecutivo: any;
  public alerLoginEjecutivo: boolean = false;

  public contacto_guardado: any;
  public mensaje_contacto_guardado: boolean = false;

  constructor(
    private modalService: NgbModal,
    private _servicioContacto: ServicioContacto,
    private _servicioLoginDistribuidor: ServicioLoginDistribuidor,
    private _servicioLoginEjecutivo: ServicioLoginEjecutivo
  ) {
    this.ModeloContacto = new Contacto('', '', '', '');
    this.ModeloLoginDistribuidor = new LoginDistribuidor('', '','');
    this.ModeloLoginEjecutivo = new LoginEjecutivo('', '', '');
  }

    //modal distribuidor
    openDistribuidor(LoginDistribuidor: any) {
      this.ModalActivo = this.modalService.open(LoginDistribuidor, {
        ariaLabelledBy: 'LoginDistribuidor',
      });
  
      this.ModalActivo.result.then(
        (result) => {},
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          console.log('reason ' + reason);
        }
      );
    }

  ngOnInit(): void {
  }

  onSubmitLDistribuidor(form: any) {
    /*    console.log("submit");
    console.log(this.ModeloContacto);*/
    //form.reset();
  }

  ConsultarLDistribuidor() {
    console.log(this.ModeloLoginDistribuidor);

    let filialAux = this.ModeloLoginDistribuidor.codigo.split('-');

    

    let ModeloLoginDistribuidorAux: LoginDistribuidor;
    ModeloLoginDistribuidorAux =this.ModeloLoginDistribuidor;

    ModeloLoginDistribuidorAux.codigo=filialAux[0];
    ModeloLoginDistribuidorAux.filial=filialAux[1];


    this._servicioLoginDistribuidor
      .Login(ModeloLoginDistribuidorAux)
      .subscribe(
        (Response) => {
          this.respuestaLoginDistribuidor = Response;
          console.log( Response);

          this.ModalActivo?.close();
        },
        (error) => {
          this.alerLoginDistribuidor = true;
          this.respuestaLoginDistribuidor = <any>error;
          console.log(<any>error);
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //Modal ejecutivo
  openEjecutivo(LoginEjecutivos: any) {
    this.ModalActivo = this.modalService.open(LoginEjecutivos, {
      ariaLabelledBy: 'LoginEjecutivos',
    });

    this.ModalActivo.result.then(
      (result) => {},
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log('reason ' + reason);
      }
    );
  }

  onSubmitLEjecutivo(form: any) {
    /*    console.log("submit");
    console.log(this.ModeloContacto);*/
    //form.reset();
  }

  ConsultarLEjecutivo() {
    console.log(this.ModeloLoginEjecutivo);

    this._servicioLoginEjecutivo.login(this.ModeloLoginEjecutivo).subscribe(
      (Response) => {
        this.respuestaLoginEjecutivo = Response;
        console.log('Response: ' + Response);

        this.ModalActivo?.close();
      },
      (error) => {
        this.alerLoginEjecutivo = true;
        this.respuestaLoginEjecutivo = <any>error;
        console.log('Error: ' + <any>error);
      }
    );
  }

    //Modal contacto
    openContacto(Contacto: any) {
      this.ModalActivo = this.modalService.open(Contacto, {
        ariaLabelledBy: 'Contacto',
      });
  
      this.ModalActivo.result.then(
        (result) => {},
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          console.log('reason ' + reason);
        }
      );
    }

  onSubmitContacto(form: any) {
    /*    console.log("submit");
    console.log(this.ModeloContacto);*/
    //form.reset();
  }

  addContacto() {
    console.log(this.ModeloContacto);

    this._servicioContacto.addContacto(this.ModeloContacto).subscribe(
      (Response) => {
        this.contacto_guardado = Response;
        console.log('Response: ' + Response);

        this.ModalActivo?.close();
      },
      (error) => {
        this.mensaje_contacto_guardado = true;
        this.contacto_guardado = <any>error;
        console.log('Error: ' + <any>error);
      }
    );
  }

}
