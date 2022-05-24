export interface IndicadoresVenta {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    AgenteCodigo?:      string;
    AgenteNombre?:      string;
    ImporteVentas?:     ImporteVentas;
    ClientesInactivos?: ClientesInactivos;
    ClientesListas?:    ClientesListas;
}

export interface ClientesInactivos {
    InactivosActual?:          number;
    LimiteInferior?:           number;
    DiferenciaLimiteInferior?: number;
    Minimo?:                   number;
    DiferenciaMinimo?:         number;
    Meta?:                     number | string;
    DiferenciaMeta?:           number;
    TotalClientes?:            number;
}

export interface ClientesListas {
    ListasRango1?: string;
    ListasRango2?: string;
    ListasRango3?: string;
    ListasRango4?: string;
}

export interface ImporteVentas {
    VentaDiaria?:              number;
    VentasAcumuladas?:         number;
    LimiteInferior?:           number;
    DiferenciaLimiteInferior?: number;
    Minimo?:                   number;
    DiferenciaMinimo?:         number;
    Meta?:                     number;
    DiferenciaMeta?:           number;
    ImportePedidos?:           number;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
