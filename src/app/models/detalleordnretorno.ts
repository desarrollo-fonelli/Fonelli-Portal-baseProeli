export interface Detalleordnretorno {
  Codigo?: number;
  Mensaje?: string;
  Contenido: Contenido;
}

export interface Contenido {
  Folio?: string;
  Articulos: Articulo[];
}

export interface Articulo {
  Fecha: Date | null;
  FechaCanc: Date | null;
  LineaPT: string;
  ClaveArticulo: string;
  Piezas: number;
  Gramos: number;
  Descripcion: string;
  Status: string;
  RefSerie: string;
  Referencia: string;
  Tipo: string;
}

