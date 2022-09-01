export interface VentasClienteArticuloPzasImp {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido:  Contenido[];
    Paginacion?: Paginacion;

    TotalPiezasGeneral: number;
    TotalGramosGeneral: string;
    TotalImpVenGeneral: string;
}

export interface Contenido {
    CategoriaCodigo?:   string;
    CategoriaNombre?:      string;
    Subcategorias:     Subcategorias[];

    TotalPiezasxCategoria: number;
    TotalGramosxCategoria: string;
    TotalImpVenxCategoria: string;
}


export interface Subcategorias {
    SubcategoriaCodigo?:   string;
    SubcategoriaNombre?:   string;
    Detalle:    Detalle[];

    TotalPiezasxSubCat:    number;
    TotalPiezasPorxSubCat:    string;
    TotalGramosxSubCat:    string;
    TotalGramosPorxSubCat:    string;
    TotalImpVenxSubCat:    string;
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

    PiezasAux:            string;
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
