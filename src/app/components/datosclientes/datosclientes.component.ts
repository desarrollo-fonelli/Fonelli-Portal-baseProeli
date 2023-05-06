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

//
import {FiltrosClientes as FiltrosClientesModal } from 'src/app/models/clientes.filtros';
import { Clientes as ClientesModal } from 'src/app/models/clientes';
import { Contenido as ContenidoModal } from 'src/app/models/clientes';
import { Condiciones as CondicionesModal } from 'src/app/models/clientes';
import { DatosGenerales as DatosGeneralesModal } from 'src/app/models/clientes';
import { Contactos as ContactosModal } from 'src/app/models/clientes';



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

  //Clientes modal
  public BuscarModal: FiltrosClientesModal;
  public oClienteModal: ClientesModal; 
  public oContenidoModal : ContenidoModal;
  public oCondicionesModal : CondicionesModal;
  public oDatosGeneralesModal : DatosGeneralesModal;
  public oContactoModal : ContactosModal;

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
        //this.oBuscar.Usuario=this.sCodigo;
        this.oBuscar.ClienteFilial = this.sFilial;
        this.oBuscar.Usuario =this.sCodigo+'-'+this.sFilial;
         break; 
      } 
      case 'A': { 
         //Agente; 
         this.bCliente=false;  
         this.oBuscar.Usuario = this.sCodigo;  
         break; 
      } 
      default: { 
         //Gerente; 
         this.bCliente=false;
         this.oBuscar.Usuario = this.sCodigo;
         break; 
      } 
   } 

   this.oBuscar.TipoUsuario= this.sTipo;

   //Realizamos llamada al servicio de clientes 
   if (!sessionStorage.getItem('Clientes')){

    //console.log("no tenemos  Clientes");

   this._servicioCClientes
    .GetCliente(this.BuscarModal)
    .subscribe(
      (Response: ClientesModal) =>  {
        

        this.oClienteModal = Response;  
        console.log("Respuesta cliente"+JSON.stringify(this.oClienteModal));    
        if(this.oClienteModal.Codigo != 0){     
          return false;
        }
   
       
       this.oContenidoModal= this.oClienteModal.Contenido[0];
        this.oCondicionesModal = this.oClienteModal.Contenido[0].Condiciones;
        this.oDatosGeneralesModal =this.oClienteModal.Contenido[0].DatosGenerales;
        this.oContacto =this.oClienteModal.Contenido[0].Contactos;
        return true;

     
      },
      (error:ClientesModal) => {  
        this.oClienteModal = error;
        console.log(this.oClienteModal);
        return false;
     
      }
      
    );
    //console.log("Termina carga Clientes");

   }else{
    //console.log("Ya tenemos  Clientes");


    this.oClienteModal = JSON.parse(sessionStorage.getItem('Clientes'));
    this.oContenidoModal = this.oClienteModal.Contenido[0];
    this.oCondicionesModal = this.oClienteModal.Contenido[0].Condiciones;
    this.oDatosGeneralesModal =this.oClienteModal.Contenido[0].DatosGenerales;
    this.oContactoModal =this.oClienteModal.Contenido[0].Contactos;

   }

      

  }


  consultaCliente(){
    
      this.bMostrarDatos=false;
      this.sMensaje="";
      this.bCargando = true;
  

      console.log("--------DATOS"+this.oBuscar.Usuario)
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
      //result = this.BuscaClientes();
      result = true;

      if(result){
        this.bCargandoClientes = false;
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

  obtenNombreCliente(cliente: number, sFilial: number): string {   
    let nombre: string = '';  
  
      for(var cliCon of this.oClienteModal.Contenido){ 
        if (cliCon.ClienteCodigo == String(cliente) && cliCon.ClienteFilial == String(sFilial)){

          if (cliCon.ClienteFilial != '0'){
            nombre = "Número "+cliente+' - '+cliCon.ClienteFilial+' '+ cliCon.RazonSocial;
          }else{
            nombre = "Número "+cliente+' '+ cliCon.RazonSocial;
          }

          
          break
        }

              
         
    }
   
    return nombre; 
  }

  
  formatoNumero(number){
    let valor: string;    
    number = Number(number);
     valor = Intl.NumberFormat('en-US', {currency: 'USD', maximumFractionDigits: 2}).format(number);     
     return valor
  }; 



  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }



}
