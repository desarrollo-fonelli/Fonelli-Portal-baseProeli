export interface RelacionPedidos {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    OficinaFonelliCodigo?: string;
    OficinaFonelliNombre?: string;
    TipoPedido:           TipoPedido[];
}

export interface TipoPedido {
    TipoPedidoCodigo?: string;
    TipoPedido?:       string;
    Pedidos:          Pedido[];
}

export interface Pedido {
    PedidoLetra?:                       string;
    PedidoFolio:                       string;
    ClienteCodigo?:                     string;
    ClienteFilial?:                     string;
    FechaPedido?:                       Date;
    FechaPedidoProduccion?:             Date;
    FechaCancelacion?:                  Date;
    PedidoStatus?:                      string;
    DiasAtraso?:                        number;
    CantidadPedida:                    number;
    CantidadPedidaImporte:             number;
    CantidadPedidaValorAgregado:       number;
    CantidadSurtida:                   number;
    CantidadSurtidaImporte:            number;
    CantidadSurtidaValorAgregado:      number;
    DiferenciaCantidadSurtido?:         number;
    DiferenciaImporteSurtido:          number;
    CantidadPedidaProduccion?:          number;
    CantidadProducida?:                 number;
    DiferenciaValorAgregado?:           number;
    DiferenciaCantidadProducido:       number;
    InternoExterno?:                    string;
    DiferenciaCantidadPedidoSurtido?:   number;
    DiferenciaImportePedidoSurtido?:    number;
    DiferenciaCantidadPedidoProducido?: number;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
