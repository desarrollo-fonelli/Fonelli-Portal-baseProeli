export interface DetalleGuia {
    Codigo?:    number;
    Mensaje?:   string;
    Contenido: Contenido;    
}

export interface Contenido {
    PedidoLetra?:     string;
    PedidoFolio?:     string;
    Articulos: Articulos[];
}


export interface Articulos {
    Linea?:     string;
    Clave?:     string;
    Descripcion: string;
    FechaPedido: string;
    CantidadPedido: string;
    GramoPedido: string;
    FechaSurtido: string;
    CantidadSurtido: string;
    GramosSurtidos: string;
    Estatus: string;
}
