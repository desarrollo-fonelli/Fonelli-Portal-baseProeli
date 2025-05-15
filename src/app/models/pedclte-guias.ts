/**
 * Guias de paquete enviados, asociadas a un pedido de cliente
 * Inicialmente se llama desde el componente pedclte-lista.component.ts
 * dRendon - 13.05.2025
 */

export interface PedclteGuias {
  Codigo?: number;
  Mensaje?: string;
  Contenido: Contenido;
}

export interface Contenido {
  PedidoLetra?: string;
  PedidoFolio?: string;
  PedidoGuias: PedidoGuia[];
}

export interface PedidoGuia {
  "GuiaFolio": string;
  "GuiaFecha": Date;
  "GuiaFechaRec": Date | null;
  "GuiaObservac": string;
  "CarrierId": string;
  "CarrierNomb": string;
  "DocSerie": string;
  "DocFolio": string;
  "DocFecExp": Date | null;
  "GuiaImporte": number;
  "GuiaIVA": number;
  "GuiaPiezas": number;
  "GuiaGramos": number;
}
