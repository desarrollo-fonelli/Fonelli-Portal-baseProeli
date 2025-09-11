/************************************************************
 * Propiedades asociadas al formulario de criterios de filtro
 */
export interface FiltrosItemsConsulta {
  TipoUsuario: string,
  Usuario: string,
  ItemCode: string,
  MetodoBusqueda: string;
}

/**
 * Campos que se deben devolver de la API-REST
 */
export interface ItemsResponse {
  Codigo: number;
  Mensaje: string;
  Paginacion?: Paginacion;
  Contenido: ContenidoItem[];
}

export interface ContenidoItem {
  LineaPT: string;
  ItemCode: string;
  Descripc: string;
  ImgPath?: string;
  // PrecioVenta: number;
  // PesoPromedio: number;
  // ParidadTipo: string;
  // ListaPrecCode: string;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}

