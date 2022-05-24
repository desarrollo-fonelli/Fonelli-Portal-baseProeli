export interface ConsultaPedido {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido;
    Paginacion?: Paginacion;
}

export interface Contenido {
    ClienteCodigo?: string;
    ClienteFilial?: string;
    ClienteNombre?: string;
    Sucursal?:      string;
    Pedidos?:       Pedido[];
}

export interface Pedido {
    PedidoLetra?:             string;
    PedidoFolio?:             string;
    OficinaFonelliCodigo?:    string;
    PedidoStatus?:            string;
    FechaPedido?:             Date;
    FechaCancelacion?:        Date;
    FechaSurtido?:            string;
    CantidadPedida?:          number;
    CantidadSurtida?:         number;
    DiferenciaPedidoSurtido?: number;
    OficinaFonelli?:          string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
