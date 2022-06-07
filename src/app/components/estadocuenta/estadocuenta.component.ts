import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

//Modelos
import {FiltrosEstadoCuenta} from 'src/app/models/estadocuenta.filtros';
import {EstadoCuenta} from 'src/app/models/estadocuenta';
import {Cliente} from 'src/app/models/estadocuenta';
import {Movimiento} from 'src/app/models/estadocuenta'

//Servicios
import { ServicioEstadoCuenta } from 'src/app/services/estadocuenta.service';

@Component({
  selector: 'app-estadocuenta',
  templateUrl: './estadocuenta.component.html',
  styleUrls: ['./estadocuenta.component.css'],
  providers:[ServicioEstadoCuenta]
})
export class EstadocuentaComponent implements OnInit {

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  public oBuscar: FiltrosEstadoCuenta;
  oEdoCuentaRes: EstadoCuenta; 
  oCliente : Cliente[];


  public bError: boolean=false;
  public sMensaje: string="";
  public bCliente: boolean;
  bBandera: boolean;

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from(
    {length: 50},
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  );

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private _route: ActivatedRoute,
    private _router: Router,
    private _servicioEdoCuenta: ServicioEstadoCuenta) { 

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sTipo = sessionStorage.getItem('tipo');
    this.sFilial  = Number(sessionStorage.getItem('filial'));
    this.sNombre = sessionStorage.getItem('nombre');

    this.bCliente = false;
    this.bBandera = false;



    //Inicializamos variables consulta pedidos
    this.oBuscar = new FiltrosEstadoCuenta('',0,0,0,0,0,'','',0)
    this.oEdoCuentaRes={} as EstadoCuenta;  
    this.oCliente = [];
    
      
    }


    ngOnInit(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);


      const sCodigo :number | null = Number(sessionStorage.getItem('codigo'));
      const sTipo :string | null = sessionStorage.getItem('tipo');
      const sFilial :number | null = Number(sessionStorage.getItem('filial'));
      const sNombre :string | null = sessionStorage.getItem('nombre');
  
  
      //Se agrega validacion control de sesion distribuidores
      if(!sCodigo) {
        console.log('ingresa VALIDACION');
        this._router.navigate(['/']);
      }

      switch(sTipo) { 
        case 'C':{    
          //Tipo cliente
           this.oBuscar.ClienteDesde = sCodigo; 
           this.oBuscar.ClienteHasta = sCodigo;   
           this.oBuscar.CarteraHasta= 'Z';   
           this.bCliente = true;    
           break; 
        } 
        case 'A': { 
           //statements; 
           break; 
        } 
        default: { 
           //statements; 
           break; 
        } 
     } 

    // this.oCliente = this.json.Contenido.Clientes;

    //this.oCliente = this.json.Contenido.Clientes;

    }

    shouldRun = true;


    
//Funcion para consultar estado de cuenta
consultaEstadoCuenta(){
    console.log(this.oBuscar);

    this.oBuscar.TipoUsuario = "C" 
    console.log(this.oBuscar);

    //Realizamos llamada al servicio de pedidos
    this._servicioEdoCuenta     
    

    .Get(this.oBuscar)
    .subscribe(
      (Response: EstadoCuenta) => {

        this.oEdoCuentaRes = Response;
        //this.pedido = this.oEdoCuentaRes.Contenido.Pedidos
               

        //console.log( this.collectionSize);
        console.log("Resuesta: "+JSON.stringify(this.oEdoCuentaRes ));
        //console.log(this.pedido);

        if(this.oEdoCuentaRes.Codigo != 0){
          //this.bError= true;
          this.sMensaje="No se encontraron datos del estado de cuenta";
        
          return;
        }

        this.oCliente = this.oEdoCuentaRes.Contenido.Clientes;
        this.sMensaje="";
        this.bBandera = true;
      
        //this.collectionSize = this.oEdoCuentaRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos

      },
      (error:EstadoCuenta) => {

        this.oEdoCuentaRes = error;

        console.log("error");
        console.log(this.oEdoCuentaRes);
      
      }
    );

  }

  oCulta(): string {
    if (this.bCliente){
      return "hidden";
    }else{
      return '';
    }
  }


  getTotalCuenta(Movimientos: Movimiento[]): number {

    let total = Movimientos.map(item => item.Saldo).reduce((total,actual) => total + actual,0);

    return total;
   }

   getTotalCliente(ocliente: Cliente): number {
    
    let total = 0;

    ocliente.TipoCartera.forEach(function(cartera){

      total += cartera.Movimientos.map(item => item.Saldo).reduce((total,actual) => total + actual,0);
    });



    ;
    return total;
   }


    
//Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    sessionStorage.clear();
    this._router.navigate(['/']);    
  }



}
