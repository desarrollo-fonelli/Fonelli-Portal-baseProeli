/**
 * Campos que se deben devolver de la API-REST
 */
export interface ArticulosResponse {
  Codigo: number;
  Mensaje: string;
  Paginacion?: Paginacion;
  Contenido: ContenidoArticulo[];
}

export interface ContenidoArticulo {
  LineaPT: string;
  ItemCode: string;
  Descripc: string;
  PrecioVenta: number
  ParidadTipo: string;
  ListaPrecCode: string
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
