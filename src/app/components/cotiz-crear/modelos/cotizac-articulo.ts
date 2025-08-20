/**
 * cotizac-articulos.ts
 * Interfaces utilizadas para filtros y response en los 
 * servicios que se refieren al catálogo de artículos
 */
export interface ColtzArticFiltros {
  TipoUsuario: string;
  Usuario: number | string;
  LineaPT: string;
  ItemCode: string;
}

export interface CotzArticResponse {
  LineaPT: string;
  ItemCode: string;
  Descripc: string;
  Precio: number;
  Gramos: number;
  TipoCosteo: string;
  Kilataje: string;
  IntExt: string;
}
