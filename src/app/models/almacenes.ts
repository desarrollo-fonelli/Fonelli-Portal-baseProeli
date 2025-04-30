export interface Almacenes {
    Codigo?: number;
    Mensaje?: string;
    Paginacion?: Paginacion;
    Contenido?: Almacen[];
}

export interface Almacen {
    AlmTipo?: string;
    AlmNum?: string;
    AlmNom?: string;
    AlmStatus?: string;
    ALmOfic?: string;
}

export interface Paginacion {
    NumFilas?: number;
    TotalPaginas?: number;
    Pagina?: number;
}
