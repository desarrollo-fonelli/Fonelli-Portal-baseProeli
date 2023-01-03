import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
  ,ViewChildren, OnDestroy, QueryList
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

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

//Modelos
import { FiltrosFichaTecnica } from 'src/app/models/fichatecnica.filtros';
import { FichaTecnica, VentasAnioA as AnioAnterior, VentasAnioA as AnioActual, ResumenCartera,PedidosActivos, Subcategorias ,VentasAnioA,Contenido as ftContenido  } from 'src/app/models/fichatecnica';


import {FiltrosClientes} from 'src/app/models/clientes.filtros';
import { Clientes } from 'src/app/models/clientes';
import { Contenido } from 'src/app/models/clientes';
import { Condiciones } from 'src/app/models/clientes';
import { DatosGenerales } from 'src/app/models/clientes';
import { Contactos } from 'src/app/models/clientes';


//Servicios
import { ServicioFichaTecnica } from 'src/app/services/fichatecnica.service';
import { ServicioClientes } from 'src/app/services/clientes.service';


@Component({
  selector: 'app-fichatecnica',
  templateUrl: './fichatecnica.component.html',
  styleUrls: ['./fichatecnica.component.css'],
  providers: [DecimalPipe, ServicioClientes,ServicioFichaTecnica]
})
export class FichatecnicaComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;

  searchtext = '';

  sCodigo: number | null;
  sTipo: string | null;
  sFilial: number | null;
  sNombre: string | null;

  public bCliente: boolean;

  @ViewChildren(DataTableDirective) 
  datatableElementList: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();

  oBuscar: FiltrosFichaTecnica;
  oFichaTecnicaRes: FichaTecnica;
  oAnioAnteriorRes: AnioAnterior[];
  oAnioActualRes: AnioActual[];
  oTipoCarteraRes: ResumenCartera[];
  oPedidosInactivosRes: PedidosActivos;

  public bError: boolean = false;
  public sMensaje: string = '';
  bBandera = false;
  bBanderaDet = false;
  bBanderaDetPro = false;
  bBanderaBtnPro = true;
  bBanderaBtnPed = false;
  public isCollapsed = false;
  

  fechaHoy: String;

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
  public oDatosCliente: Clientes; 
  public oContenido : Contenido;
  public oCondiciones : Condiciones;
  public oDatosGenerales : DatosGenerales;
  public oContacto : Contactos;
  public bMostrarDatos: boolean;

  //Busqueda de datos cliente detalle
  public BuscarCliente: FiltrosClientes;
  public oDatosClienteDet: Clientes; 
  public oContenidoDet : Contenido;
  public oCondicionesDet : Condiciones;
  public oDatosGeneralesDet : DatosGenerales;
  public oContactoDet : Contactos;
  public sClienteFil: string; 
  
  active = 1;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _route: ActivatedRoute,
    private _router: Router,
    private modalService: NgbModal,
    private _servicioCClientes: ServicioClientes,
    private _servicioFichaTecnica: ServicioFichaTecnica
    
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
    this.oBuscar = new FiltrosFichaTecnica(0,'',0,0,0,'','','','');
    this.oFichaTecnicaRes = {} as FichaTecnica;
    this.oFichaTecnicaRes.Contenido = {} as ftContenido;

    this.oPedidosInactivosRes = {} as PedidosActivos;


    this.Buscar = new FiltrosClientes(0, 0, 0,'', 0);
    this.oCliente={} as Clientes;
    this.oDatosCliente={} as Clientes;
    this.oContenido ={} as Contenido;
    this.oCondiciones ={} as Condiciones;
    this.oDatosGenerales ={} as DatosGenerales;
    this.oContacto ={} as Contactos;

    //Busqueda datos de cliente detalle
    this.BuscarCliente= new FiltrosClientes(0, 0, 0,'', 0);
    this.oDatosClienteDet={} as Clientes;
    this.oContenidoDet ={} as Contenido;
    this.oCondicionesDet ={} as Condiciones;
    this.oDatosGeneralesDet ={} as DatosGenerales;
    this.oContactoDet ={} as Contactos;

    this.bMostrarDatos = false;
}

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);

    this.dtOptions[0] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order:[],
      ordering:false,
      columnDefs: [
        { orderable: false, targets: "_all" } // Applies the option to all columns
      ],
      //dom: 'Bfrltip"',   dRendon 08.09.2022 voy a quitar "f" para no mostrar casilla de busqueda
      dom: 'lBtip',
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Ficha Tecnica - Ventas anterior',
          text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
          className: "btnExcel btn"          
        }        
      ],
      //columnDefs: [{"orderable": false, "targets": 0},{"orderable": false, "targets": 1},{"orderable": false, "targets": 2}]         
    };

    this.dtOptions[1] = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order:[],
      ordering:false,
      //dom: 'Bfrltip"',   dRendon 08.09.2022 voy a quitar "f" para no mostrar casilla de busqueda
      dom: 'lBtip',
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      buttons: [
        {
          extend: 'excelHtml5',
          title: 'Ficha Tecnica - Ventas actual',
          text: '<p style=" color: #f9f9f9; height: 9px;">Excel</p>',
          className: "btnExcel btn"          
        }        
      ]      
    };

    //Se agrega validacion control de sesion distribuidores
    if (!this.sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    switch(this.sTipo) { 
      case 'A': { 
         //Agente; 
         this.oBuscar.Usuario = this.sCodigo;
         this.bCliente = false;    
         this.oBuscar.FilialDesde = 0;         
         this.oBuscar.FilialHasta = 999;         
         break; 
      } 
      default: { 
         //Gerente; 
         this.oBuscar.Usuario = this.sCodigo;
         this.bCliente = false; 
         this.oBuscar.FilialDesde = 0;         
         this.oBuscar.FilialHasta = 999;           
         break; 
      } 
   } 

   

   this.Buscar.TipoUsuario = this.sTipo;
   this.Buscar.Usuario = this.sCodigo;

    let date: Date = new Date();
    let mes;

    //Valida mes
    if ((date.getMonth()+1).toString().length == 1) {
      mes = '0' + (date.getMonth() + 1);
    } else {
      mes = (date.getMonth()+1);
    }
    
    //validacion dia anterior inicio de mes
    if(date.getDate() == 1){//es inicio de mes
      if(mes == '01'){
        mes = '12';
        this.fechaHoy = (date.getFullYear()-1) +'-'+ mes +'-'+'31'; 
      }else{
        mes = mes-1;
        if(mes < 10){
          this.fechaHoy = (date.getFullYear()) +'-0'+ mes +'-'+'31';
        } else {
          this.fechaHoy = (date.getFullYear()) +'-'+ mes +'-'+'31'; 
        }
      }        
    }else{      
      this.fechaHoy = (date.getFullYear()) +'-'+ mes +'-'+(date.getDate().toString().length == 1 ? '0'+(date.getDate()-1) : (date.getDate()-1).toString().length == 1 ? '0'+(date.getDate()-1) : date.getDate()-1 );                                       
    }


    this.oBuscar.FechaDesdeAnterior = (date.getFullYear()-1)+'-01-01';
    this.oBuscar.FechaHastaAnterior = (date.getFullYear()-1)+'-12-31';

    this.oBuscar.FechaDesdeActual = date.getFullYear()+'-01-01';
    this.oBuscar.FechaHastaActual = this.fechaHoy;

    
     //Realizamos llamada al servicio de clientes 
   if (!localStorage.getItem('Clientes')){

    //console.log("no tenemos  Clientes");

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
     // console.log("Ya tenemos  Clientes");


      this.oCliente = JSON.parse(localStorage.getItem('Clientes'));
      this.oContenido = this.oCliente.Contenido[0];
      this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
      this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
      this.oContacto =this.oCliente.Contenido[0].Contactos;

    }

    this.dtTrigger1.next("");
      
    this.dtTrigger2.next("");


  }

  //Funcion para consultar ficha tecnica
  consultaFichaTecnica() {

    this.bBandera = false;
    console.log('consulta ficha tecnica');
    this.bCargando = true;
    this.oBuscar.Usuario= this.sCodigo;  
    this.oBuscar.TipoUsuario = this.sTipo; 

    console.log(this.oBuscar);
    

    

    //Realizamos llamada al servicio de ficha tecnica
    this._servicioFichaTecnica.Get(this.oBuscar).subscribe(
      (Response: FichaTecnica) => {
        this.oFichaTecnicaRes = Response;     
        
        console.log("respuesta ficha tecnica"+JSON.stringify(this.oFichaTecnicaRes));

        
        if (this.oFichaTecnicaRes.Codigo != 0) {
          this.bError = true;
          this.sMensaje = 'No se encontraron datos de ficha tecnica con los datos enviados';
          this.bBandera = false;
          this.bCargando = false;
          return;
        }

        this.sMensaje = '';
        this.bBandera = true;        
        this.bCargando = false;
        this.oAnioAnteriorRes = this.oFichaTecnicaRes.Contenido.VentasAnioAnterior;
        this.oAnioActualRes = this.oFichaTecnicaRes.Contenido.VentasAnioActual;
        this.oTipoCarteraRes = this.oFichaTecnicaRes.Contenido.ResumenCartera;
        this.oPedidosInactivosRes = this.oFichaTecnicaRes.Contenido.PedidosActivos;

        //Calculo ventas año anterior
        for(var AnioAnt of this.oAnioAnteriorRes){
          for(var subCat of AnioAnt.Subcategorias){
            subCat.PiezasAnioAntAux = this.formatoNumero(subCat.Piezas);
            subCat.GramosAnioAntAux = this.formatoNumero(subCat.Gramos);
            subCat.ImporteAnioAntAux = this.formatoMoneda(subCat.Importe);
            subCat.ValorAgregadoAnioAntAux = this.formatoMoneda(subCat.ValorAgregado); 
                   
          }
          AnioAnt.TotalCatPiezasAnioAnt = this.formatoNumero(this.getTotalCategoria(AnioAnt.Subcategorias,'Piezas'));
          AnioAnt.TotalCatGramosAnioAnt= this.formatoNumero(this.getTotalCategoria(AnioAnt.Subcategorias,'Gramos'));
          AnioAnt.TotalCatImporteAnioAnt = this.formatoMoneda(this.getTotalCategoria(AnioAnt.Subcategorias,'Importe'));
          AnioAnt.TotalCatValorAgregadoAnioAnt = this.formatoMoneda(this.getTotalCategoria(AnioAnt.Subcategorias,'ValorAgregado'));          
        }

         //Totales generales
        this.oFichaTecnicaRes.Contenido.TotalGenAnioAntPiezas = this.formatoNumero(this.getTotalGeneral(this.oAnioAnteriorRes,'Piezas'));
        this.oFichaTecnicaRes.Contenido.TotalGenAnioAntGramos = this.formatoNumero(this.getTotalGeneral(this.oAnioAnteriorRes,'Gramos'));
        this.oFichaTecnicaRes.Contenido.TotalGenAnioAntImporte = this.formatoMoneda(this.getTotalGeneral(this.oAnioAnteriorRes,'Importe'));
        this.oFichaTecnicaRes.Contenido.TotalGenAnioAntValorAgregado = this.formatoMoneda(this.getTotalGeneral(this.oAnioAnteriorRes,'ValorAgregado'));     


        //Calculo ventas año actual
        for(var AnioAct of this.oAnioActualRes){
          for(var subCat of AnioAct.Subcategorias){
            subCat.PiezasAnioActAux = this.formatoNumero(subCat.Piezas);
            subCat.GramosAnioActAux = this.formatoNumero(subCat.Gramos);
            subCat.ImporteAnioActAux = this.formatoMoneda(subCat.Importe);
            subCat.ValorAgregadoAnioActAux = this.formatoMoneda(subCat.ValorAgregado);         
          }
          AnioAct.TotalCatPiezasAnioAct = this.formatoNumero(this.getTotalCategoria(AnioAct.Subcategorias,'Piezas'));
          AnioAct.TotalCatGramosAnioAct = this.formatoNumero(this.getTotalCategoria(AnioAct.Subcategorias,'Gramos'));
          AnioAct.TotalCatImporteAnioAct = this.formatoMoneda(this.getTotalCategoria(AnioAct.Subcategorias,'Importe'));
          AnioAct.TotalCatValorAgregadoAnioAct = this.formatoMoneda(this.getTotalCategoria(AnioAct.Subcategorias,'ValorAgregado'));          
        }

         //Totales generales
        this.oFichaTecnicaRes.Contenido.TotalGenAnioActPiezas = this.formatoNumero(this.getTotalGeneral(this.oAnioActualRes,'Piezas'));
        this.oFichaTecnicaRes.Contenido.TotalGenAnioActGramos = this.formatoNumero(this.getTotalGeneral(this.oAnioActualRes,'Gramos'));
        this.oFichaTecnicaRes.Contenido.TotalGenAnioActImporte = this.formatoMoneda(this.getTotalGeneral(this.oAnioActualRes,'Importe'));
        this.oFichaTecnicaRes.Contenido.TotalGenAnioActValorAgregado = this.formatoMoneda(this.getTotalGeneral(this.oAnioActualRes,'ValorAgregado'));     
         

         //Resumen cartera
         for(var cart of this.oTipoCarteraRes){
          cart.TipoCarteraSaldoAux = this.formatoMoneda(cart.TipoCarteraSaldo);
          cart.TipoCarteraSaldoVencidoAux = this.formatoMoneda(cart.TipoCarteraSaldoVencido);
         }
        
        this. isCollapsed = true;


        
        $("#firstTable").DataTable().destroy();
        this.dtTrigger1.next("");
        $("#secondTable").DataTable().destroy();
            this.dtTrigger2.next("");


      },
      (error: FichaTecnica) => {
        this.oFichaTecnicaRes = error;
        this.sMensaje = 'No se encontraron datos de ficha tecnica con los datos enviados';
        console.log('error');
        console.log(this.oFichaTecnicaRes);
        this.bCargando = false;
      }
    );
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


  


  downloadAsPDF() {
    const pdfTable = this.pdfTable.nativeElement;
    console.log(pdfTable);

    //var cadenaaux = pdfTable.innerHTML;

    var cadenaaux = this.TablaFichaTecnica();

    let cadena =
    '<br><p>Cliente: <strong> ' +this.oBuscar.Cliente +'   de la Filial '+this.oBuscar.FilialDesde+'  hasta la Filial '+this.oBuscar.FilialHasta+'</strong></p>' +    
    cadenaaux;

    console.log('cadena');
    console.log(cadena);

    var html = htmlToPdfmake(cadena);

   

    
    
    // console.log( html[2].table);
    
  
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
              text: 'Ficha Tecnica',
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
  obtenCliente(sCodigo: string) {

    this.oBuscar.Cliente = Number(sCodigo);
    //this.oBuscar.ClienteFilial = Number(sFilial);

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

    //Modal datos cliente
    openDatosCliente(DatoCliente: any) {
      console.log("Entra modal datos cliente");
      this.bMostrarDatos = false;//Se setea el detalle de los datos
      
      var result;
  
      try{
        result = this.BuscaDatosCliente()
       
  
        if(result){
          this.ModalActivo = this.modalService.open(DatoCliente, {
            ariaLabelledBy: 'DatoCliente',
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
  
        
  
  
        console.log("respuesta"+result);
  
      }catch(err){
        
      }
    }

    BuscaDatosCliente():boolean{
      
      this.Buscar.ClienteCodigo = this.oBuscar.Cliente;

      this._servicioCClientes      
      .GetCliente(this.Buscar)
      .subscribe(
        (Response: Clientes) =>  {
          
  
          this.oDatosCliente = Response;
  
          console.log("Respuesta datos cliente"+JSON.stringify(this.oDatosCliente));
        //  this.bCargandoClientes =false;
  
  
          if(this.oDatosCliente.Codigo != 0){
            this.bError= true;
            this.sMensaje="No se encontraron datos del cliente";     
            return false;
          }
     
          // this.oContenido = this.oCliente.Contenido[0];
          // this.oCondiciones = this.oCliente.Contenido[0].Condiciones;
          // this.oDatosGenerales =this.oCliente.Contenido[0].DatosGenerales;
          // this.oContacto =this.oCliente.Contenido[0].Contactos;
          return true;
  
       
        },
        (error:Clientes) => {
  
          this.oDatosCliente = error;
  
          console.log("error");
          console.log(this.oCliente);
          this.bCargandoClientes =false;
          return false;
       
        }
        
      );
      return true;
    }  


   // #### Obten totales categoria ####
   getTotalCategoria(subCat: Subcategorias[], sValor: string): number {   
    let Total: number = 0;  

    switch(sValor) {        
      case 'Piezas': { 
   
        for(var dato of subCat){
            Total += dato.Piezas;           
        }
        break; 
      } 
      case 'Gramos': { 
        
        for(var dato of subCat){
          Total += dato.Gramos;           
        }
        break; 
      }  
    case 'Importe': { 
        
      for(var dato of subCat){
        Total += dato.Importe;           
      }
      break;
          break; 
    } 
    case 'ValorAgregado': { 
        
      for(var dato of subCat){
        Total += dato.ValorAgregado;           
      }
      break;
         
    } 

   }     


    Total = Number(Total.toFixed(2));
    return Total; 
  }
  // #### Obten totales categoria venta año anterior ####

    // #### Obten totales generall ####
    getTotalGeneral(venAnioAnt: VentasAnioA[], sValor: string): number {   
      let Total: number = 0;  

      switch(sValor) {        
        case 'Piezas': { 
 		
          for(var dato of venAnioAnt){
            for(var datDet of dato.Subcategorias){
              Total += datDet.Piezas;             
            }
             
          }
               break; 
             } 
      case 'Gramos': { 
          
        for(var dato of venAnioAnt){
          for(var datDet of dato.Subcategorias){
            Total += datDet.Gramos;             
          }
           
        }
            break; 
          } 
      case 'Importe': { 
          
        for(var dato of venAnioAnt){
          for(var datDet of dato.Subcategorias){
            Total += datDet.Importe;             
          }
           
        }
            break; 
          } 
      case 'ValorAgregado': { 
          
        for(var dato of venAnioAnt){
          for(var datDet of dato.Subcategorias){
            Total += datDet.ValorAgregado;             
          }
           
        }
            break; 
          } 
  
     }     
  

      Total = Number(Total.toFixed(2));
      return Total; 
    }
    // #### Obten totales categoria venta año anterior ####


    formatoMoneda(number){
      return new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD', maximumFractionDigits: 2}).format(number);
    };

    formatoNumero(number){
      return new Intl.NumberFormat('en-US', {currency: 'USD', maximumFractionDigits: 2}).format(number);
    };

    obtenNombreCliente(cliente: number): string {   
      let nombre: string = '';  
    
        for(var cliCon of this.oCliente.Contenido){ 
          if (cliCon.ClienteCodigo == String(cliente)){
  
            if (cliCon.ClienteFilial != '0'){
              nombre = "Cliente "+cliente+' - '+cliCon.ClienteFilial+' '+ cliCon.RazonSocial;
            }else{
              nombre = "Cliente "+cliente+' '+ cliCon.RazonSocial;
            }
  
            
            break
          }
  
                
           
      }
     
      return nombre; 
    }



    obtenNombreClienteFil(cliente: number, sFilial: number): string {   
      let nombre: string = '';  
    
        for(var cliCon of this.oCliente.Contenido){ 
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
  

    TablaFichaTecnica(): string
    {
  
      var tabla = "";
  
      tabla =  '<h6 style="text-align: center; color:#24a4cc; ">Ventas año anterior desde '+this.oBuscar.FechaDesdeAnterior+' hasta '+this.oBuscar.FechaHastaAnterior+'</h6>'+'\n'+
      ' <table  class="table table-hover table-striped" datatable [dtOptions]="dtOptions">'+'\n'+
      ' <thead>'+'\n'+
        ' <tr class="EncTabla">'+'\n'+
        ' <th style="background-color: #24a4cc; color: white;" scope="col">CATEG</th>'+'\n'+
        ' <th style="background-color: #24a4cc; color: white; " scope="col">NOMBRE</th>'+'\n'+
        ' <th style="background-color: #24a4cc; color: white; " scope="col">PIEZAS</th>'+'\n'+
        ' <th style="background-color: #24a4cc; color: white;" scope="col">GRAMOS</th>'+'\n'+
        ' <th style="background-color: #24a4cc; color: white; text-align: right;" ><div class="size">IMPORTE</div></th>'+'\n'+
        ' <th style="background-color: #24a4cc; color: white; text-align: right;" ><div class="size">VALOR AGREGADO</div></th>            '+'\n'+
      '</tr>'+'\n'+
      '</thead>'+'\n'+
      '<tbody>'+'\n';
    
            
    
    
      this.oAnioAnteriorRes.forEach(function(datos){
      tabla = tabla +   
      '<tr>'+'\n'+
        ' <td class="FilasFonelli">'+'CATEGORIA ' +datos.CategoriaCodigo + ' : ' + datos.CategoriaNombre+'</td>   '+'\n'+
        ' <td></td>                '+'\n'+
        ' <td></td>'+'\n'+
        ' <td></td>'+'\n'+
        ' <td></td>'+'\n'+
        ' <td></td>'+'\n'+
      '</tr>'+'\n';

        datos.Subcategorias.forEach(function(subCat){

          tabla = tabla +   
          '<tr >' + '\n' +
          ' <td class="FilasFonelli" style="text-align:left">'+subCat.SubcategoriaCodigo+'</td>'+'\n'+
          ' <td class="FilasFonelli"> '+subCat.SubcategoriaNombre+' </td>                '+'\n'+
          ' <td class="FilasFonelli"> '+subCat.PiezasAnioAntAux+'</td>'+'\n'+
          ' <td class="FilasFonelli" style="text-align:left">'+subCat.GramosAnioAntAux+'</td>'+'\n'+
          ' <td class="FilasFonelli" style="text-align:right">'+subCat.ImporteAnioAntAux+'</td>'+'\n'+
          ' <td class="FilasFonelli" style="text-align:right">'+subCat.ValorAgregadoAnioAntAux+'</td>'+'\n'+
          '</tr>'+'\n';
          
        });


        tabla = tabla +   
        '<tr>' + '\n' +     
          ' <td></td>'+'\n'+
          ' <td class="FilasFonelli"> Total Categoria</td>                '+'\n'+
          ' <td class="FilasFonBold"> '+datos.TotalCatPiezasAnioAnt+'</td>'+'\n'+
          ' <td class="FilasFonBold" style="text-align:left">'+ datos.TotalCatGramosAnioAnt+'</td>'+'\n'+
          ' <td class="FilasFonBold" style="text-align:right">'+ datos.TotalCatImporteAnioAnt+'</td>'+'\n'+
          ' <td class="FilasFonBold" style="text-align:right">'+ datos.TotalCatValorAgregadoAnioAnt+'</td>          '+'\n'+
        ' </tr>'+'\n';
      });


      tabla = tabla +   
      '<tr>' + '\n' +              
        ' <td></td>'+'\n'+
        ' <td class="FilasFonBold" style="color:#183e6f;"> Total General</td>                '+'\n'+
        ' <td class="FilasFonBold" style="color:#183e6f;"> '+this.oFichaTecnicaRes.Contenido.TotalGenAnioAntPiezas+'</td>'+'\n'+
        ' <td class="FilasFonBold" style="color:#183e6f;">'+this.oFichaTecnicaRes.Contenido.TotalGenAnioAntGramos+'</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align:right; color:#183e6f;">'+ this.oFichaTecnicaRes.Contenido.TotalGenAnioAntImporte+'</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align:right; color:#183e6f;">'+this.oFichaTecnicaRes.Contenido.TotalGenAnioAntValorAgregado +'</td>        '+'\n'+
      '</tr>'+'\n'+          
      '</tbody>'+'\n'+
      '</table>'+'\n';

      tabla = tabla + 
      '<br>'+'\n'+
      '<br>'+'\n'+
      '<h6 class="card-title" style="color: #24a4cc; text-align: center;">Ventas año actual desde '+this.oBuscar.FechaDesdeActual+' hasta '+this.oBuscar.FechaHastaActual+'</h6> '+'\n';
  

      tabla = tabla +        
      '<table  class="table table-hover table-striped" datatable [dtOptions]="dtOptions">'+'\n'+
        '<thead>'+'\n'+
          '<tr class="EncTabla">'+'\n'+            
            ' <th style="background-color: #24a4cc; color: white;" scope="col">CATEG</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; " scope="col">NOMBRE</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; " scope="col">PIEZAS</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white;" scope="col">GRAMOS</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; text-align: center;" scope="col"><div class="size">IMPORTE</div></th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; text-align: center;" scope="col"><div class="size">VALOR AGREGADO</div></th>'+'\n'+
        '</tr>'+'\n'+
        '</thead>'+'\n'+
        '<tbody>'+'\n';


      this.oAnioActualRes.forEach(function(datos){ 
        
        tabla = tabla +
        ' <tr>'+'\n'+
          ' <td class="FilasFonelli">'+'CATEGORIA'+datos.CategoriaCodigo + ' : ' + datos.CategoriaNombre+' "</td>   '+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td>'+'\n'+
          ' <td></td>'+'\n'+
        '</tr>'+'\n';

        datos.Subcategorias.forEach(function(subCat){          

          tabla = tabla +   
          '<tr >' + '\n' +
            ' <td class="FilasFonelli" style="text-align:left">'+ subCat.SubcategoriaCodigo+'</td>'+'\n'+
            ' <td class="FilasFonelli">'+subCat.SubcategoriaNombre+' </td>                '+'\n'+
            ' <td class="FilasFonelli" >'+ subCat.PiezasAnioActAux+'</td>'+'\n'+
            ' <td class="FilasFonelli" style="text-align:left">'+ subCat.GramosAnioActAux+'</td>'+'\n'+
            ' <td class="FilasFonelli" style="text-align:right">'+ subCat.ImporteAnioActAux+'</td>'+'\n'+
            ' <td class="FilasFonelli" style="text-align:right">'+ subCat.ValorAgregadoAnioActAux+'</td>'+'\n'+
          '</tr>'+'\n';
          
        });

        tabla = tabla +  
        ' <tr>'+'\n'+              
          ' <td></td>'+'\n'+
          ' <td class="FilasFonelli"> Total Categoria</td>'+'\n'+
          ' <td class="FilasFonBold" style="font-weight: bold;"> '+datos.TotalCatPiezasAnioAct+'</td>'+'\n'+
          ' <td class="FilasFonBold" style="font-weight: bold;">'+ datos.TotalCatGramosAnioAct+'</td>'+'\n'+
          ' <td class="FilasFonBold" style="text-align:right; font-weight: bold;">'+ datos.TotalCatImporteAnioAct+'</td>'+'\n'+
          ' <td class="FilasFonBold" style="text-align:right; font-weight: bold;">'+ datos.TotalCatValorAgregadoAnioAct+'</td>'+'\n'+
        ' </tr>'+'\n';

      });

      tabla = tabla +   
      '<tr>'+'\n'+
        ' <td></td>'+'\n'+
        ' <td class="FilasFonBold" style="color:#183e6f;"> Total General</td>                '+'\n'+
        ' <td class="FilasFonBold" style="color:#183e6f;"> '+this.oFichaTecnicaRes.Contenido.TotalGenAnioActPiezas+'</td>'+'\n'+
        ' <td class="FilasFonBold" style="color:#183e6f;">'+this.oFichaTecnicaRes.Contenido.TotalGenAnioActGramos +'</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align:right; color:#183e6f;">'+this.oFichaTecnicaRes.Contenido.TotalGenAnioActImporte +'</td>'+'\n'+
        ' <td class="FilasFonBold" style="text-align:right; color:#183e6f;">'+this.oFichaTecnicaRes.Contenido.TotalGenAnioActValorAgregado +'</td>'+'\n'+
      '</tr>'+'\n'+      
    '</tbody>'+'\n'+
    '</table>'+'\n';


    //RESUMEN DE CARTERA

    tabla = tabla + 
      '<br>'+'\n'+
      '<br>'+'\n'+
      '<h6 class="card-title" style="color: #24a4cc; text-align: center;">Resumen de cartera</h6> '+'\n';

    tabla = tabla + 
      ' <table  class="table table-hover table-striped" >'+'\n'+
      ' <thead>'+'\n'+
        ' <tr class="EncTabla">'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;" scope="col">CARTERA</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white; " scope="col">DESCRIPCIÓN</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white; " scope="col">SALDO</th>'+'\n'+
          ' <th style="background-color: #24a4cc; color: white;" scope="col">SALDO VENCIDO</th>            '+'\n'+
        ' </tr>'+'\n'+
      ' </thead>'+'\n'+
      ' <tbody>'+'\n';

      this.oTipoCarteraRes.forEach(function(datos){ 
        tabla = tabla + 
        ' <tr>'+'\n'+
            ' <td class="FilasFonelli" style="text-align:left">'+ datos.TipoCarteraCodigo+'</td>'+'\n'+
            ' <td class="FilasFonelli"> '+datos.TipoCarteraDescripc+'</td>                '+'\n'+
            ' <td class="FilasFonelli"> '+ datos.TipoCarteraSaldoAux+'</td>'+'\n'+
            ' <td class="FilasFonelli" style="text-align:left">'+ datos.TipoCarteraSaldoVencidoAux+'</td>'+'\n'+
        ' </tr>'+'\n'; 
      });

      tabla = tabla + 
      ' </tbody>'+'\n'+
      ' </table>'+'\n';

      //PEDIDOS ACTIVOS

      tabla = tabla + 
      '<br>'+'\n'+
      '<br>'+'\n'+
      '<h6 class="card-title" style="color: #24a4cc; text-align: center;">Pedidos activos</h6> '+'\n';

      tabla = tabla + 
      ' <table  class="table table-hover table-striped" >'+'\n'+
        ' <thead>'+'\n'+
          ' <tr class="EncTabla">  '+'\n'+          
            ' <th style="background-color: #24a4cc; color: white;" scope="col">PEDIDOS</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; " scope="col">PIEZAS</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white; " scope="col">GRAMOS</th>'+'\n'+
            ' <th style="background-color: #24a4cc; color: white;" scope="col">IMPORTE</th>            '+'\n'+
        ' </tr>'+'\n'+
        ' </thead>'+'\n'+
        ' <tbody>'+'\n'+
            ' <tr >  '+'\n'+     
              ' <td class="FilasFonelli" style="text-align:left">'+ this.oPedidosInactivosRes.PedidosNumero+'</td>'+'\n'+
              ' <td class="FilasFonelli"> '+this.oPedidosInactivosRes.Piezas+'</td>                '+'\n'+
              ' <td class="FilasFonelli" >'+ this.oPedidosInactivosRes.Gramos+'</td>'+'\n'+
              ' <td class="FilasFonelli" style="text-align:left">'+ this.formatoMoneda(this.oPedidosInactivosRes.Importe)+'</td>'+'\n'+
          ' </tr> '+'\n'+
        ' </tbody>'+'\n'+
      ' </table>'+'\n';





  
    return tabla;
  
  
    }
  

    consultaCliente(filial){
    
      this.bMostrarDatos=false;
      //this.sMensaje="";
      //this.bCargando = true;
      console.log("Entra a consultar detalle cliente");
  

      this.BuscarCliente.ClienteCodigo = this.oBuscar.Cliente;
      this.BuscarCliente.ClienteFilial = filial;

      this._servicioCClientes
      .GetCliente(this.BuscarCliente)
      .subscribe(
        (Response: Clientes) => {

          this.oDatosClienteDet = Response;

          console.log("Respuesta cliente"+JSON.stringify(this.oDatosClienteDet));


          if(this.oDatosClienteDet.Codigo != 0){

            this.bError= true;
            // this.sMensaje="No se encontraron datos del cliente detalle";
            // this.bCargando = false;
            return;
          }
    
          this.oContenidoDet = this.oDatosClienteDet.Contenido[0];
          this.oCondicionesDet = this.oDatosClienteDet.Contenido[0].Condiciones;
          this.oDatosGeneralesDet =this.oDatosClienteDet.Contenido[0].DatosGenerales;
          this.oContactoDet =this.oDatosClienteDet.Contenido[0].Contactos;
          this.bMostrarDatos=true;
          // this.bCargando = false;
          this.sClienteFil =this.obtenNombreClienteFil(this.oBuscar.Cliente,filial)
      
        },
        (error:Clientes) => {

          this.oCliente = error;

          console.log("error");
          console.log(this.oDatosClienteDet);
          this.bMostrarDatos=false;
          // this.bCargando = false;
      
        }
      );

  }



  //Funcion para cerrar sesion y redireccionar al home
  EliminaSesion() {
    localStorage.clear();
    this._router.navigate(['/']);
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger1.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }

  ngAfterViewInit(): void {
    //this.dtTrigger1.next("");
    //this.dtTrigger2.next("");
  }
}






