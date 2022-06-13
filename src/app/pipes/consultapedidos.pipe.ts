import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'is-plain-object';

@Pipe({
  name: 'searchconsultapedido',
})
export class SearchConsultaPedidoPipe implements PipeTransform {
  transform(value: any, searchText?: any): any {
    if (!value) return [];
    if (!searchText) return value;
    searchText = searchText.toLowerCase();
    let Pedidos: any = [];

    for (let pedido of value) {
      for (var key in pedido) {
        if (pedido[key]) {
          if (pedido[key].toString().toLowerCase().includes(searchText)) {
            Pedidos.push(pedido);
            break;
          }
        }
      }
    }

    console.log(Pedidos);

    return Pedidos;
  }
}
