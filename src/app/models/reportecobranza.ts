export interface ReporteCobranza {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido;
    Paginacion?: Paginacion;
}

export interface Contenido {
    Clientes?:             Cliente[];
    ResumenStatusCliente?: ResumenStatusCliente[];
    ResumenTipoCliente?:   ResumenTipoCliente[];
    ResumenTipoCartera?:   ResumenTipoCartera[];
}

export interface Cliente {
    ClienteCodigo?:  string;
    ClienteFilial?:  string;
    ClienteNombre?:  string;
    SucursalNombre?: string;
    ClienteStatus?:  string;
    TipoCartera?:    TipoCartera[];
}

export interface TipoCartera {
    TipoCarteraCodigo?: string;
    Oficinas?:          Oficina[];
}

export interface Oficina {
    OficinaFonelliCodigo?: string;
    OficinaFonelliNombre?: string;
    Series?:               Series[];
}

export interface Series {
    DocumentoSerie?: string;
    Documentos?:     Documento[];
}

export interface Documento {
    DocumentoFolio?:   string;
    FechaExpedicion?:  Date;
    FechaVencimiento?: Date;
    Cargos?:           number;
    Abonos?:           number;
    Saldo?:            number;
    DiasVencimiento?:  number;
    SaldoVencido?:     number;
}

export interface ResumenStatusCliente {
    StatusClienteDescripc?: string;
    StatusClienteNumero?:   number;
}

export interface ResumenTipoCartera {
    TipoCarteraCodigo?:       string;
    TipoCarteraDescripc?:     string;
    TipoCarteraCargos?:       number;
    TipoCarteraAbonos?:       number;
    TipoCarteraSaldo?:        number;
    TipoCarteraSaldoVencido?: number;
}

export interface ResumenTipoCliente {
    TipoClienteCodigo?: string;
    TipoClienteTotal?:  number;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
