export interface Lineas {
    Codigo?:     number;
    Mensaje?:    string;
    Paginacion?: Paginacion;
    Contenido?:  Contenido[];
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
