export interface GuiasResponse {
  Codigo?: number;
  Mensaje?: string;
  Paginacion?: Paginacion;
  Contenido: ContenidoPaquete;
}

export interface ContenidoPaquete {
  ClienteCodigo?: string;
  ClienteFilial?: string;
  ClienteNombre?: string;
  ClienteSucursal?: string;
  Paquetes?: Paquete[];
}

export interface Paquete {
  Paquete?: string;
  FechaPaq?: Date | null;
  Status?: string;
  Guia?: string;
  Carrier?: string;
  CarrierNom?: string;
  FechaRecep?: Date | null;
  Observac?: string;
  TotPiezas?: number;
  TotGramos?: number;
  TotImporte?: number;
  TotIva?: number;
  GuiaDocums?: GuiaDocum[];
}

export interface GuiaDocum {
  Oficina?: string;
  DocTipo: string;
  DocSerie: string;
  DocFolio: string;
  DocFecha: Date | null;
  DocFecVenc: Date | null;
  DocImporte: number;
  DocIva: number;
  DocPiezas: number;
  DocGramos: number;
  PedLetra?: string;
  Pedido?: string;
  OrdenComp?: string | null;
  OrdCompFecha?: Date | null;
  OrdCompFechaCon?: Date | null;
  OrdCompBodDest?: string | null;
  OrdCompBodRec?: string | null;
  OrdCompContraRec?: string | null;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
