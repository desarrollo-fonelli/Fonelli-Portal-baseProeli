export interface IndicVentaResponse {
  Codigo?: number;
  Mensaje?: string;
  Contenido?: IndicadoresContenido;
  Paginacion?: Paginacion;
}

export interface IndicadoresContenido {
  IndicadoresVenta: IndicadorAgente[];
}

export interface IndicadorAgente {
  AgteCodigo?: string;
  AgteNombre?: string;
  AgteEficienc?: number;
  AgteComision?: number;
  Indicadores?: Indicador[];
}

export interface Indicador {
  "IndicadId": number;
  "IndicadDesc": string;
  "Objetivo": number;
  "Resultado": number;
  "PorcResult": number;
  "PorcCump": number;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}

