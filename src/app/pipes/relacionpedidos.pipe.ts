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
          //console.log(itempedido.PedidoFolio);
          if (itempedido.PedidoFolio.toString().toLowerCase().includes(searchText)) {
            pedido.push(itempedido);
          }
        }     
        
        if (pedido.length > 0) {
          tipopedido.push({
            TipoPedidoCodigo: tp.TipoPedidoCodigo,
            TipoPedido: tp.TipoPedido,
            Pedidos: pedido
          });
        }  
        pedido = [];      
      }  
      if (tipopedido.length > 0) {
        contenido.push({
          OficinaFonelliCodigo: cont.OficinaFonelliCodigo,
          OficinaFonelliNombre: cont.OficinaFonelliNombre,
          TipoPedido: tipopedido,
        });
      }  
    }

    //console.log("regresa JSON:"+JSON.stringify(contenido));    
    return contenido;
  }
}
