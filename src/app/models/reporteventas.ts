export interface ReporteVentas {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido;
    Paginacion?: Paginacion;
}

export interface Contenido {
    Clientes?:            Cliente[];
    ClientesConVenta?:    ClientesConVenta;
    TotalGeneralFamilia?: TotalGeneralFamilia[];
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
    Familias?:      Familia[];
}

export interface Familia {
    FamiliaCodigo?:            string;
    FamiliaDescripc?:          string;
    Piezas1?:                  number;
    Gramos1?:                  number;
    Importe1?:                 number;
    PorcentajeImporte1?:       number;
    ValorAgregado1?:           number;
    PorcentajeValorAgregado1?: number;
    Piezas2?:                  number;
    Gramos2?:                  number;
    Importe2?:                 number;
    PorcentajeImporte2?:       number;
    ValorAgregado2?:           number;
    PorcentajeValorAgregado2?: number;
}

export interface ClientesConVenta {
    ClientesConVenta1?: number;
    ClientesSinVenta1?: number;
    ClientesTotales1?:  number;
    ClientesConVenta2?: number;
    ClientesSinVenta2?: number;
    ClientesTotales2?:  number;
}

export interface TotalGeneralFamilia {
    FamiliaCodigo?:                 string;
    FamiliaDescripc?:               string;
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
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
