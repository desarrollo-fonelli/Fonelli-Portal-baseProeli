export interface Familias {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    FamiliaCodigo?:   string;
    FamiliaDescripc?: string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
