import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdRetoArticulosServicio } from './servicios/ordretoarticulos.service'
import { OrdRetoArticulosResponse, OrdRetoArticulo } from './modelos/ordretoarticulos.response';
import { OrdRetoArticulosFiltros } from './modelos/ordretoarticulos.filtros';

@Component({
  selector: 'app-ordretoarticulos',
  templateUrl: './ordretoarticulos.component.html',
  styleUrls: ['./ordretoarticulos.component.css'],
  providers: [OrdRetoArticulosServicio]
})
export class OrdretoarticulosComponent implements OnInit {

  @Input()
  oArticFiltros!: OrdRetoArticulosFiltros;

  oOrdRetoArticulosResponse: OrdRetoArticulosResponse;
  oOrdRetoArticulos: OrdRetoArticulo[];


  constructor(
    public activeModal: NgbActiveModal,
    private _ordRetoArticulosServicio: OrdRetoArticulosServicio
  ) {
    this.oOrdRetoArticulosResponse = {} as OrdRetoArticulosResponse;
    this.oOrdRetoArticulos = [];
  }

  ngOnInit(): void {
    const paramFiltros = this.oArticFiltros;
    this.SelectArticulos(paramFiltros);
  }

  SelectArticulos(paramFiltros: any): void {
    this._ordRetoArticulosServicio.Get(paramFiltros).subscribe(
      (Response: OrdRetoArticulosResponse) => {
        this.oOrdRetoArticulosResponse = Response;
        this.oOrdRetoArticulos = this.oOrdRetoArticulosResponse.Contenido.OrdRetoArticulos;

        if (this.oOrdRetoArticulosResponse.Codigo != 0) {
          console.error('No se encontraron articulos documento: ' +
            paramFiltros.Folio);
          this.oOrdRetoArticulos = [];
          return;
        }
      },
      (error: OrdRetoArticulosResponse) => {
        this.oOrdRetoArticulosResponse = error;
        console.error(this.oOrdRetoArticulosResponse);
        this.oOrdRetoArticulos = [];
      }
    );
  }

}
