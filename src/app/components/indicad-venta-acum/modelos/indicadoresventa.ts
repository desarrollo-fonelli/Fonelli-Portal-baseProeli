export interface IndicadoresVenta {
    Codigo?: number;
    Mensaje?: string;
    Contenido?: Contenido[];
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

    TotalDiariaBruto: string;
    TotalAcumuladaBruto: string;
    TotalPedidosBruto: string;
}

export interface Contenido {
    AgenteCodigo?: string;
    AgenteNombre?: string;
    ImporteVentas?: ImporteVentas;
}

export interface ImporteVentas {
    VentaDiaria?: number;
    VentasAcumuladas?: number;
    LimiteInferior?: number;
    DiferenciaLimiteInferior?: number;
    Minimo?: number;
    DiferenciaMinimo?: number;
    Meta?: number;
    DiferenciaMeta?: number;
    ImportePedidos?: number;

    DiariaBruto?: number;
    AcumuladaBruto?: number;
    PedidosBruto?: number;

    VentaDiariaAux: string;
    VentasAcumuladasAux: string;
    LimiteInferiorAux: string;
    DiferenciaLimiteInferiorAux: string;
    MinimoAux: string;
    DiferenciaMinimoAux: string;
    MetaAux: string;
    DiferenciaMetaAux: string;
    ImportePedidosAux: string;

    DiariaBrutoAux: string;
    AcumuladaBrutoAux: string;
    PedidosBrutoAux: string;
}

export interface Paginacion {
    NumFilas?: number;
    TotalPaginas?: number;
    Pagina?: number;
}
