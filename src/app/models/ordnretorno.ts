export interface Ordnretorno {
  Codigo?: number;
  Mensaje?: string;
  Paginacion?: Paginacion;
  Contenido: Contenido;
}

export interface Contenido {
  ClienteCodigo?: string;
  ClienteFilial?: string;
  ClienteNombre?: string;
  ClienteSucursal?: string;
  Ordenes: OrdenReto[];
}

export interface OrdenReto {
  Folio?: string;
  Status: string;
  Agente: string;
  ClienteCodigo: string;
  ClienteFilial: string;
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
  ClteNom: string;
  AgenteNom: string;
  FechaSolic: Date | null;
  FechaAutor: Date | null;
  FechaEmis: Date | null;
  FechaRecep: Date | null;
  FechaLiber: Date | null;
  FechaEnvio: Date | null;
  Guia: string;
  Serie: string;
  Documento: string;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}