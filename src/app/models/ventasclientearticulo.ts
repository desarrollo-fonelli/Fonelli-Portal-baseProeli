export interface VentasClienteArticulo {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido:  Contenido[];
    Paginacion?: Paginacion;

    TotalPiezasGeneral: number;
    TotalGramosGeneral: string;
    TotalImpVenGeneral: string;
}

export interface Contenido {
    ClienteCodigo?: string;
    ClienteFilial?: string;
    ClienteNombre?: string;
    Categorias:    Categorias[];

    TotalPiezasxCliente: number;
    TotalGramosxCliente: string;
    TotalImpVenxCliente: string;
}

export interface Categorias {
    CategoriaCodigo?:   string;
    CategoNombre?:      string;
    Subcategorias:     Subcategorias[];

    TotalPiezasxCategoria: number;
    TotalGramosxCategoria: string;
    TotalImpVenxCategoria: string;
}

export interface Subcategorias {
    SubcategoriaCodigo?:   string;
    SubcategoriaNombre?:   string;
    LineasProducto:    LineasProducto[];

    TotalPiezasxSubCat:    number;
    TotalPiezasPorxSubCat:    string;
    TotalGramosxSubCat:    string;
    TotalGramosPorxSubCat:    string;
    TotalImpVenxSubCat:    string;
}

export interface LineasProducto {
    LineaCodigo?:       string;
    LineaDescripc?:     string;
    ColeccionDescripc?: string;
    Articulos:         Articulo[];

    TotalPiezasArticulo: number;
    TotalPiezasPorArticulo: string;
    TotalGramosArticulo: string;
    TotalGramosPorArticulo: string;
    TotalImpVenArticulo: string;
}

export interface Articulo {
    ArticuloCodigo?:   string;
    ArticuloDescripc?: string;
    ArticuloTipo?:     string;
    Piezas:           number;
    PiezasPorcentaje: number;
    Gramos:           number;
    GramosPorcentaje: number;
    ImporteVenta:     number;

    PiezasPorcentajeAux?: string;
    GramosAux?:           string;
    GramosPorcentajeAux?: string;
    ImporteVentaAux?:     string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
