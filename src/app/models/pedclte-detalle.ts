export interface PedclteDetalle {
  Codigo?: number;
  Mensaje?: string;
  Contenido: Contenido;
}

export interface Contenido {
  PedidoLetra?: string;
  PedidoFolio?: string;
  PedidoArticulos: PedidoArticulo[];
  CantidadPedida: number;
  CantidadPedidoProduccion: number;
  CantidadProducida: number;
  CantidadSurtida: number;
  DiferenciaProducido: number;
}

export interface PedidoArticulo {
  PedidoFila: string;
  ArticuloLinea: string;
  ArticuloCodigo: string;
  ArticuloDescripc: string;
  PedidoStatus: string;
  ArticuloCategoria: string;
  ArticuloSubcategoria: string;
  IntExt: string;
  FechaPedido: Date;
  CantidadPedida: number;
  FechaSurtido: Date;
  CantidadSurtida: number;
  DiferenciaSurtido: number;
  FacturaSerie: string;
  FacturaFolio: string;
  FechaTerminacionArticulo: Date;
  Medidas: boolean;
  cp3: number;
  cp35: number;
  cp4: number;
  cp45: number;
  cp5: number;
  cp55: number;
  cp6: number;
  cp65: number;
  cp7: number;
  cp75: number;
  cp8: number;
  cp85: number;
  cp9: number;
  cp95: number;
  cp10: number;
  cp105: number;
  cp11: number;
  cp115: number;
  cp12: number;
  cp125: number;
  cp13: number;
  cp135: number;
  cp14: number;
  cp145: number;
  cp15: number;
  cp155: number;
  mpx: string;
  cpx: number;
  PzasCompra: number;
  FechaPedidoProduccion: Date | null;
  CantidadPedidoProduccion: number;
  CantidadProducida: number;
  DiferenciaProducido: number;
  FechaProduccionArticulo: Date | null;
  SumaPzasProdCompra: number;   // suma lo producido y lo comprado
  OrdProd: string;
  OrdProdLetra: string;
  OrdProdSobre: string;
  UbicacProd: string;
  UbicacProdNomb: string;
  UbicacExis: string;
  UbicacExisNomb: string;
  Ubicacion: string;
}
