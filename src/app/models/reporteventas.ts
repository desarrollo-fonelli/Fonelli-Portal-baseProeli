export interface ReporteVentas {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido;
    Paginacion?: Paginacion;
}

export interface Contenido {
    Clientes?:            Cliente[];
    ClientesConVenta?:    ClientesConVenta;
    TotalGeneralCategorias?: TotalGeneralCategorias[];

    TotalGeneralxPiezas1: string;
    TotalGeneralxGramos1: string;
    TotalGeneralxImporteVenta1: string;
    TotalGeneralxValorAgregado1: string;
    TotalGeneralxPiezas2: string;
    TotalGeneralxGramos2: string;
    TotalGeneralxImporteVenta2: string;
    TotalGeneralxValorAgregado2: string;

    TotalGeneralCategxPiezas1: string;
    TotalGeneralCategxGramos1: string;
    TotalGeneralCategxImporteVenta1: string;
    TotalGeneralCategxValorAgregado1: string;
    TotalGeneralCategxPiezas2: string;
    TotalGeneralCategxGramos2: string;
    TotalGeneralCategxImporteVenta2: string;
    TotalGeneralCategxValorAgregado2: string;
}

export interface Cliente {
    ClienteCodigo?: string;
    ClienteFilial?: string;
    ClienteNombre?: string;
    ClienteStatus?: string;
    Lista1?:        string;
    Lista2?:        string;
    TipoParidad?:   string;
    TipoCliente?:   string;
    AgenteCodigo?:  string;
    Categorias?:    Categorias[];

    TotalesClientexPiezas1: string;
    TotalesClientexGramos1: string;
    TotalesClientexImporteVenta1: string;
    TotalesClientexPorcentajeImporte1: string;
    TotalesClientexValorAgregado1: string;
    TotalesClientexPorcentajeValorAgregado1: string;
    TotalesClientexPiezas2: string;
    TotalesClientexGramos2: string;
    TotalesClientexImporteVenta2: string;
    TotalesClientexPorcentajeImporte2: string;
    TotalesClientexValorAgregado2: string;
    TotalesClientexPorcentajeValorAgregado2: string;
}

export interface Categorias {
    CategoriaCodigo?:   string;
    CategoriaNombre?:   string;
    Subcategorias?:     Subcategorias[];
}

export interface Subcategorias {
    SubcategoriaCodigo?:       string;
    SubcategoriaNombre?:       string;
    Piezas1?:                  number;
    Gramos1?:                  number;
    ImporteVenta1?:                 number;
    PorcentajeImporte1?:       number;
    ValorAgregado1?:           number;
    PorcentajeValorAgregado1?: number;
    Piezas2?:                  number;
    Gramos2?:                  number;
    ImporteVenta2?:                 number;
    PorcentajeImporte2?:       number;
    ValorAgregado2?:           number;
    PorcentajeValorAgregado2?: number;

    Piezas1Aux: string;
    Gramos1Aux: string;
    ImporteVenta1Aux: string;
    PorcentajeImporte1Aux: string;
    ValorAgregado1Aux: string;
    PorcentajeValorAgregado1Aux: string;

    Piezas2Aux: string;
    Gramos2Aux: string;
    ImporteVenta2Aux: string;
    PorcentajeImporte2Aux: string;
    ValorAgregado2Aux: string;
    PorcentajeValorAgregado2Aux: string;
}

export interface ClientesConVenta {
    ClientesConVenta1?: number;
    ClientesSinVenta1?: number;
    ClientesTotales1?:  number;
    ClientesConVenta2?: number;
    ClientesSinVenta2?: number;
    ClientesTotales2?:  number;
}

export interface TotalGeneralCategorias {
    CategoriaCodigo?:   string;
    CategoriaNombre?:   string;
    TotalGeneralSubcatego?:     TotalGeneralSubcatego[];
}

export interface TotalGeneralSubcatego {
    SubcategoriaCodigo?:            string;
    SubcategoriaNombre?:            string;
    TotalPiezas1?:                  number;
    TotalGramos1?:                  number;
    TotalImporte1?:                 number;
    TotalPorcentajeImporte1?:       number;
    TotalValorAgregado1?:           number;
    TotalPorcentajeValorAgregado1?: number;
    TotalPiezas2?:                  number;
    TotalGramos2?:                  number;
    TotalImporte2?:                 number;
    TotalPorcentajeImporte2?:       number;
    TotalValorAgregado2?:           number;
    TotalPorcentajeValorAgregado2?: number;

    TotalPiezas1Aux: string;
    TotalGramos1Aux: string;
    TotalImporte1Aux: string;
    TotalPorcentajeImporte1Aux: string;
    TotalValorAgregado1Aux: string;
    TotalPorcentajeValorAgregado1Aux: string;
    TotalPiezas2Aux: string;
    TotalGramos2Aux: string;
    TotalImporte2Aux: string;
    TotalPorcentajeImporte2Aux: string;
    TotalValorAgregado2Aux: string;
    TotalPorcentajeValorAgregado2Aux: string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
