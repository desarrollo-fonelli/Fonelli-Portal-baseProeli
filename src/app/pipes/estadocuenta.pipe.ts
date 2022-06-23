import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'is-plain-object';

@Pipe({
  name: 'searchestadocuenta',
})
export class SearchEstadoCuentaPipe implements PipeTransform {
  transform(value: any, searchText?: any): any {
    if (!value) return [];
    if (!searchText) return value;
    searchText = searchText.toLowerCase();
    let clientes: any = [];
    let carteras: any = [];
    let movimientos: any = [];


    for (let clie of value) {
      for (let TC of clie.TipoCartera) {


        for (let movimiento of TC.Movimientos) {
          console.log(TC.TipoCarteraCodigo);
          console.log(movimiento.DocumentoFolio);
          if (movimiento.DocumentoFolio.toString().toLowerCase().includes(searchText)) {
            movimientos.push(movimiento);
          }         
        }

        
        if (movimientos.length > 0) {
          carteras.push({
            TipoCarteraCodigo: TC.TipoCarteraCodigo,
            TipoCarteraDescripc: TC.TipoCarteraDescripc,
            Movimientos: movimientos
          });
        }
        movimientos = [];
      }

      if (carteras.length > 0) {
        clientes.push({
          ClienteCodigo: clie.ClienteCodigo,
          ClienteFilial: clie.ClienteFilial,
          ClienteNombre: clie.ClienteNombre,
          Sucursal: clie.Sucursal,
          TipoCartera: carteras
        });
      }

    }

    console.log(JSON.stringify(clientes));
    return clientes;
  }
}
