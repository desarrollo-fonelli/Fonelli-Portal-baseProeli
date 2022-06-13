import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'is-plain-object';

@Pipe({
  name: 'searchventasclientearticulo',
})
export class SearchVentasClienteArticuloPipe implements PipeTransform {
  transform(value: any, searchText?: any): any {
    if (!value) return [];
    if (!searchText) return value;
    searchText = searchText.toLowerCase();
    let contenido: any = [];
    let categorias: any = [];
    let subcategorias: any = [];
    let lineas: any = [];
    let articulos: any = [];

    for (let cont of value) {

      for (let ct of cont.Categorias) {
        for (let sct of ct.Subcategorias) {
          for (let lp of sct.LineasProducto) {
            for (let art of lp.Articulos) {
              for (var key in art) {
                if (art[key]) {
                  if (art[key].toString().toLowerCase().includes(searchText)) {
                    articulos.push(art);
                    break;
                  }
                }
              }
            }

            if (articulos.length > 0) {
              lineas.push({
                LineaCodigo: lp.LineaCodigo,
                LineaDescripc: lp.LineaDescripc,
                ColeccionDescripc: lp.ColeccionDescripc,
                Articulos: articulos
              });
            }
            articulos = [];
          }
          if (lineas.length > 0) {
            subcategorias.push({
              SubcategoriaCodigo: sct.SubcategoriaCodigo,
              SubcategoriaNombre: sct.SubcategoriaNombre,
              LineasProducto: lineas
            });
          }
          lineas=[];
        }
        if (subcategorias.length > 0) {
          categorias.push({
            CategoriaCodigo: ct.CategoriaCodigo,
            CategoriaNombre: ct.CategoriaNombre,
            Subcategorias: subcategorias
          });
        }
        subcategorias=[];
      }


      if (categorias.length > 0) {
        contenido.push({
          ClienteCodigo: cont.ClienteCodigo,
          ClienteFilial: cont.ClienteFilial,
          ClienteNombre: cont.ClienteNombre,
          Categorias: categorias
        });
      }
      categorias=[];
    }

    return contenido;
  }
}
