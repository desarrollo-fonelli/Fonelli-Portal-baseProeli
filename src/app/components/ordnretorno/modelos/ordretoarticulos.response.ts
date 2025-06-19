export interface OrdRetoArticulosResponse {
  Codigo?: number;
  Mensaje?: string;
  Contenido: OrdRetoArtContenido;
}

export interface OrdRetoArtContenido {
  Folio?: string;
  OrdRetoArticulos: OrdRetoArticulo[];
}

export interface OrdRetoArticulo {
  LineaPT: string;
  ClaveArticulo: string;
  Piezas: number;
  Gramos: number;
  Descripcion: string;
  Status: string;
}

