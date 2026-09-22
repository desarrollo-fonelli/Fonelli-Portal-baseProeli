export interface TiposPedidoList {
    Codigo?: number;
    Mensaje?: string;
    Paginacion?: Paginacion;
    Contenido?: TipoPedRow[];
}

export interface TipoPedRow {
    TipoPedCodigo?: string;
    TipoPedDescripc?: string;
    TipoPedParamet?: string;
}

export interface Paginacion {
    NumFilas?: number;
    TotalPaginas?: number;
    Pagina?: number;
}
