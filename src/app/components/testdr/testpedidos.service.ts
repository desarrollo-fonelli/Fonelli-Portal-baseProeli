import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Testpedido, Testarticulo } from "./testpedidos.model";

@Injectable({
  providedIn: 'root'
})
export class TestpedidosService {

  private mockPedidos: Testpedido[] = [
    { id: 11, fecha: '2025-05-02', total: 1500, clienteId: 1 },
    { id: 12, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 13, fecha: '2025-05-14', total: 750, clienteId: 1 },
    { id: 14, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 15, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 16, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 17, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 18, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 19, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 20, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 21, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 22, fecha: '2025-05-05', total: 2300, clienteId: 1 },
    { id: 23, fecha: '2025-05-05', total: 2300, clienteId: 1 },
  ];

  private mockArticulos: Testarticulo[] = [
    { id: 333, codigo: 'CAD-333', descripcion: 'Cadena 14K amarilla', cantidad: 4, precio: 2200, pedidoId: 11 },
    { id: 444, codigo: 'CAD-444', descripcion: 'Cadena 18K rosa', cantidad: 3, precio: 3500, pedidoId: 11 },
    { id: 555, codigo: 'CAD-555', descripcion: 'Cadena 10K blanca', cantidad: 4, precio: 1750, pedidoId: 11 },
    { id: 210, codigo: 'ARG-B14', descripcion: 'Argolla 14K blanca', cantidad: 2, precio: 1400, pedidoId: 12 },
    { id: 220, codigo: 'ARG-A10', descripcion: 'Argolla 10K amarilla', cantidad: 3, precio: 1000, pedidoId: 12 },
    { id: 230, codigo: 'ARG-R18', descripcion: 'Argolla 18K rosa', cantidad: 4, precio: 2000, pedidoId: 12 },
    { id: 511, codigo: 'DIJ-R18', descripcion: 'Dije 18K rosa', cantidad: 3, precio: 2000, pedidoId: 13 },
    { id: 512, codigo: 'DIJ-R14', descripcion: 'Dije 14K rosa', cantidad: 4, precio: 1700, pedidoId: 13 },
    { id: 513, codigo: 'DIJ-R10', descripcion: 'Dije 10K rosa', cantidad: 4, precio: 1200, pedidoId: 13 },
  ];

  getPedidos(clienteId: number): Observable<Testpedido[]> {
    return of(this.mockPedidos.filter(p => p.clienteId === clienteId));
  }

  getArticulos(pedidoId: number): Observable<Testarticulo[]> {
    const articulos = this.mockArticulos.filter(a => a.pedidoId === pedidoId);
    return of(articulos.length > 0 ? articulos : []);
  }

}