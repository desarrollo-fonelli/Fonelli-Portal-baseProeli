import { Component, OnInit } from '@angular/core';
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

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _servicioCClientes: ServicioClientes) { 

                this.bMostrarDatos = true;
                this.bCliente = false;
                this.stipo="";
            
                this.Buscar = new FiltrosClientes(0, 0, 0, 0);
            
                this.oCliente={} as Clientes;
            
                this.oContenido ={} as Contenido;
                this.oCondiciones ={} as Condiciones;
                this.oDatosGenerales ={} as DatosGenerales;
                this.oContacto ={} as Contactos;

              }

  ngOnInit(): void {
    console.log('1.1');

    const sCodigo :number | null = Number(sessionStorage.getItem('codigo'));
    const sTipo :string | null = sessionStorage.getItem('tipo');
    const sFilial :number | null = Number(sessionStorage.getItem('filial'));
    const sNombre :string | null = sessionStorage.getItem('nombre');


    //Se agrega validacion control de sesion distribuidores
    if(!sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }
   

    
    if(sTipo =='1'){
      console.log('2');
      this.bCliente = true;
      
      this.Buscar.ClienteCodigo=sCodigo;
      this.Buscar.ClienteFilial=sFilial;
      
      
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


        if(this.oCliente.Codigo != 0){

          this.bError= true;
          this.sMensaje="No se encontraron datos del cliente";
          return;
        }
   
        this.oContenido = this.oCliente.Contenido[0];
        this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
        this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
        this.oContacto =this.oCliente.Contenido[0].Contactos;
     
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

}
