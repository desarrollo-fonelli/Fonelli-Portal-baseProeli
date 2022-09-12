import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs';

import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

//Modelos
import { FiltrosClientesInactivos } from 'src/app/models/clientesinactivos.filtros';
import { ClienteInactivo, SaldosCarteraCliente, VencidosSaldosCartera, Cliente, Contenido} from 'src/app/models/clientesinactivos';
import { FiltrosAgente } from 'src/app/models/agentes.filtros';
import { Agentes, Contenido as AgentesCon } from 'src/app/models/agentes';





//Servicios
import { ServicioConsultaInactivos } from 'src/app/services/consultainactivos.service';
import { ServicioAgentes } from 'src/app/services/agentes.service';



import { ServicioConsultaPedidos } from 'src/app/services/consultapedidos.service';
import { ServicioDetallePedido } from 'src/app/services/detallepedido.service';
import { ServicioClientes } from 'src/app/services/clientes.service';


@Component({
  selector: 'app-consultainactivos',
  templateUrl: './consultainactivos.component.html',
  styleUrls: ['./consultainactivos.component.css'],
  providers: [ServicioConsultaPedidos, ServicioDetallePedido, DecimalPipe, ServicioClientes, ServicioAgentes, ServicioConsultaInactivos],
})
export class ConsultainactivosComponent implements OnInit, OnDestroy {
  @ViewChild('pdfTable') pdfTable: ElementRef;

  searchtext = '';

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;


  public isCollapsed = false;

  sCodigo: number | null;
  sTipo: string | null;
  sFilial: number | null;
  sNombre: string | null;

  public bCliente: boolean;

  oBuscar: FiltrosClientesInactivos;
  oClientesInacRes: ClienteInactivo;


  public bError: boolean = false;
  public sMensaje: string = '';
  bBandera = false;
  bBanderaDet = false;
  bBanderaDetPro = false;
  bBanderaBtnPro = true;
  bBanderaBtnPed = false;

  fechaHoy: String;
  fechaFron: String;


  public bCargando: boolean = false;
  public bCargandoClientes: boolean = false;

  page = 1;
  pageSize = 4;
  collectionSize = 0;
  //countries: Country[];

  closeResult = '';
  public ModalActivo?: NgbModalRef;

  mobileQuery: MediaQueryList;


  public oBuscarAgentes: FiltrosAgente;
  public oAgentes: Agentes; 
  public oAgentesCon: AgentesCon[];

  //Banderas para constrol de columnas
  bBanCtaCorrMN_SAL = false;
  bBanCtaCorrORO_SAL = false;
  bBanCtaCorrDLLS_SAL = false;
  bBanCtaDocMN_SAL = false;
  bBanCtaDocORO_SAL = false;
  bBanCtaDocDLLS_SAL = false;

  bBanCtaCorrMN_VEN = false;
  bBanCtaCorrORO_VEN = false;
  bBanCtaCorrDLLS_VEN = false;
  bBanCtaDocMN_VEN = false;
  bBanCtaDocORO_VEN = false;
  bBanCtaDocDLLS_VEN = false;

  //valores de columnas
  sColSaldo: string;
  sColVencido: string;
  
  sWidth: number;
  sHeight: number;
  
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,        
    private modalService: NgbModal,    
    private _servicioAgentes: ServicioAgentes,
    private _servicioConsultaInactivos: ServicioConsultaInactivos,
    
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
    this.oBuscar = new FiltrosClientesInactivos(0, 0, 0);
    this.oClientesInacRes = {} as ClienteInactivo;


}

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: false,
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
          
        }
      ]
   
      
    };

    this.sWidth = screen.width;
    this.sHeight = (screen.height/2);
    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    switch(this.sTipo) {  
      case 'A': { 
         //Agente;         
         this.bCliente = false;    
        // this.oBuscar.Status = 'A';         
         break; 
      } 
      default: { 
         //Gerente; 
        //this.oBuscar.Usuario = this.sCodigo;
         this.bCliente = false; 
        // this.oBuscar.Status = 'A';   
         break; 
      } 
   } 
    let date: Date = new Date();
    let mes;

    // Resto un dia porque la datasource tiene un día de atraso
    date.setDate(date.getDate() - 1);

    //Valida mes
    if (date.getMonth().toString().length == 1) {
      mes = '0' + (date.getMonth() + 1);
    }

    this.fechaHoy = date.getDate() + '-' + mes + '-' + date.getFullYear();    
    this.fechaFron = date.getDate() + '/' + mes + '/' + date.getFullYear();    
    

      //Consulta agentes
      if (!localStorage.getItem('Agentes')){

        this._servicioAgentes
        .Get(this.oBuscarAgentes)
        .subscribe(
          (Response: Agentes) =>  {
            
    
            this.oAgentes = Response;
    
            console.log("Respuesta agentes"+JSON.stringify(this.oAgentes));
    
    
            if(this.oAgentes.Codigo != 0){
              this.bError= true;
              this.sMensaje="No se encontraron agentes";   
              return false;
            }
       
            this.oAgentesCon = this.oAgentes.Contenido;
    
            if (this.sTipo == 'A'){
              this.oBuscar.AgenteDesde = this.sCodigo;
              this.oBuscar.AgenteHasta = this.sCodigo;
            }else{
              this.oBuscar.AgenteDesde = Number(this.oAgentes.Contenido[0].AgenteCodigo); 
              this.oBuscar.AgenteHasta = Number(this.oAgentes.Contenido[this.oAgentes.Contenido?.length - 1].AgenteCodigo); 
            }
            
            return true;
    
         
          },
          (error:Agentes) => {
    
            this.oAgentes = error;
    
            console.log("error");
            console.log(this.oAgentes);
    
            return false;
         
          }
          
        );
      
      }else{//Ya tenemos agentes
        //console.log("Ya tenemos agentes");
  
        this.oAgentesCon = JSON.parse(localStorage.getItem('Agentes'));
    
            if (this.sTipo == 'A'){
              this.oBuscar.AgenteDesde = this.sCodigo;
              this.oBuscar.AgenteHasta = this.sCodigo;
            }else{
              this.oBuscar.AgenteDesde = Number(this.oAgentesCon[0].AgenteCodigo); 
              this.oBuscar.AgenteHasta = Number( this.oAgentesCon[ this.oAgentesCon?.length - 1].AgenteCodigo); 
            }
  
  
      }

      


  }

  //Funcion para consultar los clientes inactivos con saldo
  consultaCliInacSal() {

    //Seteamos valores iniciales de columnas
    this.bBanCtaCorrMN_SAL = false;
    this.bBanCtaCorrORO_SAL = false;
    this.bBanCtaCorrDLLS_SAL = false;
    this.bBanCtaDocMN_SAL = false;
    this.bBanCtaDocORO_SAL = false;
    this.bBanCtaDocDLLS_SAL = false;
  
    this.bBanCtaCorrMN_VEN = false;
    this.bBanCtaCorrORO_VEN = false;
    this.bBanCtaCorrDLLS_VEN = false;
    this.bBanCtaDocMN_VEN = false;
    this.bBanCtaDocORO_VEN = false;
    this.bBanCtaDocDLLS_VEN = false;

    this.sColSaldo = '1';
    this.sColVencido = '1';

    this.bBandera = false;
    console.log('consulta inactivos');
    this.bCargando = true;

    //Inicializamos el tipo de usuario por el momento  
    console.log(this.oBuscar);

    //Realizamos llamada al servicio de pedidos
    this._servicioConsultaInactivos.Get(this.oBuscar).subscribe(
      (Response: ClienteInactivo) => {
        this.oClientesInacRes = Response;
        //this.pedido = this.oPedidoRes.Contenido.Pedidos;

        console.log("respuesta clientes inactivos : "+JSON.stringify(this.oClientesInacRes));
        
        if (this.oClientesInacRes.Codigo != 0) {
          this.bError = true;
          this.sMensaje = 'No se encontraron datos de clientes inactivos.';
          this.bBandera = false;
          this.bCargando = false;
          return;
        }
        //Gestion de columnas

        for(var cliCon of this.oClientesInacRes.Contenido){
          for(var cli of cliCon.Clientes ){
            //Recorre saldos
            for(var saldos of cli.SaldosCarteraCliente ){
              if(saldos.TipoCarteraCodigo == '1' && !this.bBanCtaCorrMN_SAL){
                this.bBanCtaCorrMN_SAL = true;
                Number(this.sColSaldo) < 0 ? this.sColSaldo = '1' : this.sColSaldo = this.sColSaldo;
              }
              if(saldos.TipoCarteraCodigo == '2' && !this.bBanCtaCorrORO_SAL){
                this.bBanCtaCorrORO_SAL = true;
                Number(this.sColSaldo) < 1 ? this.sColSaldo = '2' : this.sColSaldo = this.sColSaldo; 
              }
              if(saldos.TipoCarteraCodigo == '3' && !this.bBanCtaCorrDLLS_SAL){
                this.bBanCtaCorrDLLS_SAL = true;
                Number(this.sColSaldo) < 2 ? this.sColSaldo = '3' : this.sColSaldo = this.sColSaldo; 
              }
              if(saldos.TipoCarteraCodigo == '6' && !this.bBanCtaDocMN_SAL){
                this.bBanCtaDocMN_SAL = true;
                Number(this.sColSaldo) < 3 ? this.sColSaldo = '4' : this.sColSaldo = this.sColSaldo; 
                
              }
              if(saldos.TipoCarteraCodigo == '7' && !this.bBanCtaDocORO_SAL){
                this.bBanCtaDocORO_SAL = true;
                Number(this.sColSaldo) < 4 ? this.sColSaldo = '5' : this.sColSaldo = this.sColSaldo; 
              }
              if(saldos.TipoCarteraCodigo == '8' && !this.bBanCtaDocDLLS_SAL){
                this.bBanCtaDocDLLS_SAL = true;
                Number(this.sColSaldo) < 5 ? this.sColSaldo = '6' : this.sColSaldo = this.sColSaldo; 
              }
            
            
            }
            //Recorre saldos vencidos
            for(var vencidos of cli.VencidosSaldosCartera ){
              if(vencidos.TipoCarteraCodigo == '1' && !this.bBanCtaCorrMN_VEN){                
                this.bBanCtaCorrMN_VEN = true;
                Number(this.sColVencido) < 0 ? this.sColVencido = '1' : this.sColVencido = this.sColVencido;
                
              }
              if(vencidos.TipoCarteraCodigo == '2' && !this.bBanCtaCorrORO_VEN){
                this.bBanCtaCorrORO_VEN = true;
                Number(this.sColVencido) < 1 ? this.sColVencido = '2' : this.sColVencido = this.sColVencido;
              }
              if(vencidos.TipoCarteraCodigo == '3' && !this.bBanCtaCorrDLLS_VEN){
                this.bBanCtaCorrDLLS_VEN = true;
                Number(this.sColVencido) < 2 ? this.sColVencido = '3' : this.sColVencido = this.sColVencido;
              }
              if(vencidos.TipoCarteraCodigo == '6' && !this.bBanCtaDocMN_VEN){                
                this.bBanCtaDocMN_VEN = true;
                Number(this.sColVencido) < 3 ? this.sColVencido = '4' : this.sColVencido = this.sColVencido;
                
              }
              if(vencidos.TipoCarteraCodigo == '7' && !this.bBanCtaDocORO_VEN){
                this.bBanCtaDocORO_VEN = true;
                Number(this.sColVencido) < 4 ? this.sColVencido = '5' : this.sColVencido = this.sColVencido;
              }
              if(vencidos.TipoCarteraCodigo == '8' && !this.bBanCtaDocDLLS_VEN){
                this.bBanCtaDocDLLS_VEN = true;
                Number(this.sColVencido) < 5 ? this.sColVencido = '6' : this.sColVencido = this.sColVencido;
              }
            
            }            
          }
        }
        
        console.log("General"+this.sColSaldo);
        console.log("General"+this.sColVencido);


        //Control para eventos
        for(var cliCon of this.oClientesInacRes.Contenido){
          for(var cli of cliCon.Clientes ){
           //Totales cartera cliente
           cli.CtaCorrMN_SAL = this.formatoMoneda(this.getSaldosCartera(cli.SaldosCarteraCliente,'1'));
           cli.CtaCorrORO_SAL = this.formatoMoneda(this.getSaldosCartera(cli.SaldosCarteraCliente,'2'));
           cli.CtaCorrDLLS_SAL = this.formatoMoneda(this.getSaldosCartera(cli.SaldosCarteraCliente,'3'));
           cli.CtaDocMN_SAL = this.formatoMoneda(this.getSaldosCartera(cli.SaldosCarteraCliente,'6'));
           cli.CtaDocORO_SAL = this.formatoMoneda(this.getSaldosCartera(cli.SaldosCarteraCliente,'7'));
           cli.CtaDocDLLS_SAL = this.formatoMoneda(this.getSaldosCartera(cli.SaldosCarteraCliente,'8'));
           cli.CtaCorrMN_VEN = this.formatoMoneda(this.getVencidosCartera(cli.VencidosSaldosCartera,'1'));
           cli.CtaCorrORO_VEN = this.formatoMoneda(this.getVencidosCartera(cli.VencidosSaldosCartera,'2'));
           cli.CtaCorrDLLS_VEN = this.formatoMoneda(this.getVencidosCartera(cli.VencidosSaldosCartera,'3'));
           cli.CtaDocMN_VEN = this.formatoMoneda(this.getVencidosCartera(cli.VencidosSaldosCartera,'6'));
           cli.CtaDocORO_VEN = this.formatoMoneda(this.getVencidosCartera(cli.VencidosSaldosCartera,'7'));
           cli.CtaDocDLLS_VEN = this.formatoMoneda(this.getVencidosCartera(cli.VencidosSaldosCartera,'8'));
           
          
          }
          //Totales agente
          cliCon.CtaCorrMN_SAL = this.formatoMoneda(this.getTotalesAgenteSaldos(cliCon.Clientes,'1'));
          cliCon.CtaCorrORO_SAL = this.formatoMoneda(this.getTotalesAgenteSaldos(cliCon.Clientes,'2'));
          cliCon.CtaCorrDLLS_SAL = this.formatoMoneda(this.getTotalesAgenteSaldos(cliCon.Clientes,'3'));
          cliCon.CtaDocMN_SAL = this.formatoMoneda(this.getTotalesAgenteSaldos(cliCon.Clientes,'6'));
          cliCon.CtaDocORO_SAL = this.formatoMoneda(this.getTotalesAgenteSaldos(cliCon.Clientes,'7'));
          cliCon.CtaDocDLLS_SAL = this.formatoMoneda(this.getTotalesAgenteSaldos(cliCon.Clientes,'8'));
          cliCon.CtaCorrMN_VEN = this.formatoMoneda(this.getTotalesAgenteVencidos(cliCon.Clientes,'1'));
          cliCon.CtaCorrORO_VEN = this.formatoMoneda(this.getTotalesAgenteVencidos(cliCon.Clientes,'2'));
          cliCon.CtaCorrDLLS_VEN = this.formatoMoneda(this.getTotalesAgenteVencidos(cliCon.Clientes,'3'));
          cliCon.CtaDocMN_VEN = this.formatoMoneda(this.getTotalesAgenteVencidos(cliCon.Clientes,'6'));
          cliCon.CtaDocORO_VEN = this.formatoMoneda(this.getTotalesAgenteVencidos(cliCon.Clientes,'7'));
          cliCon.CtaDocDLLS_VEN = this.formatoMoneda(this.getTotalesAgenteVencidos(cliCon.Clientes,'8'));
        }

        //Totales general
        this.oClientesInacRes.CtaCorrMN_SAL = this.formatoMoneda(this.getTotalesGeneralSaldos(this.oClientesInacRes.Contenido,'1'));
        this.oClientesInacRes.CtaCorrORO_SAL = this.formatoMoneda(this.getTotalesGeneralSaldos(this.oClientesInacRes.Contenido,'2'));
        this.oClientesInacRes.CtaCorrDLLS_SAL = this.formatoMoneda(this.getTotalesGeneralSaldos(this.oClientesInacRes.Contenido,'3'));
        this.oClientesInacRes.CtaDocMN_SAL = this.formatoMoneda(this.getTotalesGeneralSaldos(this.oClientesInacRes.Contenido,'6'));
        this.oClientesInacRes.CtaDocORO_SAL = this.formatoMoneda(this.getTotalesGeneralSaldos(this.oClientesInacRes.Contenido,'7'));
        this.oClientesInacRes.CtaDocDLLS_SAL = this.formatoMoneda(this.getTotalesGeneralSaldos(this.oClientesInacRes.Contenido,'8'));
        this.oClientesInacRes.CtaCorrMN_VEN = this.formatoMoneda(this.getTotalesGeneralVencidos(this.oClientesInacRes.Contenido,'1'));
        this.oClientesInacRes.CtaCorrORO_VEN = this.formatoMoneda(this.getTotalesGeneralVencidos(this.oClientesInacRes.Contenido,'2'));
        this.oClientesInacRes.CtaCorrDLLS_VEN = this.formatoMoneda(this.getTotalesGeneralVencidos(this.oClientesInacRes.Contenido,'3'));
        this.oClientesInacRes.CtaDocMN_VEN = this.formatoMoneda(this.getTotalesGeneralVencidos(this.oClientesInacRes.Contenido,'6'));
        this.oClientesInacRes.CtaDocORO_VEN = this.formatoMoneda(this.getTotalesGeneralVencidos(this.oClientesInacRes.Contenido,'7'));
        this.oClientesInacRes.CtaDocDLLS_VEN = this.formatoMoneda(this.getTotalesGeneralVencidos(this.oClientesInacRes.Contenido,'8'));

        

        this.sMensaje = '';
        this.bBandera = true;        
        this.bCargando = false;
        this.isCollapsed = true;


        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next("");
        });

      },
      (error: ClienteInactivo) => {
        this.sMensaje = 'No se encontraron datos de clientes inactivos.';
        console.log('error');

        this.bCargando = false;
      }
    );
  }


  downloadAsPDF() {
    const pdfTable = this.pdfTable.nativeElement;
    console.log(pdfTable);

    //var cadenaaux = pdfTable.innerHTML;

    var cadenaaux = this.TablaInactivos(this.bBanCtaCorrMN_SAL, this.bBanCtaCorrORO_SAL, this.bBanCtaCorrDLLS_SAL, this.bBanCtaDocMN_SAL, this.bBanCtaDocORO_SAL, this.bBanCtaDocDLLS_SAL, this.bBanCtaCorrMN_VEN, 
      this.bBanCtaCorrORO_VEN, this.bBanCtaCorrDLLS_VEN, this.bBanCtaDocMN_VEN, this.bBanCtaDocORO_VEN, this.bBanCtaDocDLLS_VEN);

    let cadena =
      '<br><p>Agende desde: <strong>' +this.oBuscar.AgenteDesde +' - '+ this.obtenNombreAgente(this.oBuscar.AgenteDesde)+'<br></strong> Agente Hasta: <strong>' +this.oBuscar.AgenteHasta +' - '+this.obtenNombreAgente(this.oBuscar.AgenteHasta)+'</strong></p>' +      
      cadenaaux;

    console.log('cadena');
    console.log(cadena);

    var html = htmlToPdfmake(cadena);
   html[2].table.headerRows= 2;
   console.log('html'); 
   console.log(html);
    const documentDefinition = {
    
      pageSize: {
        width: 1800,
        height: 820
      },
      pageOrientation: 'landscape',
      header: [
  
      {
      alignment: 'justify',
      columns: [
        { 
          image: 'logo', 
          margin: [25,13],
          heigth: 40, 
          width: 160 
        },
      {
        width:1050,
        text: 'Consulta de inactivos',
        alignment: 'center',
        style: 'header',
        margin: [8,8]    
      },
      {
        width: 120,
        text: this.fechaHoy, 
        alignment: 'right',
        margin: [2, 15]
      }
      ]
      }
      ],
      
      styles: {
      header: {
      fontSize: 22,
      bold: true,
      color: '#24a4cc'
      },
      numeracion: {
      fontSize: 12
      
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


  getSaldosCartera(saldos: SaldosCarteraCliente[], idCartera: string): number {
    let Total: number = 0;

    for(var sal of saldos){
      if(sal.TipoCarteraCodigo == idCartera){
        Total = Number(sal.TotalAgenteSaldoTipoCartera.toFixed(2));
        
      }
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getVencidosCartera(vencidos: VencidosSaldosCartera[], idCartera): number {
    let Total: number = 0;

    for(var ven of vencidos){
      if(ven.TipoCarteraCodigo == idCartera){
        Total = Number(ven.TotalAgenteVencidoTipoCartera.toFixed(2));
        
      }
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalesAgenteSaldos(clientes: Cliente[], idCartera: string): number {
    let Total: number = 0;

    for(var cli of clientes){
      for(var sal of cli.SaldosCarteraCliente){
        if(sal.TipoCarteraCodigo == idCartera){        
          Total = Total + Number(sal.TotalAgenteSaldoTipoCartera.toFixed(2));
        }        
      }      
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalesAgenteVencidos(clientes: Cliente[], idCartera: string): number {
    let Total: number = 0;

    for(var cli of clientes){
      for(var sal of cli.VencidosSaldosCartera){
        if(sal.TipoCarteraCodigo == idCartera){        
          Total = Total + Number(sal.TotalAgenteVencidoTipoCartera.toFixed(2));
        }        
      }      
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalesGeneralSaldos(contenido: Contenido[], idCartera: string): number {
    let Total: number = 0;

    for(var con of contenido){
      for(var cli of con.Clientes){
        for(var sal of cli.SaldosCarteraCliente){
          if(sal.TipoCarteraCodigo == idCartera){        
            Total = Total + Number(sal.TotalAgenteSaldoTipoCartera.toFixed(2));
          }  
        }
                
      }      
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }

  getTotalesGeneralVencidos(contenido: Contenido[], idCartera: string): number {
    let Total: number = 0;

    for(var con of contenido){
      for(var cli of con.Clientes){
        for(var sal of cli.VencidosSaldosCartera){
          if(sal.TipoCarteraCodigo == idCartera){        
            Total = Total + Number(sal.TotalAgenteVencidoTipoCartera.toFixed(2));
          }  
        }
                
      }      
    }
    Total = Number(Total.toFixed(2));
    return Total; 
  }


  formatoMoneda(number){
    return new Intl.NumberFormat('en-US', {currency: 'USD', maximumFractionDigits: 2}).format(number);
  };

  obtenNombreAgente(agente: number): string {   
    let nombre: string = '';  
  
      for(var ageCon of this.oAgentesCon){ 
        if (ageCon.AgenteCodigo == String(agente)){
          nombre = ageCon.AgenteNombre;
          break;
        }             
         
    }
    return nombre;
  }
  


  TablaInactivos(bBanCtaCorrMN_SAL, bBanCtaCorrORO_SAL, bBanCtaCorrDLLS_SAL, bBanCtaDocMN_SAL, bBanCtaDocORO_SAL, bBanCtaDocDLLS_SAL, bBanCtaCorrMN_VEN, bBanCtaCorrORO_VEN, bBanCtaCorrDLLS_VEN, bBanCtaDocMN_VEN, bBanCtaDocORO_VEN, bBanCtaDocDLLS_VEN): string
  {

  var tabla = "";


  tabla = tabla +   ' <table  class="table table-hover table-striped" ' + '\n' +
            ' <thead>' + '\n' ;

            tabla = tabla +    ' <tr class="EncTabla">' + '\n' +                 
            ' <th  colspan="7" class="table-warning" scope="col"></th>' + '\n' +
            ' <th class="table-warning" scope="col" colspan=6 style="text-align:center; color: #24a4cc;">SALDO TOTAL</th>  ' + '\n' +
            ' <th class="table-success" scope="col" colspan=6 style="text-align:center; color: #24a4cc;">SALDO VENCIDO</th>' + '\n' +
            ' <th colspan="2" style="text-align:center; background-color:#24a4cc;"></th>' + '\n' +

          ' </tr>' + '\n' ;



          
     tabla = tabla +         ' <tr class="EncTabla">' + '\n' +
              ' <th style="background-color: #24a4cc; color: white;" scope="col" >CLIENTE</th>' + '\n' +
              ' <th style="background-color: #24a4cc; color: white;" scope="col">FIL</th>' + '\n' +
              ' <th style="background-color: #24a4cc; color: white; " scope="col">NOMBRE</th>' + '\n' +
              ' <th style="background-color: #24a4cc; color: white; " scope="col">SUCURSAL</th>' + '\n' +
              ' <th style="background-color: #24a4cc; color: white;" scope="col">L1</th>' + '\n' +
              ' <th style="background-color: #24a4cc; color: white; text-align: center;" scope="col">L2</th>' + '\n' +
              ' <th style="background-color: #24a4cc; color: white; text-align: center;" scope="col">PLAZO</th>' + '\n';


             
                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align: center;" scope="col">CTACORR_MN</th>' + '\n';
        
                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align:right;">CTACORR_ORO</th>' + '\n' ;
            
                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align:right;">CTACORR_DLLS</th>' + '\n' ;

                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align:right;" scope="col">CTADOC_MN</th>            ' + '\n' ;

                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align:right;" scope="col">CTADOC_ORO</th>            ' + '\n' ;
        
                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align:right;" scope="col">CTADOC_DLLS</th>            ' + '\n' ;
             
                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align: center;" scope="col">CTACORR_MN</th>' + '\n' ;
             
                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align:right;">CTACORR_ORO</th>' + '\n' ;
             
                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align:right;">CTACORR_DLLS</th>' + '\n' ;
        
                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align:right;" scope="col">CTADOC_MN</th>            ' + '\n' ;
            
                tabla = tabla+
                ' <th style="background-color: #24a4cc; color: white; text-align:right;" scope="col">CTADOC_ORO</th>            ' + '\n' ;
             
                tabla = tabla+
                ' <th  style="background-color: #24a4cc; color: white; text-align:right;" scope="col">CTADOC_DLLS</th>            ' + '\n' ;
             
              
              tabla = tabla+
              ' <th style="background-color: #24a4cc; color: white; text-align:right;" scope="col">DÍAS</th>' + '\n' +
              ' <th style="background-color: #24a4cc; color: white; text-align:right;" scope="col">PED</th>' + '\n' +
            ' </tr>' + '\n' +
            ' </thead>' + '\n' +
            ' <tbody>' + '\n';

            this.oClientesInacRes.Contenido.forEach(function(con){
              tabla = tabla +
              ' <tr class="table-info">' + '\n' +
                ' <td class="FilasFonelli">Agente</td>   ' + '\n' +
                ' <td>'+con.AgenteCodigo+'</td>' + '\n' +
                ' <td>'+con.AgenteNombre+'</td>' + '\n' +
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' ;

              
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
              
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
                
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
            
                  tabla = tabla+
                  ' <td ></td>            ' + '\n' ;
            
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
          
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
               
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
              
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
              
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
             
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
               
  
               
                  tabla = tabla+
                  ' <td ></td>' + '\n' ;
              
  
              
                  tabla = tabla+
                  ' <td ></td> ' + '\n' ;
    
                tabla = tabla+
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' +
              ' </tr>' + '\n';
             


              
              con.Clientes.forEach(function(cli){
                tabla = tabla +   
                '<tr >' + '\n' +
                  ' <td class="FilasFonelli" style="text-align:left">'+ cli.ClienteCodigo+'</td>' + '\n' +
                  ' <td class="FilasFonelli"> '+cli.ClienteFilial +'</td>' + '\n' +
                  ' <td class="FilasFonelli" >'+ cli.ClienteNombre+'</td>' + '\n' +
                  ' <td class="FilasFonelli" style="text-align:left">'+ cli.ClienteSucursal+'</td>' + '\n' +
                  ' <td class="FilasFonelli" style="text-align:left">'+ cli.Lista1+'</td>' + '\n' +
                  ' <td class="FilasFonelli" style="text-align:left">'+ cli.Lista2+'</td>' + '\n' +
                  ' <td class="FilasFonelli" style="text-align:left">'+ cli.Plazo+'</td>               ' + '\n' ;


              
                    tabla = tabla+
                    ' <td  class="table-warning FilasFonelli" style="text-align:right">'+ cli.CtaCorrMN_SAL+'</td>' + '\n' ;
                 
                    tabla = tabla+
                    ' <td  class="table-warning FilasFonelli" style="text-align:right">'+ cli.CtaCorrORO_SAL+'</td>' + '\n' ;
               
                    tabla = tabla+
                    ' <td  class="table-warning FilasFonelli" style="text-align:right">'+ cli.CtaCorrDLLS_SAL+'</td>' + '\n' ;
                  
                    tabla = tabla+
                    ' <td class="table-warning FilasFonelli" style="text-align:right">'+ cli.CtaDocMN_SAL+'</td>' + '\n' ;
              
                    tabla = tabla+
                    ' <td  class="table-warning FilasFonelli" style="text-align:right">'+ cli.CtaDocORO_SAL+'</td>' + '\n' ;
           
                    tabla = tabla+
                    ' <td  class="table-warning FilasFonelli" style="text-align:right">'+ cli.CtaDocDLLS_SAL+'</td>' + '\n' ;
          
                    tabla = tabla+
                    ' <td  class="table-success FilasFonelli" style="text-align:right">'+ cli.CtaCorrMN_VEN+'</td>' + '\n' ;
              
                  
                    tabla = tabla+
                    ' <td  class="table-success FilasFonelli" style="text-align:right">'+ cli.CtaCorrORO_VEN+'</td>' + '\n' ;
                  
                    tabla = tabla+
                    ' <td class="table-success FilasFonelli" style="text-align:right">'+ cli.CtaCorrDLLS_VEN+'</td>' + '\n' ;
                
                    tabla = tabla+
                    ' <td class="table-success FilasFonelli" style="text-align:right">'+ cli.CtaDocMN_VEN+'</td> ' + '\n' ;
          
                    tabla = tabla+
                    ' <td  class="table-success FilasFonelli" style="text-align:right">'+ cli.CtaDocORO_VEN+'</td> ' + '\n' ;
         
                    tabla = tabla+
                    ' <td class="table-success FilasFonelli" style="text-align:right">'+ cli.CtaDocDLLS_VEN+'</td> ' + '\n' ;
             
                  tabla = tabla+
                  ' <td class="FilasFonelli" style="text-align:right">'+ cli.DiasAtraso+'</td>' + '\n' +
                  ' <td class="FilasFonelli" style="text-align:left">'+ cli.PedidosActivos+'</td>' + '\n' +
                  
                ' </tr>' + '\n' ;
              });

              tabla = tabla +   
              ' <tr>' + '\n' +     
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' +
                ' <td class="FilasFonBold" style="text-align:right">Total agente</td>               ' + '\n' ;
  
  
       
                  tabla = tabla+
                  ' <td  class="table-warning FilasFonBold" style="text-align:right">'+ con.CtaCorrMN_SAL+'</td>' + '\n' ;
      
                  tabla = tabla+
                  ' <td  class="table-warning FilasFonBold" style="text-align:right">'+ con.CtaCorrORO_SAL+'</td>' + '\n' ;
        
                  tabla = tabla+
                  ' <td  class="table-warning FilasFonBold" style="text-align:right">'+ con.CtaCorrDLLS_SAL+'</td>' + '\n' ;
           
                  tabla = tabla+
                  ' <td  class="table-warning FilasFonBold" style="text-align:right">'+ con.CtaDocMN_SAL+'</td>' + '\n' ;
        
                  tabla = tabla+
                  ' <td * class="table-warning FilasFonBold" style="text-align:right">'+ con.CtaDocORO_SAL+'</td>' + '\n' ;
            
                  tabla = tabla+
                  ' <td  class="table-warning FilasFonBold" style="text-align:right">'+ con.CtaDocDLLS_SAL+'</td>' + '\n' ;
              
                  tabla = tabla+
                  ' <td  class="table-success FilasFonBold" style="text-align:right">'+ con.CtaCorrMN_VEN+'</td>' + '\n' ;
             
                  tabla = tabla+
                  ' <td class="table-success FilasFonBold" style="text-align:right">'+ con.CtaCorrORO_VEN+'</td>' + '\n' ;
             
                  tabla = tabla+
                  ' <td  class="table-success FilasFonBold" style="text-align:right">'+ con.CtaCorrDLLS_VEN+'</td>' + '\n' ;
            
                  tabla = tabla+
                  ' <td class="table-success FilasFonBold" style="text-align:right">'+ con.CtaDocMN_VEN+'</td> ' + '\n' ;
               
                  tabla = tabla+
                  ' <td  class="table-success FilasFonBold" style="text-align:right">'+ con.CtaDocORO_VEN+'</td> ' + '\n' ;
           
                  tabla = tabla+
                  ' <td  class="table-success FilasFonBold" style="text-align:right">'+ con.CtaDocDLLS_VEN+'</td> ' + '\n' ;
             
                tabla = tabla+
                ' <td></td>' + '\n' +
                ' <td></td>' + '\n' +                
              ' </tr>' + '\n' ;

            });

            tabla = tabla +   
            ' <tr>     ' + '\n' +
              ' <td></td>' + '\n' +
              ' <td></td>' + '\n' +
              ' <td></td>' + '\n' +
              ' <td></td>' + '\n' +
              ' <td></td>' + '\n' +
              ' <td></td>' + '\n' +
              ' <td class="FilasFonBold" style="text-align:right">Total general</td>               ' + '\n' ;
  
           
                tabla = tabla+
                ' <td  class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaCorrMN_SAL +'</td>' + '\n' ;
    
                tabla = tabla+
                ' <td  class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaCorrORO_SAL +'</td>' + '\n' ;
        
                tabla = tabla+
                ' <td class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaCorrDLLS_SAL +'</td>' + '\n' ;
             
                tabla = tabla+
                ' <td class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaDocMN_SAL +'</td>' + '\n' ;
          
                tabla = tabla+
                ' <td class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaDocORO_SAL +'</td>' + '\n' ;
           
                tabla = tabla+
                ' <td  class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaDocDLLS_SAL +'</td>' + '\n' ;
             
                tabla = tabla+
                ' <td  class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaCorrMN_VEN +'</td>' + '\n' ;
           
  
          
                tabla = tabla+
                ' <td  class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaCorrORO_VEN +'</td>' + '\n' ;
           
                tabla = tabla+
                ' <td class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaCorrDLLS_VEN +'</td>' + '\n' ;
   
                tabla = tabla+
                ' <td  class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaDocMN_VEN +'</td> ' + '\n' ;
    
                tabla = tabla+
                ' <td  class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaDocORO_VEN +'</td> ' + '\n' ;
      
                tabla = tabla+
                ' <td  class="FilasFonBold" style="text-align:right">'+ this.oClientesInacRes.CtaDocDLLS_VEN +'</td> ' + '\n' ;
              
              tabla = tabla+
              ' <td></td>' + '\n' +
              ' <td></td>' + '\n' +              
              ' </tr>' + '\n'+    
            '</tbody>'+ '\n' +          
          '</table>'; 


        
  
  
          return tabla;      

   


  }


  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    localStorage.clear();
    this._router.navigate(['/']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next("");
  }


}




