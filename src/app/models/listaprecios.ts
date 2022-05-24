export interface ListaPrecios {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    ListaCodigo?:   string;
    ListaDescripc?: string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
