export interface Oficina {
    Codigo?:     number;
    Mensaje?:    string;
    Paginacion?: Paginacion;
    Contenido?:  Contenido[];
}

export interface Contenido {
    OficinaCodigo?: string;
    OficinaNombre?: string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
