export interface Lineas {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    LineaCodigo?:    string;
    LineaDescripc?:  string;
    LineaColeccion?: string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
