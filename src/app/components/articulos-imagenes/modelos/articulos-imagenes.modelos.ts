export interface ArticulosImagenes {
  // en vez de esta interfaz, usar ItemsResponse y ContenidoItem,
  // para reducir cambios en código heredado
}

/**
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

/**
 * Definición de cada artículo devuelto por la API-REST
 */
export interface ContenidoItem {
  LineaPT: string;
  ItemCode: string;
  Descripc: string;
  ImgPath?: string;
}

/**
 * Por compatibilidad con paginación genérica
 */
export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
