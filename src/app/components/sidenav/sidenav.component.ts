import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher, BreakpointObserver } from '@angular/cdk/layout';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

//Modelos
import { FiltrosAgente } from 'src/app/models/agentes.filtros';
import { Agentes, Contenido as AgentesCon } from 'src/app/models/agentes';
import {FiltrosOficina} from 'src/app/models/oficina.filtros';
import {Oficina} from 'src/app/models/oficina';
import {FiltrosClientes} from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido as ContenidoCli } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';
import { FiltrosLineas } from 'src/app/models/lineas.filtros';
import { Lineas, Contenido as LineasCon } from 'src/app/models/lineas';
import { FiltrosCategorias } from 'src/app/models/categorias.filtros';
import { Categorias, Contenido as CategoriasCon } from 'src/app/models/categorias';
import { FiltrosTipoCartera } from 'src/app/models/tipocartera.filtros';
import { TipoCartera, Contenido as TipoCarteraCon } from 'src/app/models/tipocartera';
import { FiltrosTipoCliente } from 'src/app/models/tipocliente.filtros';
import { TipoCliente, Contenido as TiposClienteCon } from 'src/app/models/tipocliente';

//Servicios
import { ServicioAgentes } from 'src/app/services/agentes.service';
import { ServicioOficinas } from 'src/app/services/oficinas.srevice';
import { ServicioClientes } from 'src/app/services/clientes.service';
import { ServicioLineas } from 'src/app/services/lineas.service';
import { ServicioCategorias } from 'src/app/services/categorias.service';
import { ServicioTiposCartera } from 'src/app/services/tiposcartera.service';
import { ServicioTiposCliente } from 'src/app/services/tiposclientes.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  providers: [ServicioAgentes,
  ServicioOficinas,
  ServicioClientes,
  ServicioLineas,
  ServicioCategorias,
  ServicioTiposCartera,
  ServicioTiposCliente
],
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

  //Datos Agentes
  public oBuscarAgentes: FiltrosAgente;
  public oAgentes: Agentes; 
  public oAgentesCon: AgentesCon[];

  //Datos Clientes
  public Buscar: FiltrosClientes;
  public oCliente: Clientes; 
  public oContenido : ContenidoCli;
  public oCondiciones : Condiciones;
  public oDatosGenerales : DatosGenerales;
  public oContacto : Contactos;

  //Datos Lineas
  public oBuscarLineas: FiltrosLineas;
  oLineasRes: Lineas; 
  oLineasCon: LineasCon[];
  
  //Datos Oficinas
  public oBuscarOfi: FiltrosOficina;
  oOficinasRes: Oficina; 

  //Datos categoria
  public oBuscarCategorias: FiltrosCategorias;
  oCategoriasRes: Categorias; 
  oCategoriasCon: CategoriasCon[];

  //Datos Carteras
  public oBuscaCartera: FiltrosTipoCartera;
  public oCarteras: TipoCartera; 
  public oCarterasCon: TipoCarteraCon[]; 

  //Datos tipo cliente
  public oBuscaTipoCliente: FiltrosTipoCliente;
  public oTipoCliente: TipoCliente; 
  public oTiposClienteCon: TiposClienteCon;


  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private breakpointObserver: BreakpointObserver,
    private _servicioAgentes: ServicioAgentes,
    private _servicioOficinas:ServicioOficinas,
    private _servicioCClientes: ServicioClientes,
    private _servicioLineas:ServicioLineas,
    private _servicioCategorias:ServicioCategorias,
    private _servicioCartera: ServicioTiposCartera,
    private _servicioTiposCliente: ServicioTiposCliente
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.bCliente = false;
    this.sCuenta = '';

    this.oBuscarAgentes =  new FiltrosAgente(0,'','A',0,'','')
    this.oAgentes = {} as Agentes;

    this.oBuscarOfi =  new FiltrosOficina('',0)
    this.oOficinasRes = {} as Oficina;

    this.Buscar = new FiltrosClientes(0, 0, 0,'', 0);
    this.oCliente={} as Clientes;
    this.oContenido ={} as ContenidoCli;
    this.oCondiciones ={} as Condiciones;
    this.oDatosGenerales ={} as DatosGenerales;
    this.oContacto ={} as Contactos;

    
  }

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    

    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    switch(this.sTipo) { 
      case 'C':{    
        //Tipo cliente
        this.bCliente = true;
        this.sCuenta='Distribuidor';
         break; 
      } 
      case 'A': { 
        this.bCliente = false;
        this.sCuenta='Agente';
         break; 
      } 
      default: { 
        this.bCliente = false;
        this.sCuenta='Gerente';
         break; 
      } 
    }
    
    
    
   //Consulta agentes      
   if (!sessionStorage.getItem('Agentes')){
    console.log("Inicia carga agentes");


console.log(1);

this.oBuscarAgentes.TipoUsuario = sessionStorage.getItem('tipo');
if(sessionStorage.getItem('tipo') == 'C')
{
  this.oBuscarAgentes.Usuario = sessionStorage.getItem('codigo')+'-'+sessionStorage.getItem('filial');
}
else{
  this.oBuscarAgentes.Usuario = sessionStorage.getItem('codigo');
}


    this.oBuscarAgentes.Status = "A";
    console.log(2);
    
    this._servicioAgentes
    .Get(this.oBuscarAgentes)
    .subscribe(
      (Response: Agentes) =>  {
        this.oAgentes = Response;
        console.log("Respuesta agentes"+JSON.stringify(this.oAgentes));
 
        if(this.oAgentes.Codigo != 0){
          //this.bError= true;
          //this.sMensaje="No se encontraron agentes";   
          return false;
        }
   
        this.oAgentesCon = this.oAgentes.Contenido;
        sessionStorage.setItem('Agentes', JSON.stringify(this.oAgentesCon));       
        return true;
     
      },
      (error:Agentes) => {
        this.oAgentes = error;
        console.log(this.oAgentes);
        return false;    
      }     
    );

    //console.log("Termina carga agentes");
    
   }
   


    //Realizamos llamada al servicio de oficinas
    if (!sessionStorage.getItem('Oficinas')){

      //console.log("Inicia carga Oficinas");
      this._servicioOficinas 
      .Get(this.oBuscarOfi)
      .subscribe(
        (Response: Oficina) => {

          this.oOficinasRes = Response;
          console.log("RESULTADO LLAMADA Oficinas "+JSON.stringify(this.oOficinasRes) );
          //console.log(this.pedido);

          if(this.oOficinasRes.Codigo != 0){
          // this.bError= true;
            //this.sMensaje="No se encontraron oficinas";
            return;
          }

          sessionStorage.setItem('Oficinas', JSON.stringify(this.oOficinasRes));

        },
        (error:Oficina) => {

          this.oOficinasRes = error;
          //this.sMensaje="No se encontraron oficinas";
        
          console.log(this.oOficinasRes);
          return;
        
        }
      );
     // console.log("Termina carga Oficinas");
    
    } 
    

     //Realizamos llamada al servicio de lineas
     if (!sessionStorage.getItem('Lineas')){

       // console.log("Inicia carga Lineaes");
        this._servicioLineas 
        .Get(this.oBuscarLineas)
        .subscribe(
          (Response: Lineas) => {
  
            this.oLineasRes = Response;
            console.log("RESULTADO LLAMADA lineas "+JSON.stringify(this.oOficinasRes) );
            //console.log(this.pedido);
  
            if(this.oLineasRes.Codigo != 0){
              //this.bError= true;
              //this.sMensaje="No se encontraron Lineas";
              return;
            }
  
            //this.oLineasCon = this.oLineasRes.Contenido
            sessionStorage.setItem('Lineas', JSON.stringify(this.oLineasRes));    
          },
          (error:Lineas) => {
  
            this.oLineasRes = error;
            //this.sMensaje="No se encontraron oficinas";
          
            console.log(this.oLineasRes);
            return;
          
          }
        );
        //console.log("Termina carga Lineaes");
     }
     


     //Realizamos llamada al servicio de categorias 
     if (!sessionStorage.getItem('Categorias')){

     // console.log("Inicia carga Categorias");
        
      this._servicioCategorias 
      .Get(this.oBuscarCategorias)
      .subscribe(
        (Response: Categorias) => {

          this.oCategoriasRes = Response;
          //console.log("RESULTADO LLAMADA categorias "+JSON.stringify(this.oOficinasRes) );
          //console.log(this.pedido);

          if(this.oCategoriasRes.Codigo != 0){
            return;
          }

          //this.oCategoriasCon = this.oCategoriasRes.Contenido;
          sessionStorage.setItem('Categorias', JSON.stringify(this.oCategoriasRes));    


        },
        (error:Categorias) => {

          this.oCategoriasRes = error;
          //this.sMensaje="No se encontraron categorias";
          console.log("error");
          console.log(this.oCategoriasRes);
          return;
        
        }
      );
      //console.log("Termina carga Categorias");
     }


     //Realizamos llamada al servicio de clientes 
     if (!sessionStorage.getItem('Clientes')){

    //  console.log("Inicia carga Clientes");

if(this.sTipo == 'C')
{
  this.Buscar.ClienteCodigo=this.sCodigo;
  this.Buscar.ClienteFilial=this.sFilial;
}

    this.Buscar.TipoUsuario = this.sTipo;
    this.Buscar.Usuario = this.sCodigo;

     this._servicioCClientes
      .GetCliente(this.Buscar)
      .subscribe(
        (Response: Clientes) =>  {
          
  
          this.oCliente = Response;  
          console.log("Respuesta cliente"+JSON.stringify(this.oCliente));    
          if(this.oCliente.Codigo != 0){     
            return false;
          }
     
          sessionStorage.setItem('Clientes', JSON.stringify(this.oCliente));    
          /*this.oContenido = this.oCliente.Contenido[0];
          this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
          this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
          this.oContacto =this.oCliente.Contenido[0].Contactos;*/
          return true;
  
       
        },
        (error:Clientes) => {  
          this.oCliente = error;
          console.log(this.oCliente);
          return false;
       
        }
        
      );
     // console.log("Termina carga Clientes");

     }


     //Consulta carteras
     if (!sessionStorage.getItem('Carteras')){
        console.log("Inicia carga Carteras");

        this._servicioCartera
        .Get(this.oBuscaCartera)
        .subscribe(
          (Response: TipoCartera) =>  {
            

            this.oCarteras = Response;  
            console.log("Respuesta carteras: "+JSON.stringify(this.oCarteras));



            if(this.oCarteras.Codigo != 0){
              return false;
            }
      
            sessionStorage.setItem('Carteras', JSON.stringify(this.oCarteras.Contenido));    
            
            return true;

        
          },
          (error:TipoCartera) => {

            this.oCarteras = error;             
            console.log(this.oCarteras);
            return false;
        
          }
          
        );
       // console.log("Termina carga carteras");
     }
      

     //Consulta Tipos cliente
     if (!sessionStorage.getItem('TiposCliente')){
      console.log("Inicia carga Tipos cliente");

      this._servicioTiposCliente
      .Get(this.oBuscaTipoCliente)
      .subscribe(
        (Response: TipoCliente) =>  {          

          this.oTipoCliente = Response;  
          console.log("Respuesta TiposCliente: "+JSON.stringify(this.oTipoCliente));

          if(this.oTipoCliente.Codigo != 0){
            return false;
          }

          sessionStorage.setItem('TiposCliente', JSON.stringify(this.oTipoCliente.Contenido));          
          return true;

        },
        (error:TipoCliente) => {

          this.oTipoCliente = error;             
          console.log(this.oTipoCliente);
          return false;
      
        }
        
      );
     // console.log("Termina carga oTipoCliente");
   }
    
     

  }





  
  toggle(nav: MatSidenav) {
    const isSmallScreen = this.breakpointObserver.isMatched(
      "(max-width: 599px)"
    );
    if (isSmallScreen) {
      nav.toggle();
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
