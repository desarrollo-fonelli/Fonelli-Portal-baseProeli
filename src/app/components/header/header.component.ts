import { Component, OnInit,VERSION,ChangeDetectorRef  } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

declare let AOS: any;
//Modelos
import { Contacto } from '../../models/contacto';
import { LoginDistribuidor } from '../../models/loginDistribuidor';
import { LoginEjecutivo } from '../../models/loginEjecutivo';

//Servicios
import { ServicioContacto } from '../../services/contacto.service';
import { ServicioLoginDistribuidor } from '../../services/loginDistribuidor.service';
import { ServicioLoginEjecutivo } from '../../services/loginEjecutivo.service';


import {MatSnackBar} from "@angular/material/snack-bar";



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  //styleUrls: ['./header.component.css']
  styles: [`
  .example-pizza-party {
    color: hotpink;
  }
`]
})

export class HeaderComponent implements OnInit {
  mobileQuery: MediaQueryList;


  private _mobileQueryListener: () => void;

  closeResult = '';
  
  public idMenu: String = '1';
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
    private _servicioLoginEjecutivo: ServicioLoginEjecutivo,
    private _route: ActivatedRoute,
    private _router: Router,
    private snackBar: MatSnackBar,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher
    

  ) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
    this.ModeloContacto = new Contacto('', '', '', '');
    this.ModeloLoginDistribuidor = new LoginDistribuidor('', '','');
    this.ModeloLoginEjecutivo = new LoginEjecutivo('', '', '');

     console.log("estoooooo:"+window.location.href)

    if (window.location.href.includes('/distribuidores')){
      console.log("entra menu distribuidor");
      console.log(this._router.url);
      this.idMenu = '2';
      
    }else{
      console.log("entra menu home");
      console.log(this._router.url);
      this.idMenu = '1';
      
    }
    
  }

    //modal distribuidor
    openDistribuidor(LoginDistribuidor: any) {

      let sCodigo :number | null = Number(sessionStorage.getItem('codigo'));
      let sTipo :string | null = sessionStorage.getItem('tipo');
      let sFilial :number | null = Number(sessionStorage.getItem('filial'));
      let sNombre :string | null = sessionStorage.getItem('nombre');


      if(sTipo=='C')
      {
        console.log(1);
        this._router.navigate(['/distribuidores']);
        return;
       
      }
      else if(sTipo =='A' || sTipo =='G')
      {
          this.snackBar.openFromComponent(mensajesesion, {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 2500,
          panelClass: ['fondo_mensaje_sesion'],
        });
        return;
      }

      console.log(3);
      

   

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

      AOS.init();
  
    }

  onSubmitLDistribuidor(form: any) {
    /*    console.log("submit");
    console.log(this.ModeloContacto);*/
    //form.reset();
  }

  ConsultarLDistribuidor() {
 
    let ModeloLoginDistribuidorAux: LoginDistribuidor;
    ModeloLoginDistribuidorAux = new LoginDistribuidor('','',''); 
    let filialAux = this.ModeloLoginDistribuidor.codigo.split('-');
    ModeloLoginDistribuidorAux.codigo=filialAux[0];
    ModeloLoginDistribuidorAux.filial=filialAux[1];

    ModeloLoginDistribuidorAux.password = this.ModeloLoginDistribuidor.password;

    //Se realiza login con datos enviados
    this._servicioLoginDistribuidor
      .Login(ModeloLoginDistribuidorAux)
      .subscribe(
        (Response) => {
          //Respuesta correcta de login
          this.respuestaLoginDistribuidor = Response;
          console.log( Response);
          
          console.log(this.respuestaLoginDistribuidor.Codigo)

          
            //Se valida login incorrecto
            if (this.respuestaLoginDistribuidor.Codigo == 1) {
              this.alerLoginDistribuidor = true;
              this.respuestaLoginDistribuidor ="Datos incorrectos!";
              //window.alert("Datos incorrectos")

            }else{
              console.log("Login correcto");
              console.log(this.respuestaLoginDistribuidor.Contenido[0].RazonSocial.toString());
              
           
              this.saveData(ModeloLoginDistribuidorAux.codigo.toString(),ModeloLoginDistribuidorAux.filial.toString(),this.respuestaLoginDistribuidor.Contenido[0].RazonSocial.toString(),'C')

              this.ModalActivo?.close();
              
              this._router.navigate(['/distribuidores']);
              //location.reload();


              
                
              
              

            }

          
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
        //2
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



  saveData(codigo: string,filial:string,nombre: string, tipo:string) {

    sessionStorage.setItem('codigo', codigo);
    sessionStorage.setItem('filial', filial);
    sessionStorage.setItem('nombre', nombre);
    sessionStorage.setItem('tipo', tipo);
    
  }

  getData() {
    return sessionStorage.getItem('idMenu');
  }
  removeData() {
    sessionStorage.removeItem('location');
  }
  deleteData() {
    sessionStorage.clear();
  }


}

@Component({
  selector: 'mensaje-sesion-component',
  template: `<span class="mensaje-sesion-style">
  Para iniciar sesión como distribuidor primero cierre la sesión de asesor
</span>
`,
  styles: [
    `
    .mensaje-sesion-style {
      color: white;
    }
  `,
  ],
})
export class mensajesesion {}
