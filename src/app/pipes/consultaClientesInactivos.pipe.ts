import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'is-plain-object';

@Pipe({
  name: 'searchconsultaCliInac',
})
export class SearchConsultaClientesInacPipe implements PipeTransform {
  transform(value: any, searchText?: any): any {
    if (!value) return [];
    if (!searchText) return value;
    searchText = searchText.toLowerCase();
    let clientes: any = [];

    //(console.log("Este valor :"+JSON.stringify(value));
    for (let Clientes of value) {
        if (Clientes.ClienteCodigo.toString().toLowerCase().includes(searchText)) {
            clientes.push(Clientes);
        }
    }

    //console.log(Clientes);
    return clientes;
  }
}

