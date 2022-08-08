export interface Categorias {
    Codigo?:     number;
    Mensaje?:    string;
    Paginacion?: Paginacion;
    Contenido?:  Contenido[];
}

export interface Contenido {
    CategoriaCodigo?:    string;
    Subcategoria?:  string;
    CategoriaDescripc?: string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
