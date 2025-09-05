import {
  Component, OnInit, Input, Output, EventEmitter,
  OnChanges, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Servicios
import { FuncFechasService } from 'src/app/core/services/func-fechas.service';
import { CotizEditarService } from './servicios/cotiz-editar.service';
import { CotizacClienteService } from '../cotiz-crear/servicios/cotizac-cliente.service'
import { CotizacArticuloService } from '../cotiz-crear/servicios/cotizac-articulo.service';

// Modelos e interfaces
import { CotizacDocum, CotizacFila, CotizFiltros } from '../cotiz-crear/modelos/cotizac-docum';
import { CotzClteFiltros, CotzClteResponse } from '../cotiz-crear/modelos/cotizac-cliente';
import { CalcPrecParam } from 'src/app/models/calc-prec-param';
import { CalcPrecResponse } from 'src/app/models/calc-prec-response';


@Component({
  selector: 'app-cotiz-editar',
  templateUrl: './cotiz-editar.component.html',
  styleUrls: ['./cotiz-editar.component.css'],
  providers: [CotizEditarService]
})
export class CotizEditarComponent implements OnInit, OnChanges {

  @Input() oCotiz: any;   // objeto con datos generales y filas del documento elegido en la tabla "padre"
  @Output() finEdicion = new EventEmitter<void>();  // notifica que se termino la edicion

  sTipoUsuario: string | null;
  sUsuario: string | null;
  sCodigo: number | null;
  sFilial: number | null;

  formCotiz: FormGroup;   // Formulario Reactivo
  articulos: CotizacFila[] = [];

  // Filtros enviados al servicio para UPDATE el documento (los requiere la API REST)
  oFiltros: CotizFiltros = {
    TipoUsuario: '', Usuario: 0, ClienteCodigo: 0, ClienteFilial: 0, AgenteCodigo: 0
  };

  // Filtros para buscar cliente
  oCotzClteFiltros: CotzClteFiltros = {
    TipoUsuario: '', Usuario: 0, ClienteCodigo: 0, ClienteFilial: 0, AgenteCodigo: ''
  };
  oCotzClte: CotzClteResponse;    // Response del servicio que busca el cliente

  // Filtros para cálculo de precios
  oCalcPrecParam: CalcPrecParam = {
    TipoUsuario: '', Usuario: 0, ClienteCodigo: 0, ClienteFilial: 0,
    ItemLinea: '', ItemCode: '', ListaPrecCode: '', ParidadTipo: '',
    PiezasCosto: 0, GramosCosto: 0
  };
  oCalcPrecResponse: CalcPrecResponse = {} as CalcPrecResponse;

  bCliente = false;   // mantengo esta bandera para no modificar el código que estoy copiando
  mostrarMensajeArticulo = false;
  txtMensajeArticulo = '';
  mostrarDocumento = false;

  totalDocum = 0;

  /**
   * constructor   <<<--------------------------------------
   */
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _funcFechasService: FuncFechasService,
    private _cotizacClienteService: CotizacClienteService,
    private _cotizacArticuloService: CotizacArticuloService

  ) {
    this.sTipoUsuario = sessionStorage.getItem('tipo');
    this.sUsuario = sessionStorage.getItem('codigo');
    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sFilial = Number(sessionStorage.getItem('filial'));

    // Inicializa el formulario una sola vez
    this.formCotiz = this.fb.group({
      ClienteCodigo: [this.oCalcPrecParam.ClienteCodigo, [Validators.required, Validators.pattern('^[0-9]*$')]],
      ClienteFilial: [this.oCalcPrecParam.ClienteFilial, [Validators.required, Validators.pattern('^[0-9]*$')]],
      Folio: [''],
      FechaDoc: [this._funcFechasService.fechaHoy_aaaammdd(), Validators.required],
      StatusDoc: ['A'],
      ClienteNombre: ['', Validators.required],
      ClienteSucursal: ['', Validators.required],
      txtDatosCliente: [''],
      ListaPreciosCodigo: [''],
      ParidadTipo: [''],
      Comentarios: [''],
      LineaPT: [''],
      ItemCode: [''],
      Piezas: [1, [Validators.required, Validators.min(1)]],
      CotizacFilas: this.fb.array([])

    });
  }

  ngOnInit(): void {

    // el método OnChanges se encarga de cargar el formulario
    // la primera vez, ya que se ejecuta entes de ngOnInit

  }

  /**
   * Se ejecuta cada vez que 'oCotiz' reciba un nuevo objeto
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['oCotiz'] && changes['oCotiz'].currentValue) {

      const cotiz = changes['oCotiz'].currentValue;
      //console.log('CotizEditarComponent: ngOnChanges - nuevo oCotiz recibido:');
      //console.dir(cotiz);

      this.updateFormulario(cotiz);
      this.mostrarDocumento = true;
    }
  }

  updateFormulario(cotiz: any): void {

    //    this.sTipoUsuario = sessionStorage.getItem('tipo');
    //    this.sUsuario = sessionStorage.getItem('codigo');

    this.oFiltros.TipoUsuario = this.sTipoUsuario;

    switch (this.sTipoUsuario) {
      case 'C': {
        //Tipo cliente                  
        this.bCliente = true;
        this.oCalcPrecParam.Usuario = this.sCodigo + '-' + this.sFilial;
        this.oCalcPrecParam.ClienteCodigo = this.sCodigo;
        this.oCalcPrecParam.ClienteFilial = this.sFilial;
        this.oFiltros.Usuario = this.sCodigo + '-' + this.sFilial;
        this.oFiltros.ClienteCodigo = this.sCodigo;
        this.oFiltros.ClienteFilial = this.sFilial;
        break;
      }
      case 'A': {
        //Agente; 
        this.bCliente = false;
        this.oCalcPrecParam.Usuario = this.sCodigo;
        this.oFiltros.Usuario = this.sCodigo;
        this.oFiltros.AgenteCodigo = this.sCodigo;
        break;
      }
      default: {
        //Gerente; 
        this.bCliente = false;
        this.oCalcPrecParam.Usuario = this.sCodigo;
        this.oFiltros.Usuario = this.sCodigo;
        break;
      }
    }
    //console.dir(cotiz);

    //this.txtMensajeClientes = '';
    //this.mostrarMensajeClientes = false;
    this.mostrarMensajeArticulo = false;

    this.formCotiz.patchValue({
      ClienteCodigo: cotiz.ClienteCodigo,
      ClienteFilial: cotiz.ClienteFilial,
      Folio: cotiz.Folio,
      FechaDoc: this._funcFechasService.fechaHoy_aaaammdd(),
      StatusDoc: 'A',
      ClienteNombre: cotiz.ClienteNombre,
      ClienteSucursal: cotiz.ClienteSucursal,
      txtDatosCliente: `${cotiz.ClienteNombre}\n${cotiz.ClienteSucursal}`,
      ListaPreciosCodigo: cotiz.ListaPreciosCodigo,
      ParidadTipo: cotiz.ParidadTipo,
      Comentarios: cotiz.Comentarios
    });

    // Actualiza lista de precios y tipo de paridad asignados al cliente, ya que pudieron 
    // modificarse para aplicarlas a la cotización.
    this.DatosCliente();

    // Voy a calcular nuevamente el precio de cada artículo, aplicando la paridad del dia.
    // Copia a un array local las filas de la cotización para hacer los cambios y al terminar copio al array asociado al formulario.
    let filas = cotiz.FilasDoc;

    // -- grok
    this.articulos = [];
    cotiz.FilasDoc.forEach(item => {
      this.updatePrecio(cotiz, item);
    });
    //this.articulos = filas;
    //this.calcularTotal(filas);
    // -- fin grok
  }

  /**
   * Obtiene nuevamente datos del cliente porque es posible que hayan cambiado datos
   * utilizados para calcular el precio.
   */
  DatosCliente() {

    // Actualiza lista de precios y tipo de paridad asignados al cliente, ya que pudieron 
    // modificarse para aplicarlas a la cotización.

    // Filtros para buscar cliente
    this.oCotzClteFiltros = {
      TipoUsuario: this.sTipoUsuario,
      Usuario: this.oFiltros.Usuario,
      ClienteCodigo: this.formCotiz.get('ClienteCodigo')?.value,
      ClienteFilial: this.formCotiz.get('ClienteFilial')?.value,
      AgenteCodigo: this.sTipoUsuario == 'A' ? String(this.oFiltros.Usuario) : ''
    };
    //console.table(this.oCotzClteFiltros);

    this._cotizacClienteService.getCliente(this.oCotzClteFiltros).subscribe(
      (Response: CotzClteResponse) => {

        this.oCotzClte = Response;

        if (this.oCotzClte.Codigo === 0) {
          this.formCotiz.patchValue({
            ListaPreciosCodigo: this.oCotzClte.Contenido.ListaPreciosCodigo,
            ParidadTipo: this.oCotzClte.Contenido.ParidadCodigo
          });

        } else {
          this.formCotiz.patchValue({
            ListaPreciosCodigo: '11',   // cuando no se indica cliente, no es el caso en este componente
            ParidadTipo: "N"            // cuando no se indica cliente, no es el caso en este componente
          })
        }
      }
    );

  }

  /**
   * Actualiza el precio del articulo, calcula el importe por fila y recalcula el total
   * del documento
   */
  updatePrecio(oCotiz, oItem) {
    //console.table(oCotiz);
    //console.table(oItem);

    this.txtMensajeArticulo = '';
    this.mostrarMensajeArticulo = false;

    // En cotizaciones, paso en cero los "GramosCosto" para que el servicio
    // utilice el peso promedio del artículo
    this.oCalcPrecParam = {
      TipoUsuario: this.oFiltros.TipoUsuario,
      Usuario: this.oFiltros.Usuario,
      ClienteCodigo: oCotiz.ClienteCodigo,
      ClienteFilial: oCotiz.ClienteFilial,
      ItemLinea: oItem.LineaPT,
      ItemCode: oItem.ItemCode,
      ListaPrecCode: this.formCotiz.get('ListaPreciosCodigo')?.value,
      ParidadTipo: this.formCotiz.get('ParidadTipo')?.value,
      PiezasCosto: oItem.Piezas,
      GramosCosto: 0
    }
    //console.table(this.oCalcPrecParam);

    this._cotizacArticuloService.getArticulo(this.oCalcPrecParam).subscribe(
      articulo => {

        if (articulo.Codigo == 0) {
          if (Object.keys(articulo.Contenido).length > 0) {

            let _importe = 0;

            // 1=LPrec Directa 2=LPrec Componente
            if (articulo.Contenido.LPrecDirComp == "1") {
              _importe = oItem.Piezas * articulo.Contenido.PrecioVenta;
            } else {
              if (articulo.Contenido.TipoCosteo == '1') {
                _importe = oItem.Piezas * articulo.Contenido.PrecioVenta;
              } else {
                _importe = parseFloat((oItem.Piezas * articulo.Contenido.ItemGramos * articulo.Contenido.PrecioVenta).toFixed(2));
              }
            }

            // ------------ this.articulos.push(nuevoArticulo);
            oItem.Precio = articulo.Contenido.PrecioVenta;
            oItem.Costo = articulo.Contenido.PrecioCosto;
            oItem.Importe = _importe;

            // Agrega el ítme a this.artículos - grok
            if (!this.articulos.includes(oItem)) {
              this.articulos.push(oItem);
            }
            this.calcularTotal(this.articulos);
            this.cdr.detectChanges();  // forza detección de cambios
            // - fin grok

          } else {
            this.txtMensajeArticulo = 'Artículo no registrado';
            this.mostrarMensajeArticulo = true;
          }
        } else {
          console.log(articulo.Mensaje);
          this.txtMensajeArticulo = articulo.Mensaje;
          this.mostrarMensajeArticulo = true;
        }
      }
    );

  }


  /**
   * Controla la llamada al servicio que busca el artículo y calcula el precio
   * según los parámetros indicados. Si el artículo es válido, lo agrega al array
   * de artículos del documento y recalcula el total del documento.
   */
  AgregarArticulo(): void {

    const _lineaPT = this.formCotiz.get('LineaPT')?.value;
    const _itemCode = this.formCotiz.get('ItemCode')?.value;
    const _piezas = this.formCotiz.get('Piezas')?.value;

    this.txtMensajeArticulo = '';
    this.mostrarMensajeArticulo = false;

    if (!_lineaPT || _lineaPT == '') {
      this.txtMensajeArticulo = 'Ingrese una Línea de PT válida';
      this.mostrarMensajeArticulo = true;
      return;
    }

    if (!_itemCode || _itemCode == '') {
      this.txtMensajeArticulo = 'Ingrese una clave de artículo válida';
      this.mostrarMensajeArticulo = true;
      return;
    }

    if (_piezas < 1) {
      this.txtMensajeArticulo = 'Indique las piezas requeridas';
      this.mostrarMensajeArticulo = true;
      return;
    }

    // En cotizaciones, paso en cero los "GramosCosto" para que el servicio
    // utilice el peso promedio del artículo
    this.oCalcPrecParam = {
      TipoUsuario: this.sTipoUsuario,
      Usuario: this.oCalcPrecParam.Usuario,
      ClienteCodigo: this.formCotiz.get('ClienteCodigo')?.value,
      ClienteFilial: this.formCotiz.get('ClienteFilial')?.value,
      ItemLinea: _lineaPT,
      ItemCode: _itemCode,
      ListaPrecCode: this.formCotiz.get('ListaPreciosCodigo')?.value,
      ParidadTipo: this.formCotiz.get('ParidadTipo')?.value,
      PiezasCosto: _piezas,
      GramosCosto: 0
    }

    this._cotizacArticuloService.getArticulo(this.oCalcPrecParam).subscribe(
      articulo => {

        //console.dir(articulo.Contenido);

        if (articulo.Codigo == 0) {

          if (Object.keys(articulo.Contenido).length > 0) {
            let _importe = 0;

            // 1=LPrec Directa 2=LPrec Componente
            if (articulo.Contenido.LPrecDirComp == "1") {
              _importe = _piezas * articulo.Contenido.PrecioVenta;
            } else {
              if (articulo.Contenido.TipoCosteo == '1') {
                _importe = _piezas * articulo.Contenido.PrecioVenta;
              } else {
                _importe = parseFloat((_piezas * articulo.Contenido.ItemGramos * articulo.Contenido.PrecioVenta).toFixed(2));
              }
            }

            const nuevoArticulo: CotizacFila = {
              LineaPT: articulo.Contenido.LineaPT,
              ItemCode: articulo.Contenido.ItemCode,
              Descripc: articulo.Contenido.Descripc,
              Precio: articulo.Contenido.PrecioVenta,
              Costo: articulo.Contenido.PrecioCosto,
              Piezas: _piezas,
              Gramos: articulo.Contenido.ItemGramos * _piezas,
              TipoCosteo: (articulo.Contenido.LPrecDirComp == "1") ? "1" : articulo.Contenido.TipoCosteo,
              Importe: _importe,
              Kilataje: articulo.Contenido.Kilataje,
              IntExt: articulo.Contenido.IntExt,
              LPrecDirComp: articulo.Contenido.LPrecDirComp
            };

            this.articulos.push(nuevoArticulo);
            //console.table(this.articulos);
            this.calcularTotal(this.articulos);

            // Resetea campos para siguiente articulo
            this.formCotiz.get('LineaPT')?.reset();
            this.formCotiz.get('ItemCode')?.reset();
            this.formCotiz.get('Piezas')?.setValue(1);

          } else {
            this.txtMensajeArticulo = 'Artículo no registrado';
            this.mostrarMensajeArticulo = true;
          }
        } else {
          console.log(articulo.Mensaje);
          this.txtMensajeArticulo = articulo.Mensaje;
          this.mostrarMensajeArticulo = true;
        }
      }
    );
  }

  /**
   * Descarta el artículo del array y recalcula totales
   */
  eliminarArticulo(index: number): void {
    this.articulos.splice(index, 1);
    this.calcularTotal(this.articulos);
  }

  /**
   * Calcula totales del documento sumando el importe de las filas
   */
  calcularTotal(arrayItems: any): void {
    this.totalDocum = 0;
    arrayItems.forEach(itm => {
      //console.log(itm.Importe);
      this.totalDocum += itm.Importe;
    });
    //console.log('TotalDocum: ', this.totalDocum);
  }

  /**
  * Llama el servicio para guardar registros del documento: datos generales y filas.
  */
  guardarPropuesta(): void {
    console.log('🔸 En construcción - Rutina para guardar documento en API REST');

    this.mostrarDocumento = false;
    this.finEdicion.emit();

  }

  /**
   * No actualiza los datos de la propuesta y vuelve a la pantalla anterior
   */
  descartarPropuesta(): void {

    this.articulos = [];
    this.totalDocum = 0;
    this.formCotiz.reset();

    this.mostrarDocumento = false;
    this.finEdicion.emit();
  }

  /**
   * Rutina para imprimir el documento mostrado en pantalla
   */
  imprimir() {
    window.print();
  }


}
