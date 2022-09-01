export interface RelacionPedidos {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido:  Contenido[];
    Paginacion?: Paginacion;
    TotalPedidosGranTotal: number;
    TotalCanPedGranTotal: string;
    TotalImportesGranTotal: string;
    TotalCPValorAgregadoGranTotal: string;
    TotalCanSurtidaGranTotal: string;
    TotalCanSurtidaImporteGranTotal: string;
    TotalCSValorImporteGranTotal: string;
    TotalDifCantidadSurtGranTotal: string;
    TotalDifImporteSurtidoGranTotal: string;
    TotalDifValorAgregadoGranTotal: string;
    TotalCantPedProdGranTotal: number;
    TotalCantidadProdGranTotal: number;
    TotalDifCantidadProdGranTotal: number;


}

export interface Contenido {
    OficinaFonelliCodigo?: string;
    OficinaFonelliNombre?: string;
    TipoPedido:           TipoPedido[];
    TotalPedidosOficina:  number;
    TotalCanPedOficina: string;
    TotalImportesOficina: string;
    TotalCPValorAgregadoOficina: string;
    TotalCanSurtidaOficina: string;
    TotalCanSurtidaImporteOficina: string;
    TotalCSValorImporteOficina: string;
    TotalDifCantidadSurtOficina: string;
    TotalDifImporteSurtidoOficina: string;
    TotalDifValorAgregadoOficina: string;
    TotalCantPedidoProdOficina: number;
    TotalCantidadProducidaOficina: number;
    TotalDifCantidadProdOficina: number;
}

export interface TipoPedido {
    TipoPedidoCodigo?: string;
    TipoPedido?:       string;
    Pedidos:          Pedido[];
    TotalPedidos:   number;
    TotalCanPed:    string;
    TotlImportes:    string;
    TotalCPValorAgregado:    string;
    TotalCanSurtida:    string;
    TotalCanSurtidaImporte:    string;
    TotalCSValorImporte:    string;
    TotalDifCantidadSurt:    string;
    TotalDifImporteSurtido:    string;
    TotalDifValorAgregado:    string;
    TotalCantPedidaProd:    number;
    TotalCantidadProd:    number;
    TotalDifCantidadProd:    number;
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

    CantidadPedidaAux:                    string;
    CantidadPedidaImporteAux:             string;
    CantidadPedidaValorAgregadoAux:       string;
    CantidadSurtidaAux:                   string;
    CantidadSurtidaImporteAux:            string;
    CantidadSurtidaValorAgregadoAux:      string;
    DiferenciaCantidadSurtidoAux?:         string;
    DiferenciaImporteSurtidoAux:          string;
    CantidadPedidaProduccionAux?:          string;
    CantidadProducidaAux?:                 string;
    DiferenciaValorAgregadoAux?:           string;
    DiferenciaCantidadProducidoAux:       string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
