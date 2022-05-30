export interface Gerentes {
    Codigo?:     number;
    Mensaje?:    string;
    Paginacion?: Paginacion;
    Contenido?:  Contenido[];
}

export interface Contenido {
    GerenteCodigo?: string;
    GerenteNombre?: string;
    Password?:      string;
    Status?:        string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
