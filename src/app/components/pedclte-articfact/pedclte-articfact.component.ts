import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PedclteListaFiltros } from 'src/app/models/pedclte-lista.filtros';
import { PedidoGuia } from '../../models/pedclte-guias';
import { DocvtaDetalle, DocvtaArticulo } from '../../models/docvta-detalle';
import { DocvtaDetalleService } from '../../services/docvta-detalle.service';


@Component({
  selector: 'app-pedclte-articfact',
  templateUrl: './pedclte-articfact.component.html',
  styleUrls: ['./pedclte-articfact.component.css'],
  providers: [DocvtaDetalleService]
})
export class PedclteArticfactComponent implements OnInit {

  //@Input() guia: any;
  @Input() oFiltros: PedclteListaFiltros;
  @Input() guia: PedidoGuia;

  public oDocvtaDetalleResult: DocvtaDetalle;   // response detalle documentos
  public DocvtaArticulos: DocvtaArticulo[];     // nodo del response con detalle de articulos

  constructor(
    public activeModal: NgbActiveModal,
    private _docvtaDetalleService: DocvtaDetalleService
  ) {
    this.oDocvtaDetalleResult = {} as DocvtaDetalle;
    this.DocvtaArticulos = [];
  }

  ngOnInit(): void {
    const oFiltros = this.oFiltros;
    const DocSerie = this.guia.DocSerie;
    const DocFolio = this.guia.DocFolio;
    this.obtenerArticulos(oFiltros, DocSerie, DocFolio);
  }

  obtenerArticulos(oFiltros: PedclteListaFiltros, DocSerie: string, DocFolio: string): void {

    console.log(DocSerie + "-" + DocFolio);

    this._docvtaDetalleService.Get(oFiltros, DocSerie, DocFolio).subscribe(
      (Response: DocvtaDetalle) => {

        this.oDocvtaDetalleResult = Response;
        this.DocvtaArticulos = this.oDocvtaDetalleResult.Contenido.DocvtaArticulos;
        //console.log(this.DocvtaArticulos);

        if (this.oDocvtaDetalleResult.Codigo != 0) {
          console.error('No se encontraron articulos documento: ' + DocSerie + DocFolio);
          this.DocvtaArticulos = [];
          return;
        }

      },
      (error: DocvtaDetalle) => {
        this.oDocvtaDetalleResult = error;
        console.error(this.oDocvtaDetalleResult);
        this.DocvtaArticulos = [];
      }
    );

  }
}
