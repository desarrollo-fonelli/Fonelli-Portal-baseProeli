export interface FlujoResponse {
  Codigo?: number;
  Mensaje?: string;
  Contenido?: TiposFlujo;
  Paginacion?: Paginacion;
}

export interface TiposFlujo {
  FlujosContenido: Flujo[];
}

export interface Flujo {
  TipoFlujo: string;
  SignoContable: number;
  TipoFlujoOro: number;
  TipoFlujoImporteMN: number;
  FlujoSecciones: Seccion[];
}

export interface Seccion {
  OrdPresent: number;
  Seccion: string;
  SignoContable: number;
  SeccOro: number;
  SeccImporteMN: number;
  SeccRubros: Rubro[];
}

export interface Rubro {
  Rubro: string;
  RubroDescripc: string;
  SignoContable: number;
  RubroOro: number;
  RubroImporteMN: number;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
