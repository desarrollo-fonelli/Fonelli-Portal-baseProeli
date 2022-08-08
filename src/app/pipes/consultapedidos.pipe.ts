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

    //(console.log("Este valor :"+JSON.stringify(value));
    for (let pedido of value) {
        if (pedido.PedidoFolio.toString().toLowerCase().includes(searchText)) {
          Pedidos.push(pedido);
        }
    }

    //console.log(Pedidos);
    return Pedidos;
  }
}

