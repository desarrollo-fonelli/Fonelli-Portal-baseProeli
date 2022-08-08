import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import * as crypto from 'crypto-js';

//Servicio
import { ServicioLoginAdmin} from '../../services/loginadmin.service';

//Modelos
import { LoginAdmin} from '../../models/loginadmin';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers:[ServicioLoginAdmin]
})
export class AdminComponent implements OnInit {

  public bCargandoInicio: boolean = false;

  public ModeloLoginAdmin: LoginAdmin;

  public respuestaLoginAdmin: any;
  public alerLoginAdmin: boolean = false;

  constructor(private _servicioLoginAdmin: ServicioLoginAdmin,
    private _router: Router,
    private snackBar: MatSnackBar) { 


    this.ModeloLoginAdmin = {}  as LoginAdmin;



  }

  ngOnInit(): void {

    let sCodigo :string | null = localStorage.getItem('codigo');
    let sTipo :string | null = localStorage.getItem('tipo');
    let sFilial :number | null = Number(localStorage.getItem('filial'));
    let sNombre :string | null = localStorage.getItem('nombre');


    if(sTipo=='M')
    {
      console.log(1);
      this._router.navigate(['/panel/']);
      return;
     
    }
    else if(sTipo =='A' || sTipo =='G' || sTipo =='C')
    {
        this.snackBar.openFromComponent(mensajesesion, {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 5500,
        panelClass: ['fondo_mensaje_sesion'],
      });
      this._router.navigate(['/']);
      return;
    }

  }


  onInicioSesion(){

    let sCodigo :number | null = Number(localStorage.getItem('codigo'));
    let sTipo :string | null = localStorage.getItem('tipo');


    if(sTipo =='M')
    {
      console.log(1);
      this._router.navigate(['/panel/inicio']);
      return;
     
    }
    else if(sTipo =='A' || sTipo =='G' || sTipo =='C')
    {
      console.log(2);
        this.snackBar.openFromComponent(mensajesesion, {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 2500,
        panelClass: ['fondo_mensaje_sesion'],
      });
      return;
    }

    console.log(this.ModeloLoginAdmin);

    this.bCargandoInicio = true;
    
    this._servicioLoginAdmin
      .Login(this.ModeloLoginAdmin)
      .subscribe(
      (Response) => {
    
        console.log('Respuesta login empleados: ' + JSON.stringify(Response));       
      
            if (Response.Codigo == 1) {
              this.alerLoginAdmin = true;
              this.respuestaLoginAdmin ="Datos incorrectos!";
            }else{              
              console.log("Login correcto");
              this.saveData(this.ModeloLoginAdmin.usuario,'M');             
              this._router.navigate(['/panel/inicio']);
            }

        this.bCargandoInicio = false;
      },
      (error) => {
        this.alerLoginAdmin = true;
        this.respuestaLoginAdmin= error.error[Object.keys(error.error)[1]]
        ? error.error[Object.keys(error.error)[1]]
        : error.message;
        this.bCargandoInicio = false;
      }
    );

  }


  saveData(usuario: string, tipo:string) {

    localStorage.setItem('codigo', usuario);
    localStorage.setItem('tipo', tipo);
    
  }

}


@Component({
  selector: 'mensaje-sesion-component',
  template: `<span class="mensaje-sesion-style">
  Para iniciar sesión como administrador primero cierre los otros tipos de sesión
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