export interface ConsultaGuias {
    Codigo?:     number;
    Mensaje?:    string;
    Paginacion?: Paginacion;
    Contenido:  Contenido[];
}

export interface Contenido {
    Oficina?: string;
    Serie?: string;
    Documento?: string;
    Fecha?: string;
    TC?: string;
    Carrier?: string;
    NumeroGuia?: string;
    FechaGuia?: string;
    FechaRecepcion?: string;
    Observaciones?: string;
    NumeroCliente?: string;
    Filial?: string;
    Importe?: string;
    Piezas?: string;
    Gramos?: string;
    TipoPedido?: string;
    Pedido?: string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
