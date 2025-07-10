export interface CalcPrecResponse {
  LineaPT: string;      // Línea de producto
  ItemCode: string;     // Código del artículo
  Descripc: string;     // Descripción del artículo
  Kilataje: string;     // Kilataje del artículo
  IntExt: string;       // Interno o externo
  Medidas: string;      // Medidas del artículo
  Formulac: string;     // Fórmulación a utilizar
  TipoCosteo: string;   // Tipo de costeo
  ItemGramos: number;   // Peso promedio de la pieza según componente metal
  PrecioVenta: number;  // Precio de venta del artículo
  PrecioCosto: number;  // Precio de costo del artículo
  Moneda: string;       // Moneda del artículo
}
