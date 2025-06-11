import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumArticulosService } from './docum-articulos.service'
import { DocumArticulos, DocModelo } from './modelos/docum-articulos';
import { DocumArticFiltros } from 'src/app/components/guias2025/modelos/documartic.filtros';
import { Usuario } from '../../models/usuario';


@Component({
  selector: 'app-docum-articulos',
  templateUrl: './docum-articulos.component.html',
  styleUrls: ['./docum-articulos.component.css'],
  providers: [DocumArticulosService]
})
export class DocumArticulosComponent implements OnInit {

  @Input() oDocArtFiltros!: DocumArticFiltros;

  public oDocumArticulosResponse: DocumArticulos;    // response detalle documentos
  public DocumArticulos: DocModelo[];            // nodo del response con detalle de articulos

  constructor(
    public activeModal: NgbActiveModal,
    private _documArticulosService: DocumArticulosService
  ) {
    this.oDocumArticulosResponse = {} as DocumArticulos;
    this.DocumArticulos = [];
  }

  ngOnInit(): void {
    const paramFiltros = this.oDocArtFiltros;
    //console.log('🔸 estoy en ngOnInit');
    //console.dir(paramFiltros);
    this.SelectDocArticulos(paramFiltros);
  }

  SelectDocArticulos(paramFiltros: any): void {

    this._documArticulosService.Get(paramFiltros).subscribe(
      (Response: DocumArticulos) => {
        this.oDocumArticulosResponse = Response;
        this.DocumArticulos = this.oDocumArticulosResponse.Contenido.DocModelos;

        if (this.oDocumArticulosResponse.Codigo != 0) {
          console.error('No se encontraron articulos documento: ' +
            paramFiltros.DocSerie + paramFiltros.DocFolio);
          this.DocumArticulos = [];
          return;
        }
      },
      (error: DocumArticulos) => {
        this.oDocumArticulosResponse = error;
        console.error(this.oDocumArticulosResponse);
        this.DocumArticulos = [];
      }
    );

  }

}
