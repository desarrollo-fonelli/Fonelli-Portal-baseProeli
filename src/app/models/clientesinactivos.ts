export interface ClienteInactivo {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;

    CtaCorrMN_SAL: string;
    CtaCorrORO_SAL: string;
    CtaCorrDLLS_SAL: string;
    CtaDocMN_SAL: string;
    CtaDocORO_SAL: string;
    CtaDocDLLS_SAL: string;
    CtaCorrMN_VEN: string;
    CtaCorrORO_VEN: string;
    CtaCorrDLLS_VEN: string;
    CtaDocMN_VEN: string;
    CtaDocORO_VEN: string;
    CtaDocDLLS_VEN: string;
}

export interface Contenido {
    AgenteCodigo?: string;
    AgenteNombre?: string;
    Clientes?:     Cliente[];

    CtaCorrMN_SAL: string;
    CtaCorrORO_SAL: string;
    CtaCorrDLLS_SAL: string;
    CtaDocMN_SAL: string;
    CtaDocORO_SAL: string;
    CtaDocDLLS_SAL: string;
    CtaCorrMN_VEN: string;
    CtaCorrORO_VEN: string;
    CtaCorrDLLS_VEN: string;
    CtaDocMN_VEN: string;
    CtaDocORO_VEN: string;
    CtaDocDLLS_VEN: string;
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

    CtaCorrMN_SAL: string;
    CtaCorrORO_SAL: string;
    CtaCorrDLLS_SAL: string;
    CtaDocMN_SAL: string;
    CtaDocORO_SAL: string;
    CtaDocDLLS_SAL: string;
    CtaCorrMN_VEN: string;
    CtaCorrORO_VEN: string;
    CtaCorrDLLS_VEN: string;
    CtaDocMN_VEN: string;
    CtaDocORO_VEN: string;
    CtaDocDLLS_VEN: string;
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
