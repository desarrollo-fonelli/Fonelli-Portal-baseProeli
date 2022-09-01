export interface ConsultaPedido {
    Codigo?:     number;
    Mensaje?:    string;
    Paginacion?: Paginacion;
    Contenido:  Contenido;
}

export interface Contenido {
    ClienteCodigo?: string;
    ClienteFilial?: string;
    ClienteNombre?: string;
    Sucursal?:      string;
    Pedidos:       Pedido[];
    CantidadPedida: number;
    DiferenciaPedidosSurtido: number;
}

export interface Pedido {
    PedidoLetra:              string;
    PedidoFolio:              string;
    OficinaFonelliCodigo:     string;
    Status:                   string;
    FechaPedido:              Date;
    FechaCancelacion:         Date;
    FechaSurtido:             Date | null;
    CantidadPedida:           number;
    CantidadSurtida:          number;
    DiferenciaPedidosSurtido: number;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
