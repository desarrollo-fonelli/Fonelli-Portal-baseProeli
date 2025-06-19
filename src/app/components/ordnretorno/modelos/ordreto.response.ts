export interface OrdRetoResponse {
  Codigo?: number;
  Mensaje?: string;
  Paginacion?: Paginacion;
  Contenido: OrdRetoContenido;
}

export interface OrdRetoContenido {
  OrdRetoCltes: OrdRetoClte[];
}

export interface OrdRetoClte {
  ClienteCodigo?: string;
  ClienteFilial?: string;
  ClienteNombre?: string;
  ClienteSucursal?: string;
  AgenteCodigo?: string;
  AgenteNom?: string;
  OrdRetoDocs?: OrdRetoDoc[];
}

export interface OrdRetoDoc {
  Folio?: string;
  Status: string;
  GuiaEmi: string;
  Carrier: string;
  CarrierNom: string;
  Piezas: number;
  Gramos: number;
  Descripc: string;
  Kilataje: string;
  ValorMerc: number;
  TipoOrden: string;
  TipoOrdDesc: string;
  Referencia: string;
  TipoDefec: string;
  TipoDefDesc: string;
  Email: string;
  FechaSolic: Date | null;
  FechaAutor: Date | null;
  FechaEmis: Date | null;
  FechaRecep: Date | null;
  FechaLiber: Date | null;
  FechaEnvio: Date | null;
  Guia: string;
  Serie: string;
  Documento: string;
  PiezasO: number;
  GramosO: number;
  OpeRec: string;
  OpeNom: string;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}