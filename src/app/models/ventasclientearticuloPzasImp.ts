export interface VentasClienteArticuloPzasImp {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    CategoriaCodigo?:   string;
    CategoriaNombre?:      string;
    Subcategorias:     Subcategorias[];
}

export interface Subcategorias {
    SubcategoriaCodigo?:   string;
    SubcategoriaNombre?:   string;
    Detalle:    Detalle[];
}


export interface Detalle {
    ClienteCodigo?:   string;
    ClienteFilial?:   string;
    LineaCodigo?:   string;
    ArticuloCodigo?:   string;
    ArticuloDescripc?: string;
    ArticuloTipo?:     string;
    Piezas:           number;
    PiezasPorcentaje: number;
    Gramos:           number;
    GramosPorcentaje: number;
    ImporteVenta:     number;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
