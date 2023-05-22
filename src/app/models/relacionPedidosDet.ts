export interface RelacionPedidosDet {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido;
    Paginacion?: Paginacion;
}

export interface Contenido {
    DetallePedido : PedidoDet[];
}

export interface PedidoDet {
    PedidoFolio: string;
    ClienteCodigo?: string;
    ClienteFilial?: string;
    FechaPedido?: Date;
    ArticuloLinea: string;
    ArticuloCodigo: string;
    ArticuloDescripc: string;
    PedidoStatus: string;
    ArticuloCategoria: string;
    ArticuloSubcategoria: string;
    CantidadPedida: number;
    FechaSurtido: Date;
    CantidadSurtida: number;
    DiferenciaSurtido: number;
    FacturaSerie: string;
    FacturaFolio: string;
    FechaTerminacionArticulo: Date;
    CantidadPedidoProduccion: number;
    CantidadProducida: number;
    DiferenciaProducido: number;
    FechaProduccionArticulo: Date;
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
    MedidaEspecial: string;
    CantidadMedidaEspecial: number;   
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}