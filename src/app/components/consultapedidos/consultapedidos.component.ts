import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
} from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

//Modelos
import { FiltrosConsultaPedidos } from 'src/app/models/consultapedidos.filtros';
import { FiltrosDetallePedidos } from 'src/app/models/detallepedido.filtros';
import { ConsultaPedido, Pedido } from 'src/app/models/consultapedidos';
import { DetallePedido, PedidoArticulo } from 'src/app/models/detallepedido';
import { FiltrosClientes} from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';


//Servicios
import { ServicioConsultaPedidos } from 'src/app/services/consultapedidos.service';
import { ServicioDetallePedido } from 'src/app/services/detallepedido.service';
import { ServicioClientes } from 'src/app/services/clientes.service';



@Component({
  selector: 'app-consultapedidos',
  templateUrl: './consultapedidos.component.html',
  styleUrls: ['./consultapedidos.component.css'],
  providers: [ServicioConsultaPedidos, ServicioDetallePedido, DecimalPipe, ServicioClientes],
})
export class ConsultapedidosComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;

  searchtext = '';

  sCodigo: number | null;
  sTipo: string | null;
  sFilial: number | null;
  sNombre: string | null;

  sWidth: number;
  sHeight: number;

  dtOptions: any = {};
  public isCollapsed = false;

  public bCliente: boolean;

  oBuscar: FiltrosConsultaPedidos;
  oPedidoRes: ConsultaPedido;
  public oBuscaDetalle: FiltrosDetallePedidos;
  oPedidoDetalleRes: DetallePedido;

  public bError: boolean = false;
  public sMensaje: string = '';
  bBandera = false;
  bBanderaDet = false;
  bBanderaDetPro = false;
  bBanderaBtnPro = true;
  bBanderaBtnPed = false;

  fechaHoy: String;

  pedido: Pedido[];
  pedidoDet: PedidoArticulo[];

  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  page = 1;
  pageSize = 4;
  collectionSize = 0;
  //countries: Country[];

  closeResult = '';
  public ModalActivo?: NgbModalRef;

  mobileQuery: MediaQueryList;

  public Buscar: FiltrosClientes;
  public oCliente: Clientes; 
  public oContenido : Contenido;
  public oCondiciones : Condiciones;
  public oDatosGenerales : DatosGenerales;
  public oContacto : Contactos;

  
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private _servicioCPedidos: ServicioConsultaPedidos,
    private _servicioCPedidosDet: ServicioDetallePedido,
    private modalService: NgbModal,
    private _servicioCClientes: ServicioClientes
    
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sCodigo = Number(localStorage.getItem('codigo'));
    this.sTipo = localStorage.getItem('tipo');
    this.sFilial = Number(localStorage.getItem('filial'));
    this.sNombre = localStorage.getItem('nombre');

    this.bCliente = false;

    //Inicializamos variables consulta pedidos
    this.oBuscar = new FiltrosConsultaPedidos('', 0, 0, 0, '');
    this.oPedidoRes = {} as ConsultaPedido;
    this.pedido = [];

    //Inicializamos variables consulta detalle pedidos
    this.oBuscaDetalle = new FiltrosDetallePedidos('', 0, '', 0, 0, 0);
    this.oPedidoDetalleRes = {} as DetallePedido;
    this.pedidoDet = [];

    this.refreshCountries();

    this.Buscar = new FiltrosClientes(0, 0, 0,'', 0);
    this.oCliente={} as Clientes;
    this.oContenido ={} as Contenido;
    this.oCondiciones ={} as Condiciones;
    this.oDatosGenerales ={} as DatosGenerales;
    this.oContacto ={} as Contactos;
}

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      fixedHeader: { 
        header: true, 
        footer: false 
        },
      order:[],
      ordering:false,
      dom: 'Bfrltip"',
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
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
        this.oBuscar.ClienteCodigo = this.sCodigo;
        this.oBuscar.ClienteFilial = this.sFilial;
        this.oBuscar.Status = 'A';
         break; 
      } 
      case 'A': { 
         //Agente; 
         this.oBuscar.Usuario = this.sCodigo;
         this.bCliente = false;    
         this.oBuscar.Status = 'A';         
         break; 
      } 
      default: { 
         //Gerente; 
         this.oBuscar.Usuario = this.sCodigo;
         this.bCliente = false; 
         this.oBuscar.Status = 'A';   
         break; 
      } 
   } 

   this.Buscar.TipoUsuario = this.sTipo;
   this.Buscar.Usuario = this.sCodigo;

    let date: Date = new Date();
    let mes;

    //Valida mes
    if (date.getMonth().toString.length == 1) {
      mes = '0' + (date.getMonth() + 1);
    }

    this.fechaHoy = date.getDate() + '-' + mes + '-' + date.getFullYear();    

    //Realizamos llamada al servicio de clientes 
   if (!localStorage.getItem('Clientes')){

    ///console.log("no tenemos  Clientes");

   this._servicioCClientes
    .GetCliente(this.Buscar)
    .subscribe(
      (Response: Clientes) =>  {        

        this.oCliente = Response;  
        console.log("Respuesta cliente"+JSON.stringify(this.oCliente));    
        if(this.oCliente.Codigo != 0){     
          return false;
        }
   
       
       this.oContenido= this.oCliente.Contenido[0];
        this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
        this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
        this.oContacto =this.oCliente.Contenido[0].Contactos;
        return true;

     
      },
      (error:Clientes) => {  
        this.oCliente = error;
        console.log(this.oCliente);
        return false;
     
      }
      
    );
    //console.log("Termina carga Clientes");

   }else{
    //console.log("Ya tenemos  Clientes");


    this.oCliente = JSON.parse(localStorage.getItem('Clientes'));
    this.oContenido = this.oCliente.Contenido[0];
    this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
    this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
    this.oContacto =this.oCliente.Contenido[0].Contactos;

   }


  }

  //Funcion para consultar los pedidos
  consultaPedido() {
    this.bBandera = false;
    this.bCargando = true;

    //Inicializamos el tipo de usuario por el momento
    this.oBuscar.TipoUsuario = this.sTipo;

    console.log(this.oBuscar.ClienteCodigo);
    console.log(this.oBuscar.ClienteFilial);
    console.log(this.oBuscar.Status);

    console.log(this.oBuscar);

    //Realizamos llamada al servicio de pedidos
    this._servicioCPedidos.Get(this.oBuscar).subscribe(
      (Response: ConsultaPedido) => {
        this.oPedidoRes = Response;
        this.pedido = this.oPedidoRes.Contenido.Pedidos;

        
        if (this.oPedidoRes.Codigo != 0) {
          this.bError = true;
          this.sMensaje = 'No se encontraron de pedidos';
          this.bBandera = false;
          this.bCargando = false;
          return;
        }

        this.oPedidoRes.Contenido.CantidadPedida = this.getTotal(this.pedido,'CantidadPedida');
        this.oPedidoRes.Contenido.DiferenciaPedidosSurtido = this.getTotal(this.pedido,'DiferenciaPedidosSurtido');

        this.sMensaje = '';
        this.bBandera = true;
        //this.collectionSize = this.oPedidoRes.Contenido.Pedidos.length; //Seteamos el tamaño de los datos obtenidos
        this.bCargando = false;
        this.isCollapsed = true;

      },
      (error: ConsultaPedido) => {
        this.oPedidoRes = error;
        this.sMensaje = 'No se encontraron de pedidos';
        console.log('error');
        console.log(this.oPedidoRes);
        this.bCargando = false;
      }
    );
  }

  //Funcion para consultar los pedidos detalle
  consultaPedidoDetalle(folio: String) {
    //console.log('consultaPedido detalle : ' + folio);

    //Inicializamos datos de encabezado requeridos para consultar detalle
    this.oBuscaDetalle.TipoUsuario = this.oBuscar.TipoUsuario;
    this.oBuscaDetalle.ClienteCodigo = this.oBuscar.ClienteCodigo;
    this.oBuscaDetalle.ClienteFilial = this.oBuscar.ClienteFilial;
    this.oBuscaDetalle.PedidoFolio = Number(folio);
    this.oBuscaDetalle.PedidoLetra = 'C';
    this.oBuscaDetalle.Usuario = this.oBuscar.Usuario;

    console.log(this.oBuscaDetalle);

    //Realizamos llamada al servicio de pedidos
    this._servicioCPedidosDet.Get(this.oBuscaDetalle).subscribe(
      (Response: DetallePedido) => {
        this.oPedidoDetalleRes = Response;
        this.pedidoDet = this.oPedidoDetalleRes.Contenido.PedidoArticulos;

        //console.log( this.collectionSize);
        //console.log(this.oPedidoDetalleRes);
        //console.log(this.pedidoDet);

        if (this.oPedidoDetalleRes.Codigo != 0) {
          this.bError = true;
          this.sMensaje = 'No se encontro detalle de pedido';
          this.bBanderaDet = false;
          return;
        }

        //Se calculan totales pedido
        this.oPedidoDetalleRes.Contenido.CantidadPedida = this.getTotalPedido(this.pedidoDet,'CantidadPedida');

        this.oPedidoDetalleRes.Contenido.CantidadPedidoProduccion = this.getTotalPedido(this.pedidoDet,'CantidadPedidoProduccion');
        this.oPedidoDetalleRes.Contenido.CantidadProducida = this.getTotalPedido(this.pedidoDet,'CantidadProducida');
        this.oPedidoDetalleRes.Contenido.CantidadSurtida = this.getTotalPedido(this.pedidoDet,'CantidadSurtida');
        this.oPedidoDetalleRes.Contenido.DiferenciaProducido = this.getTotalPedido(this.pedidoDet,'DiferenciaProducido');
        

        this.bBanderaDet = true;
        this.sMensaje = '';
        //this.collectionSize = this.oPedidoRes.Contenido.Pedidos.length//Seteamos el tamaño de los datos obtenidos
      },
      (error: DetallePedido) => {
        this.oPedidoDetalleRes = error;
        this.sMensaje = 'No se encontro detalle de pedido';
        //console.log('error');
        console.log(this.oPedidoDetalleRes);
      }
    );
  }

  //Funcion para actualizar los valores de la tabla de acuerdo a los registros a mostrar
  refreshCountries() {
    //this.countries = COUNTRIES
    console.log('Inicio');
    console.log(this.pedido);

    this.pedido
      .map((c, i) => ({ id: i + 1, ...c }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
    console.log('TErmina');
  }

  //modal pedido detalle
  openPedidoDetalle(PedidoDetalle: any, folio: string) {
    console.log(folio);
    //this.pedidoDet = [];
    this.consultaPedidoDetalle(folio);

    this.ModalActivo = this.modalService.open(PedidoDetalle, {
      ariaLabelledBy: 'PedidoDetalle',
      size: 'xl',
      scrollable: true
      
    });

    this.ModalActivo.result.then(
      (result) => {},
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log('reason ' + reason);
        this.pedidoDet = [];
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.pedidoDet = [];
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.pedidoDet = [];
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  verDetalleProd() {
    console.log('Entra ver detalle prod');
    this.bBanderaDet = false;
    this.bBanderaDetPro = true;

    this.bBanderaBtnPed = true; //Buton pedido para ver detalle pedido
    this.bBanderaBtnPro = false; //Buton produccion para ver detalle produccion
  }
  verDetallePed() {
    console.log('Entra ver detalle prod');
    this.bBanderaDet = true;
    this.bBanderaDetPro = false;

    this.bBanderaBtnPed = false; //Buton pedido para ver detalle pedido
    this.bBanderaBtnPro = true; //Buton produccion para ver detalle produccion
  }


  downloadAsPDF() {

    const pdfTable = this.pdfTable.nativeElement;
    console.log(pdfTable);

    var cadenaaux = pdfTable.innerHTML;

    cadenaaux = this.TablaPedidos();

    let cadena =
    '<br><p>Cliente: <strong>' +this.oBuscar.ClienteCodigo +'-'+this.oBuscar.ClienteFilial+' '+this.obtenNombreCliente(this.oBuscar.ClienteCodigo)+'</strong></p>' +    
    cadenaaux;

    console.log('cadena');
    console.log(cadena);

    var html = htmlToPdfmake(cadena);
    console.log(html);
    html[2].table.headerRows= 1;
    const documentDefinition = {
      pageSize: 'A4',
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
              width: 380,
              text: 'Consulta de pedidos',
              alignment: 'center',
              style: 'header',
              margin: [8,8],
              
            },
            {
              width: 65,
              text: this.fechaHoy,
              alignment: 'right',
              margin: [2, 15],
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
      },
      content: html,
      footer: function (currentPage, pageCount) {
        return [
          {
            text: currentPage.toString() + ' de ' + pageCount,
            alignment: 'right',
            margin: [25, 20],
          },
        ];
      },
      images: {
        logo: 'data:image/png;base64,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',
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }


  //Modal clientes
  openClientes(Clientes: any) {
    console.log("Entra modal clientes");
    this.bCargandoClientes = true;
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

  obtenNombreCliente(cliente: number): string {   
    let nombre: string = '';  
  
      for(var cliCon of this.oCliente.Contenido){ 
        if (cliCon.ClienteCodigo == String(cliente)){
          nombre = cliCon.RazonSocial;
          break;
        }             
         
    }
    return nombre;
  }

  getTotal(oPedido: Pedido[], idCol: string): number {   
    console.log("Entra total-------")
    let Total: number = 0;

    switch(idCol) {        
      case 'CantidadPedida': { 
   
        for(var detPed of oPedido){ 
          Total += detPed.CantidadPedida;    
        }
        break; 
      } 
      case 'DiferenciaPedidosSurtido': { 
   
        for(var detPed of oPedido){ 
          Total += detPed.DiferenciaPedidosSurtido;    
        }
        break; 
      } 
    
    }   
   
    Total = Number(Total.toFixed(2));
    return Total; 
   }

  getTotalPedido(oDetallePed: PedidoArticulo[], idCol: string): number {  
    console.log("Entra ---------") ;
    let Total: number = 0;

    switch(idCol) {        
      case 'CantidadPedida': { 
   
        for(var detPed of oDetallePed){ 
          Total += detPed.CantidadPedida;    
        }
        break; 
      } 
      case 'CantidadPedidoProduccion': { 
   
        for(var detPed of oDetallePed){ 
          Total += detPed.CantidadPedidoProduccion;    
        }
        break; 
      } 
      case 'CantidadProducida': { 
   
        for(var detPed of oDetallePed){ 
          Total += detPed.CantidadProducida;    
        }
        break; 
      } 
      case 'CantidadSurtida': { 
   
        for(var detPed of oDetallePed){ 
          Total += detPed.CantidadSurtida;    
        }
        break; 
      } 
      case 'DiferenciaProducido': { 
   
        for(var detPed of oDetallePed){ 
          Total += detPed.DiferenciaProducido;    
        }
        break; 
      } 
    }   
   
    Total = Number(Total.toFixed(2));
    return Total; 
   }

   TablaPedidos(): string
   {
 
     var tabla = "";
     var con=1;

     tabla =' <table  class="table table-hover table-striped" datatable [dtOptions]="dtOptions"  >' + '\n'+
              ' <thead>' + '\n'+
                ' <tr class="EncTabla">' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white;" scope="col" >#</th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white;" scope="col">L</th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white; " scope="col">PEDIDO</th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white; " scope="col">OF</th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white;" scope="col">S</th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align: center;" scope="col"><div class="size">FECHA PED</div></th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align: center;" scope="col"><div class="size">FECHA CANCOP</div></th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align: center;" scope="col"><div class="size">FECHA SURT</div></th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;">PEDIDO</th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;" scope="col">SURTIDO</th>' + '\n'+
                  ' <th style="background-color: #24a4cc; color: white; text-align:right;" scope="col">DIFCIA</th>' + '\n'+
                ' </tr>' + '\n'+
              ' </thead>' + '\n'+
              ' <tbody>' + '\n'

              this.pedido.forEach(function(ped){
                 
                tabla = tabla +   '<tr >' + '\n' +
                
                  '<th scope="row"> '+con+' </th>'+'\n'+
                  ' <td class="FilasFonelli" style="text-align:left">'+ ped.PedidoLetra+'</td>' +'\n'+
                  ' <td class="FilasFonelli"> '+ped.PedidoFolio+' </td>                ' +'\n'+
                  ' <td class="FilasFonelli">'+ ped.OficinaFonelliCodigo+'</td>' +'\n'+
                  ' <td class="FilasFonelli" style="text-align:left">'+ ped.Status+'</td>' +'\n'+
                  ' <td class="FilasFonelli" style="text-align:left">'+ ped.FechaPedido+'</td>' +'\n'+
                  ' <td class="FilasFonelli" style="text-align:left">'+ ped.FechaCancelacion+'</td>' +'\n'+
                  ' <td class="FilasFonelli" style="text-align:left">'+ ped.FechaSurtido+'</td>' +'\n'+
                  ' <td class="FilasFonelli" style="text-align:right">'+ ped.CantidadPedida+'</td>' +'\n'+
                  ' <td class="FilasFonelli" style="text-align:right">'+ ped.CantidadSurtida+'</td>' +'\n'+
                  ' <td class="FilasFonelli" style="text-align:right">'+ ped.DiferenciaPedidosSurtido+'</td>' +'\n'+
                '</tr>'+'\n';

                con +=1;
              });

              tabla = tabla +  '<tr>'+'\n'+
              '<th ></th>'+'\n'+
              ' <td ></td>'+'\n'+
              ' <td ></td>'+'\n'+
              ' <td ></td>'+'\n'+
              ' <td ></td>'+'\n'+
              ' <td ></td>'+'\n'+
              ' <td ></td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align:left">Total General</td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align:right"> '+this.oPedidoRes.Contenido.CantidadPedida+'</td>'+'\n'+
              ' <td ></td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align:right"> '+this.oPedidoRes.Contenido.DiferenciaPedidosSurtido+'</td>'+'\n'+
            '</tr>'+'\n'+
          '</tbody>'+'\n'+
        '</table>';
 
        return tabla;
 
 
   }

  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    localStorage.clear();
    this._router.navigate(['/']);
  }
}
