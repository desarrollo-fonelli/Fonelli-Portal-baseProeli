import {
  Component, OnInit,
  ViewChild, ElementRef
} from '@angular/core';
import { TestpedidosService } from './testpedidos.service';
import { Testpedido, Testarticulo } from './testpedidos.model';
import { Observable, of } from "rxjs";

declare var $: any;

@Component({
  selector: 'app-testdr',
  templateUrl: './testdr.component.html',
  styleUrls: ['./testdr.component.css']
})
export class TestdrComponent {

  @ViewChild('tabla1', { static: false }) tabla1!: ElementRef;
  @ViewChild('tabla2', { static: false }) tabla2!: ElementRef;

  cliente: any = { id: 1, nombre: 'Cliente EJEMPLO' };
  pedidos: Testpedido[] = [];
  articulos: Testarticulo[] = [];
  dataTable1: any;
  dataTable2: any;
  showTable1: boolean = false;
  showTable2: boolean = false;

  constructor(private _testpedidosService: TestpedidosService) { }


  // Carga la tabla principal de pedidos
  cargarPedidos() {
    this._testpedidosService.getPedidos(this.cliente.id).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.mostrarTabla1();
      },
      error: (err) => console.error('Error simulado', err)
    });
  }

  mostrarTabla1() {
    this.showTable1 = true;
    this.showTable2 = false;

    setTimeout(() => {
      //if (this.dataTable1) this.dataTable1.destroy();

      this.dataTable1 = $(this.tabla1.nativeElement).DataTable({
        data: this.pedidos,
        columns: [
          { title: 'Num Pedido', data: 'id' },
          { title: 'Fecha', data: 'fecha' },
          { title: 'Total', data: 'total' }
        ],
        dom: `<"row"<col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>` +
          `<"row"<"col-sm-12"tr>>` +
          `<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>`,
        buttons: ['excel'],
        createdRow: (row: Node, data: Testpedido) => {
          $(row).css('cursor', 'pointer');
          $(row).on('click', () => this.onSeleccionPedido(data));
        }
      });
    });
  }

  onSeleccionPedido(pedido: Testpedido) {
    this._testpedidosService.getArticulos(pedido.id).subscribe({
      next: (articulos) => {
        this.articulos = articulos;
        this.mostrarTabla2();
      },
      error: (err) => console.error('Error simulado', err)
    });
  }

  mostrarTabla2() {
    this.showTable1 = false;
    this.showTable2 = true;

    setTimeout(() => {
      if (this.dataTable2) this.dataTable2.destroy();

      this.dataTable2 = $(this.tabla2.nativeElement).DataTable({
        data: this.articulos,
        columns: [
          { title: 'Código', data: 'codigo' },
          { title: 'Descripcion', data: 'descripcion' },
          { title: 'Cantidad', data: 'cantidad' },
          { title: 'Precio', data: 'precio' }
        ],
        dom: `"<row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row"<"col-sm-12"tr>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>`,
        buttons: ['excel'],
        language: {
          emptyTable: 'No se encontraron articulos',
        }
      });
    });
  }

  volverATabla1() {
    if (this.dataTable2) this.dataTable2.destroy();
    this.showTable2 = false;
    this.showTable1 = true;
    //this.mostrarTabla1();
  }
}
