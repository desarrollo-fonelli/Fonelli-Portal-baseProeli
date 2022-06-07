export interface EstadoCuenta {
    Codigo:     number;
    Mensaje:    string;
    Paginacion: Paginacion;
    Contenido:  Contenido;
}

export interface Contenido {
    Clientes:             Cliente[];
    ResumenTipoCartera:   ResumenTipoCartera[];
    ResumenStatusCliente: ResumenStatusCliente[];
    ResumenTipoCliente:   ResumenTipoCliente[];
}

export interface Cliente {
    ClienteCodigo: string;
    ClienteFilial: string;
    ClienteNombre: string;
    Sucursal:      string;
    TipoCartera:   TipoCartera[];
}

export interface TipoCartera {
    TipoCarteraCodigo:   string;
    TipoCarteraDescripc: string;
    Movimientos:         Movimiento[];
}

export interface Movimiento {
    OficinaFonelliCodigo: string;
    DocumentoSerie:       string;
    DocumentoFolio:       string;
    FechaExpedicion:      string;
    FechaVencimiento:     string;
    Cargos:               number;
    Abonos:               number;
    Saldo:                number;
    DiasVencimiento:      number;
    SaldoVencido:         number;
    Documento2Serie:      string;
    Referencia:           string;
}

export interface ResumenStatusCliente {
    StatusClienteDescripc: string;
    StatusClienteNumero:   number;
}

export interface ResumenTipoCartera {
    TipoCarteraCodigo:       string;
    TipoCarteraDescripc:     string;
    TipoCarteraCargos:       number;
    TipoCarteraAbonos:       number;
    TipoCarteraSaldo:        number;
    TipoCarteraSaldoVencido: number;
}

export interface ResumenTipoCliente {
    TipoClienteCodigo: string;
    TipoClienteTotal:  number;
}

export interface Paginacion {
    NumFilas:     number;
    TotalPaginas: number;
    Pagina:       number;
}