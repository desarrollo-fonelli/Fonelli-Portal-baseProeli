import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'is-plain-object';

@Pipe({
  name: 'searchrelacionpedidos',
})
export class SearchRelacionPedidosPipe implements PipeTransform {
  transform(value: any, searchText?: any): any {
    if (!value) return [];
    if (!searchText) return value;
    searchText = searchText.toLowerCase();
    let contenido: any = [];
    let tipopedido: any = [];
    let pedido: any = [];

    for (let cont of value) {
      for (let tp of cont.TipoPedido) {
        for (let itempedido of tp.Pedidos) {
          for (var key in itempedido) {
            if (itempedido[key]) {
              if (
                itempedido[key].toString().toLowerCase().includes(searchText)
              ) {
                pedido.push(itempedido);
                break;
              }
            }
          }
        }

        if (pedido.length > 0) {
          tipopedido.push({
            TipoPedidoCodigo: tp.TipoPedidoCodigo,
            TipoPedido: tp.TipoPedido,
            Movimientos: pedido
          });
        }
      }
      if (tipopedido.length > 0) {
        contenido.push({
          OficinaFonelliCodigo: cont.OficinaFonelliCodigo,
          OficinaFonelliNombre: cont.OficinaFonelliNombre,
          TipoPedido: tipopedido,
        });
      }
    }

    return contenido;
  }
}
