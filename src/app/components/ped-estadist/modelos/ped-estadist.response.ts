export interface PedEstadistResponse {
  Codigo?: number;
  Mensaje?: string;
  Contenido: PedEstadFilas[];
  Paginacion: Paginacion;
}

export interface PedEstadFilas {
  Lin: string;
  Clave: string;
  Descripc: string;
  ClteNum: number;
  ClteFil: number;
  TipoPed: string;
  CantPed: number;
  GrmsPed: number;
  TipoIE: string;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
