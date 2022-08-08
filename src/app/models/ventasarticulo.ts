export interface VentasArticulo {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    CategoriaCodigo?:  string;
    CategoriaNombre?:  string;
    Subcategorias?: Subcategorias[];
}

export interface Subcategorias {
    SubcategoriaCodigo?:    string;
    SubcategoriaNombre?:    string;
    LineasProducto?:        LineasProducto[];
}

export interface LineasProducto {
    LineaCodigo?:       string;
    LineaDescripc?:     string;
    ColeccionDescripc?: string;
    Articulos?:         Articulo[];
}

export interface Articulo {
    ArticuloCodigo?:   string;
    ArticuloDescripc?: string;
    ArticuloTipo?:     string;
    Piezas?:           number;
    PiezasPorcentaje?: number;
    Gramos?:           number;
    GramosPorcentaje?: number;
    ImporteVenta?:     number;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
