export interface CotizListarResponse {
  Codigo?: number;
  Mensaje?: string;
  Paginacion?: Paginacion;
  Contenido: CotizListarContenido;
}

export interface CotizListarContenido {
  CotizDocumentos: CotizDocum[];
}

export interface CotizDocum {
  DocId: number,
  Folio: number;
  Fecha: string;
  Status: string;
  ClienteCodigo: number;
  ClienteFilial: number;
  ClienteNombre: string;
  ClienteSucursal: string | null;
  AgenteCodigo: number;
  PzasDoc: number;
  GrmsDoc: number;
  ImporteDoc: number;
  ListaPreciosCodigo: string;
  ParidadTipo: string;
  Comentarios: string;
  expanded: boolean;    // se usa para controlar presentación de filas en datatables
  FilasDoc: DocFila[];
}

export interface DocFila {
  Fila: number;
  LineaPT: string;
  ItemCode: string;
  Descripc: string;
  Precio: number;
  Costo: number;
  Piezas: number;
  Gramos: number;
  TipoCosteo: string;
  Importe: number;
  Kilataje: string;
  IntExt: string;
  LPrecDirComp: string;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}