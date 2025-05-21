/**
 * Guias de paquete enviados, asociadas a un pedido de cliente
 * Inicialmente se llama desde el componente pedclte-lista.component.ts
 * dRendon - 13.05.2025
 */

export interface DocvtaDetalle {
  Codigo?: number;
  Mensaje?: string;
  Contenido: Contenido;
}

export interface Contenido {
  DocSerie?: string;
  DocFolio?: string;
  DocvtaArticulos: DocvtaArticulo[];
}

export interface DocvtaArticulo {
  LinPT: string;
  ItemCode: Date;
  Descripc: string;
  FechaMovInv: Date | null;
  Piezas: number;
  Gramos: number;
  Letra: string;
  Pedido: string;
}
