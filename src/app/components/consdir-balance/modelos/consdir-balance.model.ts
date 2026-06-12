export interface BalanceResponse {
  Codigo?: number;
  Mensaje?: string;
  Contenido?: BalanceContenido;
  Paginacion?: Paginacion;
}

export interface BalanceContenido {
  BalanceSecciones: Seccion[];
}

export interface Seccion {
  OrdPresent: number;
  SeccionTipo: string;
  SeccionDescripc: string;
  SeccionMN: number;
  SeccionUSD: number;
  SeccionUSDconv: number;
  SeccionORO: number;
  SeccionOROconv: number;
  SeccionPLATA: number;
  SeccionPLATAconv: number;
  SeccionTotal: number;
  BalanceRubros: Rubro[];
}

export interface Rubro {
  RubroDescripc: string;
  RubroMN: number;
  RubroUSD: number;
  RubroUSDconv: number;
  RubroORO: number;
  RubroOROconv: number;
  RubroPLATA: number;
  RubroPLATAconv: number;
  RubroTotal: number;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
