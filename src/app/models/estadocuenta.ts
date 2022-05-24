export interface EstadoCuenta {
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
    TipoCartera?:    TipoCartera[];
}

export interface TipoCartera {
    TipoCarteraCodigo?:   string;
    TipoCarteraDescripc?: string;
    Movimientos?:         Movimiento[];
}

export interface Movimiento {
    OficinaFonelliCodigo?: string;
    DocumentoSerie?:       string;
    DocumentoFolio?:       string;
    FechaExpedicion?:      Date;
    FechaVencimiento?:     Date;
    Cargos?:               number;
    Abonos?:               number;
    Saldo?:                number;
    DiasVencimiento?:      number;
    SaldoVencido?:         number;
    Documento2Serie?:      string;
    Referencia?:           string;
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
