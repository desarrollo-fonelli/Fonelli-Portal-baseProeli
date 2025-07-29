export interface PrepedDetalleResponse {
  Codigo: number;
  Mensaje: string;
  Contenido: PrepedDetalleContenido;
}

export interface PrepedDetalleContenido {
  PedLetra?: string;
  PedFolio?: string;
  PedItems: PedItem[];
}

export interface PedItem {
  Renglon: number;
  ItemLinea: string;
  ItemCodigo: string;
  ItemDescripc: string;
  ItemStatus: string;
  Piezas: number;
  Gramos: number;
  Precio: number;
  TipoCosto: number;
  Importe: number;
  Medidas: boolean;
  IntExt: string;
  ItemAlta: string;
  Observac: string;
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
  mpx: number;
  cpx: number;
}