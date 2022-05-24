export interface ReporteExpediente {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    ClienteCodigo?: string;
    ClienteNombre?: string;
    Sucursal?:      Sucursal[];
}

export interface Sucursal {
    ClienteFilial?:   string;
    ClienteSucursal?: string;
    Expediente?:      Expediente[];
}

export interface Expediente {
    FechaRegistro?:  Date;
    HoraRegistro?:   string;
    OperadorCodigo?: string;
    OperadorNombre?: string;
    AgenteCodigo?:   string;
    AgenteNombre?:   string;
    Nota?:           string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
