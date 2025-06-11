/**
 * Articulos contenidos en un documento de venta o inventario
 * incluido en un paquete o guía.
 * Inicialmente se llama desde docum-articulos.componente.ts
 * dRendon | 06.06.2025
 */

export interface DocumArticulos {
  Codigo?: number;
  Mensaje?: string;
  Contenido: Contenido;
}

export interface Contenido {
  DocTipo?: string;
  DocSerie?: string;
  DocFolio?: string;
  DocModelos: DocModelo[];
}

export interface DocModelo {
  LinPT: string;
  ItemCode: Date;
  Descripc: string;
  Piezas: number;
  Gramos: number;
  Letra: string;
  Ref: string;
  CodigoMovInv: string;
  FechaMovInv: Date | null;
}

