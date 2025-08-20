/**
 * Esta interface representa un Documento de Venta completo,
 * incluyendo datos generales y el array de filas
 * El ID puede ser opcional si lo genera el backend al insertar
 */
export interface OrdenVenta {
  id?: number;
  folio: number;
  clt_codigo: number;
  clt_filial: number
  clt_nombre: string;
  clt_sucursal: string;
  fecha: string;
  total: number;
  filas: OrdenFila[];
}

/**
 * Interface para representar una fila individual de la Orden de Venta
 * Las propiedades con "?" las genera el backend al insertar
 */
export interface OrdenFila {
  fila_id?: number;
  ord_id?: number;
  fila_num?: number;
  itmLinPT: string
  itmCode: string;
  itmDescrip: string;
  itmKtje: string;
  piezas: number;
  gramos: number;
  tipoCosto: string;
  prec_unit: number;
  total_fila: number;
}
