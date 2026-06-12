export interface ConsdirComercialResponse {
  Codigo?: number;
  Mensaje?: string;
  Contenido?: ConsdirComercialContenido;
  Paginacion?: Paginacion;
}

export interface ConsdirComercialContenido {
  GruposFilas: GruposDocum[];
  Pedidos: Pedidos;
}

export interface GruposDocum {
  OrdPresent: number;
  GrupoCodigo: string;
  GrupoDescripc: string;
  GrupoImporte: number;
  GrupoValorAgregado: number;
  GrupoPorcFact: number;
  Documentos: Documento[];
}

export interface Documento {
  DocCodigo: string;
  DocDescripc: string;
  DocImporte: number;
  DocValorAgregado: number;
  DocPorcFact: number;
}

export interface Pedidos {
  Importe: number;
  Costo: number;
  ValorAgregado: number;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
