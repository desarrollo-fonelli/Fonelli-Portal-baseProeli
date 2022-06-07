export interface DetallePedido {
    Codigo?:    number;
    Mensaje?:   string;
    Contenido: Contenido;
}

export interface Contenido {
    PedidoLetra?:     string;
    PedidoFolio?:     string;
    PedidoArticulos: PedidoArticulo[];
}

export interface PedidoArticulo {
    PedidoFila:               string;
    ArticuloLinea:            string;
    ArticuloCodigo:           string;
    ArticuloDescripc:         string;
    PedidoStatus:             string;
    ArticuloCategoria:        string;
    ArticuloSubcategoria:     string;
    FechaPedido:              Date;
    CantidadPedida:           null;
    FechaSurtido:             Date;
    CantidadSurtida:          number;
    DiferenciaSurtido:        number;
    FacturaSerie:             string;
    FacturaFolio:             string;
    FechaTerminacionArticulo: Date;
    CantidadMedida4:          number;
    CantidadMedida4_5:        number;
    CantidadMedida5:          number;
    CantidadMedida5_5:        number;
    CantidadMedida6:          number;
    CantidadMedida6_5:        number;
    CantidadMedida7:          number;
    CantidadMedida7_5:        number;
    CantidadMedida8:          number;
    CantidadMedida8_5:        number;
    CantidadMedida9:          number;
    CantidadMedida9_5:        number;
    CantidadMedida10:         number;
    CantidadMedida10_5:       number;
    CantidadMedida11:         number;
    CantidadMedida11_5:       number;
    CantidadMedida12:         number;
    CantidadMedida12_5:       number;
    CantidadMedida13:         number;
    MedidaEspecial:           string;
    CantidadMedidaEspecial:   number;
    FechaPedidoProduccion:    Date | null;
    CantidadPedidoProduccion: number;
    CantidadProducida:        number;
    DiferenciaProducido:      number;
    FechaProduccionArticulo:  Date | null;
}
