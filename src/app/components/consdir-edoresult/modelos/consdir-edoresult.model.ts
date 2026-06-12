export interface EdoResultResponse {
  Codigo?: number;
  Mensaje?: string;
  Contenido?: EdoResultContenido;
  Paginacion?: Paginacion;
}

export interface EdoResultContenido {
  EdoResultSecciones: Seccion[];
}

export interface Seccion {
  OrdPresent: number;
  Seccion: string;
  SeccDescripc: string;
  SignoContable: number;
  SeccInterno: number;
  SeccExterno: number;
  SeccTotal: number;
  SeccPorcVta: number;
  SeccRubros: Rubro[];
}

export interface Rubro {
  Rubro: string;
  RubroInterno: number;
  RubroExterno: number;
  RubroTotal: number;
  RubroPorcVta: number;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
