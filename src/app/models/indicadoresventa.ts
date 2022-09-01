export interface IndicadoresVenta {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;

    TotalVentaDiaria: string;
    TotalVentasAcumuladas: string;
    TotalLimiteInferior: string;
    TotalDiferenciaLimiteInferior: string;
    TotalMinimo: string;
    TotalDiferenciaMinimo: string;
    TotalMeta: string;
    TotalDiferenciaMeta: string;
    TotalImportePedidos: string;

    TotalCliInaInactivosActual: string;
    TotalCliInaLimiteInferior: string;
    TotalCliInaDiferenciaLimiteInferior: string;
    TotalCliInaMinimo: string;
    TotalCliInaDiferenciaMinimo: string;
    TotalCliInaMeta: string;
    TotalCliInaDiferenciaMeta: string;
    TotalCliInaTotalClientes: string;
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
    Meta?:                     number;
    DiferenciaMeta?:           number;
    TotalClientes?:            number;

    InactivosActualAux: string;
    LimiteInferiorAux: string;
    DiferenciaLimiteInferiorAux: string;
    MinimoAux: string;
    DiferenciaMinimoAux: string;
    MetaAux: string;
    DiferenciaMetaAux: string;
    TotalClientesAux: string;
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

    VentaDiariaAux: string;
    VentasAcumuladasAux: string;
    LimiteInferiorAux: string;
    DiferenciaLimiteInferiorAux: string;
    MinimoAux: string;
    DiferenciaMinimoAux: string;
    MetaAux: string;
    DiferenciaMetaAux: string;
    ImportePedidosAux: string;    
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
