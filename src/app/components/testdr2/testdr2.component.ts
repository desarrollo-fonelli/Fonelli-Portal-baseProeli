import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Toast } from 'bootstrap';

declare var $: any;

@Component({
  selector: 'app-testdr2',
  templateUrl: './testdr2.component.html',
  styleUrls: ['./testdr2.component.css']
})
export class Testdr2Component implements OnInit {

  pedidos = [
    { id: 1, fecha: '2025-05-02', total: 1000 },
    { id: 2, fecha: '2025-05-05', total: 500 },
    { id: 3, fecha: '2025-05-09', total: 1500 },
    { id: 4, fecha: '2025-05-14', total: 2300 },
    { id: 5, fecha: '2025-05-02', total: 1000 },
    { id: 6, fecha: '2025-05-05', total: 500 },
    { id: 7, fecha: '2025-05-09', total: 1500 },
    { id: 8, fecha: '2025-05-14', total: 2300 },
    { id: 9, fecha: '2025-05-02', total: 1000 },
    { id: 10, fecha: '2025-05-05', total: 500 },
    { id: 11, fecha: '2025-05-09', total: 1500 },
    { id: 12, fecha: '2025-05-14', total: 2300 }
  ];

  articulosPorPedido: { [key: number]: any[] } = {
    1: [
      { codigo: 'A001', descripcion: 'Articulo A', cantidad: 2, precio: 100 },
      { codigo: 'B002', descripcion: 'Articulo B', cantidad: 4, precio: 200 },
    ],
    2: [
      { codigo: 'C003', descripcion: 'Articulo C', cantidad: 1, precio: 500 }
    ],
    3: [
      { codigo: 'D004', descripcion: 'Articulo D', cantidad: 5, precio: 300 },
      { codigo: 'A001', descripcion: 'Articulo A', cantidad: 2, precio: 100 },
      { codigo: 'B002', descripcion: 'Articulo B', cantidad: 4, precio: 200 },
      { codigo: 'C003', descripcion: 'Articulo C', cantidad: 1, precio: 500 },
      { codigo: 'D004', descripcion: 'Articulo D', cantidad: 5, precio: 300 },
      { codigo: 'A001', descripcion: 'Articulo A', cantidad: 2, precio: 100 },
      { codigo: 'B002', descripcion: 'Articulo B', cantidad: 4, precio: 200 },
      { codigo: 'D004', descripcion: 'Articulo D', cantidad: 5, precio: 300 },
      { codigo: 'A001', descripcion: 'Articulo A', cantidad: 2, precio: 100 },
      { codigo: 'B002', descripcion: 'Articulo B', cantidad: 4, precio: 200 },
      { codigo: 'C003', descripcion: 'Articulo C', cantidad: 1, precio: 500 },
      { codigo: 'C003', descripcion: 'Articulo C', cantidad: 1, precio: 500 }
    ],
    12: [
      { codigo: 'D004', descripcion: 'Articulo D', cantidad: 5, precio: 300 },
      { codigo: 'A001', descripcion: 'Articulo A', cantidad: 2, precio: 100 },
      { codigo: 'B002', descripcion: 'Articulo B', cantidad: 4, precio: 200 },
      { codigo: 'C003', descripcion: 'Articulo C', cantidad: 1, precio: 500 },
      { codigo: 'D004', descripcion: 'Articulo D', cantidad: 5, precio: 300 }
    ]
  };

  articulos: any[] = [];

  mostrarTabla1 = true;
  mostrarTabla2 = false;

  dtInstanceTabla1: any;
  dtInstanceTabla2: any;

  toasts: { message: string, class: string, ariaLive: string }[] = [];


  constructor() { }

  ngOnInit(): void {
    this.mostrarToast('Datos precargados correctamente', 'bg-success');

    setTimeout(() => {
      this.dtInstanceTabla1 = $('#tabla1').DataTable({
        dom: 'Bfrtip',
        buttons: ['excel'],
        destroy: true,
        responsive: true
      })
    }, 0);
  }

  verDetallePedido(pedidoId: number): void {
    const detalle = this.articulosPorPedido[pedidoId];
    if (!detalle) {
      this.mostrarToast('No hay articulos para este pedido', 'bg-warning');
      return
    }

    this.articulos = detalle;
    this.mostrarTabla1 = false;
    this.mostrarTabla2 = true;

    setTimeout(() => {
      this.dtInstanceTabla2 = $('#tabla2').DataTable({
        dom: 'Bfrtip',
        buttons: ['excel'],
        destroy: true,
        responsive: true
      })
    }, 0);
  }

  volverATabla1(): void {
    if (this.dtInstanceTabla2) {
      this.dtInstanceTabla2.destroy();
      $('#tabla2').empty();
    }

    this.articulos = [];
    this.mostrarTabla2 = false;
    this.mostrarTabla1 = true;
  }

  mostrarToast(message: string, cssClass: string): void {
    const toast = {
      message,
      class: cssClass + ' toast',
      ariaLive: 'assertive'
    };

    this.toasts.push(toast);

    setTimeout(() => {
      const index = this.toasts.indexOf(toast);
      if (index !== -1) this.toasts.splice(index, 1);
    }, 5000);

  }

  removeToast(toast: any): void {
    const index = this.toasts.indexOf(toast);
    if (index !== -1) this.toasts.splice(index, 1);
  }

  ngOnDestroy(): void {
    if (this.dtInstanceTabla1) this.dtInstanceTabla1.destroy();
    if (this.dtInstanceTabla2) this.dtInstanceTabla2.destroy();
  }
}
