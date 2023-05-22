export interface Carriers {
    Codigo:     number;
    Mensaje:    string;
    Paginacion: Paginacion;
    Contenido:  Contenido[];
}

export interface Contenido {
    CarrierCodigo?:  string;
    CarrierNombre?:  string;
    Url?:    string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
