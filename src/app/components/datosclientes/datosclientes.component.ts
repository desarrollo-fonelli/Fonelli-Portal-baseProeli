import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router,ActivatedRoute,Params } from '@angular/router';


//Modelos
import {FiltrosClientes} from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';



//Servicios
import { ServicioClientes } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-datosclientes',
  templateUrl: './datosclientes.component.html',
  styleUrls: ['./datosclientes.component.css'],
  providers:[ServicioClientes]
})
export class DatosclientesComponent implements OnInit {

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  public bMostrarDatos: boolean;
  public bCliente: boolean;
  public bError: boolean=false;

  public sMensaje: string="";
  public stipo: string;


  public Buscar: FiltrosClientes;
  public oCliente: Clientes; 
  public oContenido : Contenido;
  public oCondiciones : Condiciones;
  public oDatosGenerales : DatosGenerales;
  public oContacto : Contactos;

  mobileQuery: MediaQueryList;

  active = 1;

    private _mobileQueryListener: () => void;


  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _servicioCClientes: ServicioClientes, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) { 

                this.bMostrarDatos = false;
                this.bCliente = false;
                this.stipo="";
            
                this.Buscar = new FiltrosClientes(0, 0, 0, 0);
            
                this.oCliente={} as Clientes;
            
                this.oContenido ={} as Contenido;
                this.oCondiciones ={} as Condiciones;
                this.oDatosGenerales ={} as DatosGenerales;
                this.oContacto ={} as Contactos;

                this.mobileQuery = media.matchMedia('(max-width: 600px)');
                this._mobileQueryListener = () => changeDetectorRef.detectChanges();
                this.mobileQuery.addListener(this._mobileQueryListener);

                this.sCodigo = Number(sessionStorage.getItem('codigo'));
                this.sTipo = sessionStorage.getItem('tipo');
                this.sFilial  = Number(sessionStorage.getItem('filial'));
                this.sNombre = sessionStorage.getItem('nombre');
            

              }

  ngOnInit(): void {



    //Se agrega validacion control de sesion distribuidores
    if(!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }
   

    
    if(this.sTipo =='C'){
      console.log('Cliente');
      this.bCliente = true;
      
      this.Buscar.ClienteCodigo=this.sCodigo;
      this.Buscar.ClienteFilial=this.sFilial;

   
      
      
            }
            else{
      this.bCliente=false;
            }
      

  }


    consultaCliente(){
console.log("ConsultaCliente");



    this.Buscar.Pagina=1;
    this.Buscar.Usuario= -1;

  console.log(this.Buscar);

    this._servicioCClientes
    .GetCliente(this.Buscar)
    .subscribe(
      (Response: Clientes) => {

        this.oCliente = Response;

        console.log("Respuesta cliente"+JSON.stringify(this.oCliente));


        if(this.oCliente.Codigo != 0){

          this.bError= true;
          this.sMensaje="No se encontraron datos del cliente";
          return;
        }
   
        this.oContenido = this.oCliente.Contenido[0];
        this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
        this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
        this.oContacto =this.oCliente.Contenido[0].Contactos;
        this.bMostrarDatos=true;
     
      },
      (error:Clientes) => {

        this.oCliente = error;

        console.log("error");
        console.log(this.oCliente);
     
      }
    );

  }


  onSubmitBusqueda(form:any){
    
  }

  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }



}
