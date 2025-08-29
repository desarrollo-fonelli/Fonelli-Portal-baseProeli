export interface CotizacDocum {
  ClienteCodigo: number;
  ClienteFilial: number;
  Folio: number;
  FechaDoc: Date | null;
  StatusDoc: string;
  ClienteNombre: string;
  ClienteSucursal: string;
  ListaPreciosCodigo: string;
  ParidadTipo: string;
  Comentarios: string;
  CotizacFilas: CotizacFila[];
}

export interface CotizacFila {
  LineaPT: string;
  ItemCode: string;
  Descripc: string;
  Precio: number;
  Costo: number;
  Piezas: number;
  Gramos: number;
  TipoCosteo: string;   // 1=Piezas 2=Gramos
  Importe: number;
  Kilataje: string;
  IntExt: string;   // I=Interno E=Externo
  LPrecDirComp: string;  // 1=ListPrec Directa 2=ListPrec Componentes
}

export interface CotizFiltros {
  TipoUsuario: string;
  Usuario: number | string;
  ClienteCodigo: number | null;
  ClienteFilial: number | null;
  AgenteCodigo: number | string;
}
