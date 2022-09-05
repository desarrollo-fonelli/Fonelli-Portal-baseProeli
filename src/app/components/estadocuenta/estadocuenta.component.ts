import { Component, OnInit,ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router,ActivatedRoute,Params, OutletContext } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

//Modelos
import {FiltrosEstadoCuenta} from 'src/app/models/estadocuenta.filtros';
import {EstadoCuenta} from 'src/app/models/estadocuenta';
import {Cliente, Movimiento, ResumenStatusCliente, ResumenTipoCartera, ResumenTipoCliente} from 'src/app/models/estadocuenta';
import {FiltrosClientes} from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';
import { FiltrosTipoCartera } from 'src/app/models/tipocartera.filtros';
import { TipoCartera, Contenido as TipoCarteraCon } from 'src/app/models/tipocartera';


//Servicios
import { ServicioEstadoCuenta } from 'src/app/services/estadocuenta.service';
import { ServicioClientes } from 'src/app/services/clientes.service';
import { ServicioTiposCartera } from 'src/app/services/tiposcartera.service';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-estadocuenta',
  templateUrl: './estadocuenta.component.html',
  styleUrls: ['./estadocuenta.component.css'],
  providers:[ServicioEstadoCuenta,
    DecimalPipe,ServicioClientes,
    ServicioTiposCartera]
})
export class EstadocuentaComponent implements OnInit {

  @ViewChild('pdfTable') pdfTable: ElementRef;

  sCodigo :number | null;
  sTipo :string | null;
  sFilial :number | null;
  sNombre :string | null;

  searchtext = '';

  dtOptions: any = {};

  public oBuscar: FiltrosEstadoCuenta;
  oEdoCuentaRes: EstadoCuenta; 
  oCliente : Cliente[];
  oResumenStatusCliente : ResumenStatusCliente[];
  oResumenTipoCartera : ResumenTipoCartera[];
  oResumenTipoCliente : ResumenTipoCliente[];


  public bError: boolean=false;
  public sMensaje: string="";
  public bCliente: boolean;
  bBandera: boolean;
  public isCollapsed = false;

  fechaHoy: String
  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  closeResult = '';
  public ModalActivo?: NgbModalRef;

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

  public Buscar: FiltrosClientes;
  public oClientes: Clientes; 
  public oContenido : Contenido;
  public oCondiciones : Condiciones;
  public oDatosGenerales : DatosGenerales;
  public oContacto : Contactos;

  public oBuscaCartera: FiltrosTipoCartera;
  public oCarteras: TipoCartera; 
  public oCarterasCon: TipoCarteraCon[]; 

  public bBanderaCliente: boolean;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private _route: ActivatedRoute,
    private _router: Router,
    private _servicioEdoCuenta: ServicioEstadoCuenta,
    private modalService: NgbModal,
    private _servicioCClientes: ServicioClientes,
    private _servicioCartera: ServicioTiposCartera) { 

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    this.sCodigo = Number(localStorage.getItem('codigo'));
    this.sTipo = localStorage.getItem('tipo');
    this.sFilial  = Number(localStorage.getItem('filial'));
    this.sNombre = localStorage.getItem('nombre');

    this.bCliente = false;
    this.bBandera = false;



    //Inicializamos variables consulta pedidos
    this.oBuscar = new FiltrosEstadoCuenta('',0,0,0,0,0,'','',0)
    this.oEdoCuentaRes={} as EstadoCuenta;  
    this.oCliente = [];
    this.oResumenStatusCliente = [];
    this.oResumenTipoCartera = [];
    this.oResumenTipoCliente = [];

    this.Buscar = new FiltrosClientes(0, 0, 0,'', 0);
    this.oClientes={} as Clientes;
    this.oContenido ={} as Contenido;
    this.oCondiciones ={} as Condiciones;
    this.oDatosGenerales ={} as DatosGenerales;
    this.oContacto ={} as Contactos;
    
      
    }


    ngOnInit(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        order:[],
        ordering:false,
        dom: 'Bfrltip"',
        buttons: [
          {
            extend: 'excelHtml5',
            text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
            title: 'Consulta de pedidos',
            className: "btnFonelliRosa btn"
            
          },
          // {
          //   extend: 'pdfHtml5',
          //   text: '<p style=" color: #f9f9f9; height: 9px;">Imprimir</p>',
          //   className: "btnFonelliRosa btn",
          //   title: 'Consulta de pedidos',
          //   messageTop: 'Consulta pedidos 2'/*,
          //   customize: function (win) {
          //     $(win.document.body).find('th').addClass('display').css('text-align', 'center');
          //     $(win.document.body).find('th').addClass('display').css('background-color', '#24a4cc');
          //     $(win.document.body).find('table').addClass('display').css('font-size', '16px');
          //     $(win.document.body).find('table').addClass('display').css('text-align', 'center');
          //     $(win.document.body).find('tr:nth-child(odd) td').each(function (index) {
          //     $(this).css('background-color', '#D0D0D0');});
          //                 $(win.document.body).find('h1').css('text-align', 'center');
          //   }*/
            
          // }
        ]
     
        
      };
    
  
      //Se agrega validacion control de sesion distribuidores
      if(!this.sCodigo) {
        console.log('ingresa VALIDACION');
        this._router.navigate(['/']);
      }

      switch(this.sTipo) { 
        case 'C':{    
          console.log("Entra a log");
          //Tipo cliente
           this.oBuscar.ClienteDesde = this.sCodigo; 
           this.oBuscar.ClienteHasta = this.sCodigo;   
           this.oBuscar.FilialDesde = this.sFilial; 
           this.oBuscar.FilialHasta = this.sFilial;   
           //this.oBuscar.CarteraHasta= 'Z';   
           this.bCliente = true;    
           break; 
        } 
        case 'A': { 
           //statements; 
            this.oBuscar.Usuario = this.sCodigo;
            this.oBuscar.ClienteHasta = 999999;
            this.oBuscar.FilialHasta = 999;

            //Criterios para busqueda de clientes
            this.oBuscar.TipoUsuario = this.sTipo;    
            this.Buscar.Usuario = this.sCodigo;   
           break; 
        } 
        default: { 
           //statements; 
           this.oBuscar.Usuario = this.sCodigo;
           this.oBuscar.ClienteHasta = 999999;
           this.oBuscar.FilialHasta = 999;

           //Criterios para busqueda de clientes
           this.Buscar.TipoUsuario = this.sTipo;    
           this.Buscar.Usuario = this.sCodigo;  
           break; 
        } 
      } 

      let date: Date = new Date
    let mes;
    
    //Valida mes 
    if (date.getMonth().toString().length == 1){
      mes = '0'+(date.getMonth()+1);
    }

    this.fechaHoy =  (date.getDate() +'-'+mes+'-'+ date.getFullYear());  
    
    this.oBuscar.TipoUsuario = this.sTipo;
     
    

    //Consulta carteras
    if (!localStorage.getItem('Carteras')){
     // console.log("No tenemos carteras");
      this._servicioCartera
      .Get(this.oBuscaCartera)
      .subscribe(
        (Response: TipoCartera) =>  {
          
  
          this.oCarteras = Response;  
          console.log("Respuesta lineas: "+JSON.stringify(this.oCarteras));

  
  
          if(this.oCarteras.Codigo != 0){
            this.bError= true;
            this.sMensaje="No se encontraron carteras";     
            return false;
          }
     
          this.oCarterasCon = this.oCarteras.Contenido;
          this.oBuscar.CarteraDesde = this.oCarterasCon[0].CarteraCodigo;
          this.oBuscar.CarteraHasta = this.oCarterasCon[this.oCarterasCon.length -1].CarteraCodigo;
          return true;
  
       
        },
        (error:TipoCartera) => {
  
          this.oCarteras = error;  
          console.log("error");
          this.sMensaje="No se encontraron carteras";   
          console.log(this.oCarteras);
          return false;
       
        }
        
      );
    }else{
      //console.log("YA tenemos carteras");

      this.oCarterasCon = JSON.parse(localStorage.getItem('Carteras'));
      this.oBuscar.CarteraDesde = this.oCarterasCon[0].CarteraCodigo;
      this.oBuscar.CarteraHasta = this.oCarterasCon[this.oCarterasCon.length -1].CarteraCodigo;


    }
    

    //Realizamos llamada al servicio de clientes 
   if (!localStorage.getItem('Clientes')){

    //console.log("no tenemos  Clientes");

    this._servicioCClientes
      .GetCliente(this.Buscar)
      .subscribe(
        (Response: Clientes) =>  {        

          this.oClientes = Response;  
          console.log("Respuesta cliente"+JSON.stringify(this.oClientes));    
          if(this.oClientes.Codigo != 0){     
            return false;
          }
    
        
        this.oContenido= this.oClientes.Contenido[0];
          this.oCondiciones = this.oClientes.Contenido[0].Condiciones;
          this.oDatosGenerales =this.oClientes.Contenido[0].DatosGenerales;
          this.oContacto =this.oClientes.Contenido[0].Contactos;
          return true;

      
        },
        (error:Clientes) => {  
          this.oClientes = error;
          console.log(this.oCliente);
          return false;
      
        }
        
      );
      //console.log("Termina carga Clientes");

    }else{
      //console.log("Ya tenemos  Clientes");


      this.oClientes = JSON.parse(localStorage.getItem('Clientes'));
      /*this.oContenido = this.oClientes.Contenido[0];
      this.oCondiciones = this.oClientes.Contenido[0].Condiciones;
      this.oDatosGenerales =this.oClientes.Contenido[0].DatosGenerales;
      this.oContacto =this.oClientes.Contenido[0].Contactos;*/

    }

    }

    shouldRun = true;


    
//Funcion para consultar estado de cuenta
consultaEstadoCuenta(){
    console.log(this.oBuscar);


    this.bCargando = true;

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
          this.bCargando = false;
          this.bBandera = false;
        
          return;
        }

        

        this.oCliente = this.oEdoCuentaRes.Contenido.Clientes;
        this.oResumenStatusCliente = this.oEdoCuentaRes.Contenido.ResumenStatusCliente;
        this.oResumenTipoCartera = this.oEdoCuentaRes.Contenido.ResumenTipoCartera;
        this.oResumenTipoCliente = this.oEdoCuentaRes.Contenido.ResumenTipoCliente;
        this.sMensaje="";
        this.bBandera = true;
        this.bCargando = false;

        for(var cli of this.oCliente){

          for(var tiCa of cli.TipoCartera){

            for(var mov of tiCa.Movimientos){

              //Datos principales movimientos
              mov.CargosAux = this.formatoMoneda(mov.Cargos);
              mov.AbonosAux = this.formatoMoneda(mov.Abonos);
              mov.SaldoAux = this.formatoMoneda(mov.Saldo);
              mov.SaldoVencidoAux = this.formatoMoneda(mov.SaldoVencido)              
            }

            //Datos tipo de cartera
            tiCa.TotalCargos = this.formatoMoneda(this.getTotalCargos(tiCa.Movimientos));
            tiCa.TotalAbonos = this.formatoMoneda(this.getTotalAbonos(tiCa.Movimientos));
            tiCa.TotalSaldo = this.formatoMoneda(this.getTotalSaldo(tiCa.Movimientos));
            tiCa.TotalVencido = this.formatoMoneda(this.getTotalVencido(tiCa.Movimientos));
           
          }
        }

        for(var resTipCar of this.oResumenTipoCartera){    

              
               //Datos principales tipo cartera
               resTipCar.TipoCarteraCargosAux = this.formatoMoneda(resTipCar.TipoCarteraCargos);
               resTipCar.TipoCarteraAbonosAux = this.formatoMoneda(resTipCar.TipoCarteraAbonos);
               resTipCar.TipoCarteraSaldoAux = this.formatoMoneda(resTipCar.TipoCarteraSaldo);
               resTipCar.TipoCarteraSaldoVencidoAux = this.formatoMoneda(resTipCar.TipoCarteraSaldoVencido) 
         
           
        }
  

        this.isCollapsed = true;


      },
      (error:EstadoCuenta) => {

        this.oEdoCuentaRes = error;
        this.sMensaje="No se encontraron datos del estado de cuenta";
        this.bCargando = false;
        this.bBandera = false;
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

  getTotalCargos(Movimientos: Movimiento[]): number {

    let total = Movimientos.map(item => item.Cargos).reduce((total,actual) => total + actual,0);
    total = Number(total.toFixed(2));
    return total;
   }

  getTotalAbonos(Movimientos: Movimiento[]): number {

    let total = Movimientos.map(item => item.Abonos).reduce((total,actual) => total + actual,0);
    total = Number(total.toFixed(2));
    return total;
   }

   getTotalSaldo(Movimientos: Movimiento[]): number {

    let total = Movimientos.map(item => item.Saldo).reduce((total,actual) => total + actual,0);
    total = Number(total.toFixed(2));

    return total;
   }


   getTotalVencido(Movimientos: Movimiento[]): number {

    let total = Movimientos.map(item => item.SaldoVencido).reduce((total,actual) => total + actual,0);
    total = Number(total.toFixed(2));
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



  downloadAsPDF() {

    const pdfTable = this.pdfTable.nativeElement;
    console.log(pdfTable);

    var cadenaaux = pdfTable.innerHTML;

    cadenaaux = this.TablaEstadoCuenta();

    let cadena =
      '<br><p>Desde Cliente: <strong>' +this.oBuscar.ClienteDesde +' - '+this.oBuscar.FilialDesde+' - '+ this.obtenNombreCliente(this.oBuscar.ClienteDesde)+'<br></strong> Hasta cliente: <strong>' +this.oBuscar.ClienteHasta +' - '+this.oBuscar.FilialHasta+' - '+this.obtenNombreCliente(this.oBuscar.ClienteHasta)+'</strong></p>' +      
      cadenaaux;

    var html = htmlToPdfmake(cadena);
    console.log(html);
    html[2].table.headerRows= 1;
    const documentDefinition = { 
      pageOrientation: 'landscape', 
      header: [
        {
          alignment: 'justify',
          heigth: 200,
          columns: [
            { 
              image: 'logo', 
              margin: [25,13],
              heigth: 40, 
              width: 110 
            },
            {
              width: 600,
              text: 'Estado de cuenta',
              alignment: 'center',
              style: 'header',
              margin: [8,8]   
            },
            {
              width: 100,
              text: this.fechaHoy,
              alignment: 'right',
              margin: [2, 15]
            },
          ],
        },
      ],
  
      styles: {
        header: {
          fontSize: 22,        
          bold: true,
          color: '#24a4cc',
        },
        numeracion: {
          fontSize: 12,
        },
      },content: html,
    footer: function (currentPage, pageCount) {
      return [
        { text: currentPage.toString() + ' de ' + pageCount , alignment: 'right',  margin: [25, 20] }
      ]},
      images: {
        logo: 'data:image/png;base64,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',
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  
    
  
  }
  

  

  
  formatoMoneda(number){
    return new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD', maximumFractionDigits: 2}).format(number);
  };

    //Modal clientes
  openClientes(Clientes: any, cliente: boolean) {
    console.log("Entra modal clientes");
    this.bCargandoClientes = true;
    this.bBanderaCliente = cliente;
    var result;

    try{
      //result = this.BuscaClientes()
      result = true;
      

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

      this.bCargandoClientes = false;


      console.log("respuesta"+result);

    }catch(err){
      
    }
  }

  //Funcion para seleccionar cliente
  obtenCliente(sCodigo: string, sFilial: string) {

    if (this.bBanderaCliente) {//Si es true es cliente desde
      this.oBuscar.ClienteDesde = Number(sCodigo);
      this.oBuscar.FilialDesde = Number(sFilial);
    }else{
      this.oBuscar.ClienteHasta = Number(sCodigo);
      this.oBuscar.FilialHasta = Number(sFilial);
    }

      

      this.ModalActivo.dismiss('Cross click');    
    }

  BuscaClientes():boolean{

    this._servicioCClientes
    .GetCliente(this.Buscar)
    .subscribe(
      (Response: Clientes) =>  {
        

        this.oClientes = Response;

        console.log("Respuesta cliente"+JSON.stringify(this.oClientes));
        this.bCargandoClientes =false;


        if(this.oClientes.Codigo != 0){
          this.bError= true;
          this.sMensaje="No se encontraron datos del cliente";
   
          return false;
        }
   
        this.oContenido = this.oClientes.Contenido[0];
        this.oCondiciones = this.oClientes.Contenido[0].Condiciones;
        this.oDatosGenerales =this.oClientes.Contenido[0].DatosGenerales;
        this.oContacto =this.oClientes.Contenido[0].Contactos;
        return true;

     
      },
      (error:Clientes) => {

        this.oClientes = error;

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

  obtenNombreCliente(cliente: number): string {   
    let nombre: string = '';  
  
      for(var cliCon of this.oClientes.Contenido){ 
        if (cliCon.ClienteCodigo == String(cliente)){
          nombre = cliCon.RazonSocial;
          break;
        }             
         
    }
    return nombre;
  }
  
  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    localStorage.clear();
    this._router.navigate(['/']);    
  }

  TablaEstadoCuenta(): string
  {

    var tabla = "";

   tabla =  '<table class="table table-hover table-striped  " datatable [dtOptions]="dtOptions" >' + '\n' +
            '<thead>' + '\n' +
              '<tr class="EncTabla">' + '\n' +
                '<th style="background-color: #24a4cc; color: white;">OF</th><!--Codigo oficina -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white;">C</th><!--Codigo tipo cartera -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white;">S</th><!--Documento serie -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white;">DOCTO</th><!--Documento folio -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white; text-align:center;"><div class="size">FECHA EXP</div></th><!--Fecha expedicion -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white; text-align:center;"><div class="size">FECHA VENG</div></th><!--Fecha vencimiento -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white; text-align:right;">CARGOS</th><!--Cargos -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white; text-align:right;">ABONOS</th><!--Abonos -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white; text-align:right;">SALDO</th><!--Saldo -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white; text-align:right;">DIAS</th><!--Dias vencimiento -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white; text-align:right;">VENCIDO</th><!--Saldo vencido -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white;">S</th><!--Documento2 Serie -->' + '\n' +
                '<th style="background-color: #24a4cc; color: white;">REFCIA</th><!--Referencia -->' + '\n' +
              '</tr>' + '\n' +
            '</thead>' + '\n' +
            '<tbody>' + '\n' 

        


            this.oCliente.forEach(function(cliente){
tabla = tabla +   '<tr class="table-info">' + '\n' +
              '<td  class="FilasFonelli" colspan="13">'+cliente.ClienteCodigo+" "+cliente.ClienteFilial+ ") " +cliente.ClienteNombre+ "-" +cliente.Sucursal + '</td>' + '\n' +
            '</tr>' + '\n';

              cliente.TipoCartera.forEach(function(cartera){

            

                cartera.Movimientos.forEach(function(movimiento){

            
                  tabla = tabla +   '<tr >' + '\n' +
                  '<td class="FilasFonelli">'+ movimiento.OficinaFonelliCodigo +'</td>' + '\n' +
                  '<td class="FilasFonelli">'+ cartera.TipoCarteraCodigo +'</td>' + '\n' +
                  '<td class="FilasFonelli">'+ movimiento.DocumentoSerie +'</td>' + '\n' +
                  '<td class="FilasFonelli">'+ movimiento.DocumentoFolio +'</td>' + '\n' +
                  '<td class="FilasFonelli">'+ movimiento.FechaExpedicion +'</td>' + '\n' +
                  '<td class="FilasFonelli">'+ movimiento.FechaVencimiento +'</td>' + '\n' +
                  '<td class="FilasFonelli" style="text-align:right;">'+ movimiento.Cargos +'</td>' + '\n' +
                  '<td class="FilasFonelli" style="text-align:right;">'+ movimiento.Abonos +'</td>' + '\n' +
                  '<td class="FilasFonelli" style="text-align:right;"> '+ movimiento.Saldo +'</td>' + '\n' +
                  '<td class="FilasFonelli" style="text-align:right;">'+ movimiento.DiasVencimiento +'</td>' + '\n' +
                  '<td class="FilasFonelli" style="text-align:right;">'+ movimiento.SaldoVencido +'</td>' + '\n' +
                  '<td class="FilasFonelli">'+ movimiento.Documento2Serie +'</td>' + '\n' +
                  '<td class="FilasFonelli">'+ movimiento.Referencia +'</td>'        + '\n' +   
                '</tr>' + '\n' ;


              
                });

              
              });


            });

            /*  '<ng-container *ngFor="let cliente of oCliente | searchestadocuenta: searchtext">' + '\n' +
         
              '<ng-container *ngFor="let cartera of cliente.TipoCartera;">' + '\n' +
         
                '<tr>' + '\n' +
                  '<td></td>' + '\n' +
                  '<td class="FilasFonelli">{{cartera.TipoCarteraCodigo}}</td>' + '\n' +
                  '<td></td>' + '\n' +
                  '<td></td>' + '\n' +
                  '<td></td>' + '\n' +
                  '<td  class="FilasFonelli" style="text-align:right;">{{cartera.TipoCarteraDescripc}}</td>' + '\n' +
                  '<td  class="FilasFonelli" style="text-align:right;">{{formatoMoneda(getTotalCargos(cartera.Movimientos))}}</td>' + '\n' +
                  '<td  class="FilasFonelli" style="text-align:right;">{{formatoMoneda(getTotalAbonos(cartera.Movimientos))}}</td>' + '\n' +
                  '<td  class="FilasFonelli" style="text-align:right;">{{formatoMoneda(getTotalSaldo(cartera.Movimientos))}}</td>' + '\n' +
                  '<td></td>' + '\n' +
                  '<td  class="FilasFonelli" style="text-align:right;">{{formatoMoneda(getTotalVencido(cartera.Movimientos))}}</td>' + '\n' +
                  '<td></td>' + '\n' +
                  '<td></td>' + '\n' +
                '</tr>' + '\n' +
              '</ng-container>' + '\n' +
             
            '</ng-container>'      + '\n' +  */       
            '</tbody>'      + '\n' +          
          '</table>';



          return tabla;


  }



}
