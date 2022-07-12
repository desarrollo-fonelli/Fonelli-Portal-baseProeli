export interface FichaTecnica {
    Codigo?:    number;
    Mensaje?:   string;
    Contenido?: Contenido;
}

export interface Contenido {
    ClienteCodigo?:       string;
    ClienteNombre?:       string;
    FilialInicial?:       string;
    FilialFinal?:         string;
    Lista1Codigo?:        string;
    Lista1Descripc?:      string;
    Lista2Codigo?:        string;
    Lista2Descripc?:      string;
    LimiteCredito?:       number;
    PlazoPago?:           string;
    FechaAlta?:           Date;
    ClienteStatus?:       string;
    TipoClienteCodigo?:   string;
    TipoClienteDescripc?: string;
    TipoParidadCodigo?:   string;
    TipoParidadDescripc?: string;
    VentasAnioAnterior?:  VentasAnioA[];
    VentasAnioActual?:    VentasAnioA[];
    ResumenTipoCartera?:  ResumenTipoCartera[];
    PedidosActivos?:      PedidosActivos;
}

export interface PedidosActivos {
    PedidosNumero?: number;
    Piezas?:        number;
    Gramos?:        number;
    Importe?:       number;
}

export interface ResumenTipoCartera {
    TipoCarteraCodigo?:   string;
    TipoCarteraDescripc?: string;
    Saldo?:               number;
    SaldoVencido?:        number;
}

export interface VentasAnioA {
    CategoriaCodigo?:   string;
    CategoriaNombre?: string;
    Subcategorias?: Subcategorias[];
}


export interface Subcategorias {
    SubcategoriaCodigo?: string;
    SubcategoriaNombre?: string;
    Piezas?:          number;
    Gramos?:          number;
    Importe?:         number;
    ValorAgregado?:   number;
}
