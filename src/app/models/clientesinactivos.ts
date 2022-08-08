export interface ClienteInactivo {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    AgenteCodigo?: string;
    AgenteNombre?: string;
    Clientes?:     Cliente[];
}

export interface Cliente {
    ClienteCodigo?:          string;
    ClienteFilial?:          string;
    ClienteNombre?:          string;
    ClienteSucursal?:        string;
    Lista1?:                 string;
    Lista2?:                 string;
    Plazo?:                  number;
    DiasAtraso?:             number;
    PedidosActivos?:         string;
    SaldosCarteraCliente?:   SaldosCarteraCliente[];
    VencidosSaldosCartera?: VencidosSaldosCartera[];
}

export interface SaldosCarteraCliente {
    TipoCarteraCodigo?:           string;
    TipoCarteraDescripc?:         string;
    TotalAgenteSaldoTipoCartera?: number;
}

export interface VencidosSaldosCartera {
    TipoCarteraCodigo?:             string;
    TipoCarteraDescripc?:           string;
    TotalAgenteVencidoTipoCartera?: number;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
