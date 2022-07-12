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

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-datosclientes',
  templateUrl: './datosclientes.component.html',
  styleUrls: ['./datosclientes.component.css'],
  providers:[ServicioClientes]
})
export class DatosclientesComponent implements OnInit {

  searchtext = '';


  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  public bMostrarDatos: boolean;
  public bCliente: boolean;
  public bError: boolean=false;

  public sMensaje: string="";
  public stipo: string;


  public oBuscar: FiltrosClientes;
  public Buscar: FiltrosClientes;
  public oCliente: Clientes; 
  public oContenido : Contenido;
  public oCondiciones : Condiciones;
  public oDatosGenerales : DatosGenerales;
  public oContacto : Contactos;

  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  closeResult = '';
  public ModalActivo?: NgbModalRef;

  mobileQuery: MediaQueryList;

  active = 1;

    private _mobileQueryListener: () => void;


  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _servicioCClientes: ServicioClientes, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private modalService: NgbModal) { 

                this.bMostrarDatos = false;
                this.bCliente = false;
                this.stipo="";
            
                this.Buscar = new FiltrosClientes(0, 0, 0,'',0);
                this.oBuscar = new FiltrosClientes(0, 0, 0,'',0);
            
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
   

    switch(this.sTipo) { 
      case 'C':{    
        //Tipo cliente                  
        console.log('Cliente');
        this.bCliente = true;
        
        this.oBuscar.ClienteCodigo=this.sCodigo;
        this.oBuscar.ClienteFilial=this.sFilial;
         break; 
      } 
      case 'A': { 
         //Agente; 
         this.bCliente=false;    
         break; 
      } 
      default: { 
         //Gerente; 
         this.bCliente=false;
         break; 
      } 
   } 

      

  }


    consultaCliente(){
console.log("ConsultaCliente");



    this.oBuscar.Pagina=1;
    this.oBuscar.Usuario= -1;
    this.bCargando = true;
    

  console.log(this.oBuscar);

    this._servicioCClientes
    .GetCliente(this.oBuscar)
    .subscribe(
      (Response: Clientes) => {

        this.oCliente = Response;

        console.log("Respuesta cliente"+JSON.stringify(this.oCliente));


        if(this.oCliente.Codigo != 0){

          this.bError= true;
          this.sMensaje="No se encontraron datos del cliente";
          this.bCargando = false;
          return;
        }
   
        this.oContenido = this.oCliente.Contenido[0];
        this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
        this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
        this.oContacto =this.oCliente.Contenido[0].Contactos;
        this.bMostrarDatos=true;
        this.bCargando = false;
     
      },
      (error:Clientes) => {

        this.oCliente = error;

        console.log("error");
        console.log(this.oCliente);
        this.bCargando = false;
     
      }
    );

  }

  
  //Modal clientes
  openClientes(Clientes: any) {
    console.log("Entra modal clientes");
    this.bCargandoClientes = true;
    var result;

    try{
      result = this.BuscaClientes()

      if(result){
        this.ModalActivo = this.modalService.open(Clientes, {
          ariaLabelledBy: 'Clientes',
          size: 'xl',
          scrollable: true
          
        });
    
        this.ModalActivo.result.then(
          (result) => {},
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log('reason ' + reason);
            this.Buscar = new FiltrosClientes(0, 0, 0,'', 0);
          }
        );
      }

      //this.bCargandoClientes = false;


      console.log("respuesta"+result);

    }catch(err){
      
    }
  }

    //Funcion para seleccionar cliente
    obtenCliente(sCodigo: string, sFilial: string) {
      console.log("Valores"+sCodigo+'-'+sFilial);

      this.oBuscar.ClienteCodigo = Number(sCodigo);
      this.oBuscar.ClienteFilial = Number(sFilial);

      this.ModalActivo.dismiss('Cross click');    
    }

  BuscaClientes():boolean{

    this._servicioCClientes
    .GetCliente(this.Buscar)
    .subscribe(
      (Response: Clientes) =>  {
        

        this.oCliente = Response;

        console.log("Respuesta cliente"+JSON.stringify(this.oCliente));
        this.bCargandoClientes =false;


        if(this.oCliente.Codigo != 0){
          this.bError= true;
          this.sMensaje="No se encontraron datos del cliente";
   
          return false;
        }
   
        this.oContenido = this.oCliente.Contenido[0];
        this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
        this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
        this.oContacto =this.oCliente.Contenido[0].Contactos;
        return true;

     
      },
      (error:Clientes) => {

        this.oCliente = error;

        console.log("error");
        console.log(this.oCliente);
        this.bCargandoClientes =false;
        return false;
     
      }
      
    );
    return true;
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


  onSubmitBusqueda(form:any){
    
  }

  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }



}
