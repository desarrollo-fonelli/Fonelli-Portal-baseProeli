/**
 * Obtiene las Paridades capturadas en la tabla inv100 originada en Proeli.
 * En esa tabla no se guarda la fecha (aunque parezca increíble).
 * -----------------------------------------------------------------------------
 * creado: drendon 12.jun.2026
 */

export interface ParidadesResponse {
  Codigo?: number;
  Mensaje?: string;
  Contenido?: ParidadesContenido;
  Paginacion?: Paginacion;
}

export interface ParidadesContenido {
  ParidadesFilas: Paridad[];
}

export interface Paridad {
  Codigo: string;
  Abreviat: string;
  Descripc: string;
  ValorCapturado: number;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
