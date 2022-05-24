export interface DetallePedido {
    Codigo?:    number;
    Mensaje?:   string;
    Contenido?: Contenido;
}

export interface Contenido {
    PedidoLetra?:     string;
    PedidoFolio?:     string;
    PedidoArticulos?: PedidoArticulo[];
}

export interface PedidoArticulo {
    PedidoFila?:               number;
    ArticuloLinea?:            string;
    ArticuloCodigo?:           string;
    ArticuloDescripc?:         string;
    PedidoStatus?:             string;
    ArticuloFamilia?:          string;
    FechaPedido?:              Date;
    CantidadPedida?:           number;
    FechaSurtido?:             string;
    CantidadSurtida?:          number;
    DiferenciaSurtido?:        number;
    FacturaSerie?:             string;
    FacturaFolio?:             string;
    FechaTerminacionArticulo?: string;
    CantidadMedida4?:          number;
    CantidadMedida4_5?:        number;
    CantidadMedida5?:          number;
    CantidadMedida5_5?:        number;
    CantidadMedida6?:          number;
    CantidadMedida6_5?:        number;
    CantidadMedida7?:          number;
    CantidadMedida7_5?:        number;
    CantidadMedida8?:          number;
    CantidadMedida8_5?:        number;
    CantidadMedida9?:          number;
    CantidadMedida9_5?:        number;
    CantidadMedida10?:         number;
    CantidadMedida10_5?:       number;
    CantidadMedida11?:         number;
    CantidadMedida11_5?:       number;
    CantidadMedida12?:         number;
    CantidadMedidaP12_5?:      number;
    CantidadMedida13?:         number;
    MedidaEspecial?:           string;
    CantidadMedidaEspecial?:   number;
    FechaPedidoProduccion?:    string;
    CantidadPedidoProduccion?: number;
    CantidadProducida?:        number;
    DiferenciaProducido?:      number;
    FechaProduccionArticulo?:  string;
}
