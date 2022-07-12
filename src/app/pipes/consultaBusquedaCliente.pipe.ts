import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'is-plain-object';
import { Clientes } from '../models/clientes';

@Pipe({
  name: 'searchconsultaCliente',
})
export class SearchConsultaClientePipe implements PipeTransform {
  transform(value: any, searchText?: any): any {
    if (!value) return [];
    if (!searchText) return value;
    searchText = searchText.toLowerCase();
    let Clientes: any = [];

    //(console.log("Este valor :"+JSON.stringify(value));
    for (let cliente of value) {
        if (cliente.RazonSocial.toString().toLowerCase().includes(searchText)) {
            Clientes.push(cliente);
        }else if(cliente.ClienteCodigo.toString().toLowerCase().includes(searchText)){
            Clientes.push(cliente);
        }else if(cliente.DatosGenerales.Sucursal.toString().toLowerCase().includes(searchText)){
            Clientes.push(cliente);
        }
    }

    //console.log("Armado clientes:"+Clientes);
    return Clientes;
  }
}

