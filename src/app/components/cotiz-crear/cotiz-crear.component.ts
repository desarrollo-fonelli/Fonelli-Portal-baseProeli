import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Servicios
import { CotizCrearService } from './servicios/cotiz-crear.service';
import { CotizacClienteService } from './servicios/cotizac-cliente.service'
import { CotizacArticuloService } from './servicios/cotizac-articulo.service';

// Modelos e interfaces
import { CotizacDocum, CotizacFila, CotizFiltros } from './modelos/cotizac-docum';
import { CotzClteFiltros, CotzClteResponse } from './modelos/cotizac-cliente';
//import { CotzArticFiltros, CotzArticResponse } from './modelos/cotizac-articulo';
import { CalcPrecParam } from 'src/app/models/calc-prec-param';
import { CalcPrecResponse } from 'src/app/models/calc-prec-response';
import { CotzArticResponse } from './modelos/cotizac-articulo';
import { Articulo } from '../../models/ventasarticulo';
//import * as _ from 'is-plain-object';

@Component({
  selector: 'app-cotiz-crear',
  templateUrl: './cotiz-crear.component.html',
  styleUrls: ['./cotiz-crear.component.css'],
  providers: [CotizCrearService]
})
export class CotizCrearComponent implements OnInit {

  sTipoUsuario: string | null;
  sUsuario: string | null;
  sCodigo: number | null;
  sFilial: number | null;

  cotizacForm: FormGroup;
  articulos: CotizacFila[] = [];

  // Filtros enviados al servicio para crear documento
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


  bCliente: boolean;
  clteEsValido = false;
  mostrarMensajeClientes = false;
  txtMensajeClientes = '';
  mostrarMensajeArticulo = false;
  txtMensajeArticulo = '';
  mostrarModalMensaje = false;    // indica si se muestra un formulario modal con un mensaje

  totalDocum = 0;

  sListaPrecCode = '11';   // cuando no se indica cliente, no es el caso en este componente
  sParidadTipo = "N";      // cuando no se indica cliente, no es el caso en este componente

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _cotizCrearService: CotizCrearService,
    private _cotizacClienteService: CotizacClienteService,
    private _cotizacArticuloService: CotizacArticuloService
  ) {
    this.sTipoUsuario = sessionStorage.getItem('tipo');
    this.sUsuario = sessionStorage.getItem('codigo');
    this.sCodigo = Number(sessionStorage.getItem('codigo'));
    this.sFilial = Number(sessionStorage.getItem('filial'));
  }

  ngOnInit(): void {
    // se agrega validación control de sesión distribuidores
    if (!this.sUsuario) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    this.bCliente = false;
    this.sTipoUsuario = sessionStorage.getItem('tipo');
    this.sUsuario = sessionStorage.getItem('codigo');

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

    //console.dir(this.oFiltros);

    this.cotizacForm = this.fb.group({
      ClienteCodigo: [this.oCalcPrecParam.ClienteCodigo, [Validators.required, Validators.pattern('^[0-9]*$')]],
      ClienteFilial: [this.oCalcPrecParam.ClienteFilial, [Validators.required, Validators.pattern('^[0-9]*$')]],
      Folio: [''],
      FechaDoc: [new Date().toISOString().substring(0, 10), Validators.required],
      StatusDoc: ['A'],
      ClienteNombre: ['', Validators.required],
      ClienteSucursal: ['', Validators.required],
      txtDatosCliente: [''],
      LineaPT: [''],
      ItemCode: [''],
      Piezas: [1, [Validators.required, Validators.min(1)]],
      CotizacFilas: this.fb.array([])
    });

    if (this.sTipoUsuario == 'C') {
      this.DatosCliente();
    }

  }

  /**
   * Busca cliente y asigna valores a las propiedades y variables requeridas para el
   * cálculo de precios y los filtros que se envían al servicio para crear el documento
   */
  DatosCliente(): void {
    if (this.sTipoUsuario == 'A') {
      const _agenteCodigo = this.oCalcPrecParam.Usuario;
    }

    // Borra las filas actuales en el documento
    this.articulos = [];

    // Filtros para buscar cliente
    this.oCotzClteFiltros = {
      TipoUsuario: this.sTipoUsuario,
      Usuario: this.oCalcPrecParam.Usuario,
      ClienteCodigo: this.cotizacForm.get('ClienteCodigo')?.value,
      ClienteFilial: this.cotizacForm.get('ClienteFilial')?.value,
      AgenteCodigo: this.sTipoUsuario == 'A' ? String(this.oCalcPrecParam.Usuario) : ''
    };
    //console.table(this.oCotzClteFiltros);   

    this.clteEsValido = false;
    this.txtMensajeClientes = '';
    this.mostrarMensajeClientes = false;
    this.mostrarMensajeArticulo = false;

    if (this.oCotzClteFiltros.ClienteCodigo &&
      (this.oCotzClteFiltros.ClienteFilial !== null && this.oCotzClteFiltros.ClienteFilial !== undefined)) {

      this._cotizacClienteService.getCliente(this.oCotzClteFiltros).subscribe(
        (Response: CotzClteResponse) => {

          this.oCotzClte = Response;
          //console.dir(this.oCotzClte);

          if (this.oCotzClte.Codigo === 0) {
            this.clteEsValido = true;
            this.cotizacForm.patchValue({
              ClienteNombre: this.oCotzClte.Contenido.ClteRazonSocial,
              ClienteSucursal: this.oCotzClte.Contenido.ClteSucursal,
              txtDatosCliente: this.oCotzClte.Contenido.ClteRazonSocial + '\n' +
                this.oCotzClte.Contenido.ClteSucursal
            })

            this.sListaPrecCode = this.oCotzClte.Contenido.ListaPreciosCodigo;
            this.sParidadTipo = this.oCotzClte.Contenido.ParidadCodigo;

          } else {
            this.clteEsValido = false;
            this.cotizacForm.patchValue({
              ClienteNombre: 'Cliente NO registrado',
              ClienteSucursal: '',
              txtDatosCliente: 'Cliente NO registrado'
            })

            this.sListaPrecCode = '11';   // cuando no se indica cliente, no es el caso en este componente
            this.sParidadTipo = "N";      // cuando no se indica cliente, no es el caso en este componente
          }
        }
      );
    } else {
      this.clteEsValido = false;
      this.txtMensajeClientes = 'Debe ingresar un código de cliente y filial válidos';
      this.mostrarMensajeClientes = true;

      this.sListaPrecCode = '11';   // cuando no se indica cliente, no es el caso en este componente
      this.sParidadTipo = "N";      // cuando no se indica cliente, no es el caso en este componente

    }
  }

  /**
   * Controla la llamada al servicio que busca el artículo y calcula el precio
   * según los parámetros indicados. Si el artículo es válido, lo agrega al array
   * de artículos del documento y recalcula el total del documento.
   */
  AgregarArticulo(): void {

    const _lineaPT = this.cotizacForm.get('LineaPT')?.value;
    const _itemCode = this.cotizacForm.get('ItemCode')?.value;
    const _piezas = this.cotizacForm.get('Piezas')?.value;

    this.txtMensajeArticulo = '';
    this.mostrarMensajeArticulo = false;

    if (!this.clteEsValido) {
      this.txtMensajeArticulo = 'Debe elegir un cliente válido.';
      this.mostrarMensajeArticulo = true;
      return;
    }

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
      ClienteCodigo: this.cotizacForm.get('ClienteCodigo')?.value,
      ClienteFilial: this.cotizacForm.get('ClienteFilial')?.value,
      ItemLinea: _lineaPT,
      ItemCode: _itemCode,
      ListaPrecCode: this.sListaPrecCode,
      ParidadTipo: this.sParidadTipo,
      PiezasCosto: _piezas,
      GramosCosto: 0
    }

    this._cotizacArticuloService.getArticulo(this.oCalcPrecParam).subscribe(
      articulo => {

        //console.dir(articulo.Contenido);
        //console.log(typeof articulo.Contenido);
        //console.log(articulo.Codigo);

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
            this.calcularTotal();

            // Resetea campos para siguiente articulo
            this.cotizacForm.get('LineaPT')?.reset();
            this.cotizacForm.get('ItemCode')?.reset();
            this.cotizacForm.get('Piezas')?.setValue(1);

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

  eliminarArticulo(index: number): void {
    this.articulos.splice(index, 1);
    this.calcularTotal();
  }
  calcularTotal(): void {
    this.totalDocum = this.articulos.
      reduce((sum, item) => sum + item.Importe, 0);
  }

  /**
   * Llama el servicio para guardar registros del documento: datos generales y filas.
   */
  guardarPropuesta(): void {

    if (this.articulos.length < 1) {
      this.txtMensajeArticulo = 'Debe indicar al menos un artículo';
      this.mostrarMensajeArticulo = true;
      setTimeout(() => {
        this.txtMensajeArticulo = '';
        this.mostrarMensajeArticulo = false;
      }, 3000);   // 3 segundos
      return;
    }

    // datos generales del documento, tomados del formulario
    // Usamos getRawValue() para obtener los valores de TODOS los controles,
    // incluidos los deshabilitados (como total y total_fila).
    const _cotizacDocum: CotizacDocum = this.cotizacForm.getRawValue();
    _cotizacDocum.ListaPreciosCodigo = this.sListaPrecCode;
    _cotizacDocum.ParidadTipo = this.sParidadTipo;

    // copio a los datos del formulario el array con los artículos capturados.
    // (lo recomendado es trabajar directo con un array en el formulario, pero 
    //  ya tenía la rutina por eso lo hago así).
    _cotizacDocum.CotizacFilas = this.articulos;
    //console.dir(_cotizacDocum);

    this._cotizCrearService.guardarCotizac(this.oFiltros, _cotizacDocum).subscribe({
      next: (response) => {

        this.txtMensajeClientes = 'Propuesta guardada correctamente. Folio: ' + response.Contenido.folio;
        this.mostrarMensajeClientes = true;
        //this.mostrarModalMensaje = true;

        // No voy a actualizar el campo del formulario porque los campos acaban
        // inicializándose más adelante.
        // this.cotizacForm.patchValue({
        //   Folio: response.Contenido.folio
        // });

        // Resetea campos para documento nuevo
        if (this.sTipoUsuario != 'C') {
          this.cotizacForm.get('ClienteCodigo')?.reset();
          this.cotizacForm.get('ClienteFilial')?.reset();
          this.cotizacForm.get('ClienteNombre')?.reset();
          this.cotizacForm.get('ClienteSucursal')?.reset();
          this.cotizacForm.get('txtDatosCliente')?.reset();
        }
        this.cotizacForm.get('LineaPT')?.reset();
        this.cotizacForm.get('ItemCode')?.reset();
        this.cotizacForm.get('Piezas')?.setValue(1);

        this.articulos = [];
        this.totalDocum = 0;    // this.calcularTotal();

      },
      error: (err) => {
        console.log(err.message);
      }
    });

  }

  cerrarModalMensaje(): void {
    this.mostrarModalMensaje = false;
  }

  imprimir() {
    window.print();
  }


}
