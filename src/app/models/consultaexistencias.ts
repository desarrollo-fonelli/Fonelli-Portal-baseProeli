export interface ConsultaExist {
  Codigo?: number;
  Mensaje?: string;
  Paginacion?: Paginacion;
  Contenido: ContenidoExist[];
}

export interface ContenidoExist {
  Linea: string;
  Clave: string;
  Descripcion: string;
  Oficina: string;
  Tipo: string;
  Almacen: string;
  Nombre: string;
  IE: string;
  ExPiezas: number;
  ExGramos: number;
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}
