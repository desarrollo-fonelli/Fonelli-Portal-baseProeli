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
    ResumenCartera?:  ResumenCartera[];
    PedidosActivos?:      PedidosActivos;

    TotalGenAnioAntPiezas: string;
    TotalGenAnioAntGramos: string;
    TotalGenAnioAntImporte: string;
    TotalGenAnioAntValorAgregado: string;

    TotalGenAnioActPiezas: string;
    TotalGenAnioActGramos: string;
    TotalGenAnioActImporte: string;
    TotalGenAnioActValorAgregado: string;
}

export interface PedidosActivos {
    PedidosNumero?: number;
    Piezas?:        number;
    Gramos?:        number;
    Importe?:       number;
}

export interface ResumenCartera {
    TipoCarteraCodigo?:   string;
    TipoCarteraDescripc?: string;
    TipoCarteraSaldo?:               number;
    TipoCarteraSaldoVencido?:        number;

    TipoCarteraSaldoAux:               string;
    TipoCarteraSaldoVencidoAux:        string;
}

export interface VentasAnioA {
    CategoriaCodigo?:   string;
    CategoriaNombre?: string;
    Subcategorias?: Subcategorias[];

    TotalCatPiezasAnioAnt: string;
    TotalCatGramosAnioAnt: string;
    TotalCatImporteAnioAnt: string;
    TotalCatValorAgregadoAnioAnt: string;

    TotalCatPiezasAnioAct: string;
    TotalCatGramosAnioAct: string;
    TotalCatImporteAnioAct: string;
    TotalCatValorAgregadoAnioAct: string;
}


export interface Subcategorias {
    SubcategoriaCodigo?: string;
    SubcategoriaNombre?: string;
    Piezas?:          number;
    Gramos?:          number;
    Importe?:         number;
    ValorAgregado?:   number;

    PiezasAnioAntAux?:          string;
    GramosAnioAntAux?:          string;
    ImporteAnioAntAux?:         string;
    ValorAgregadoAnioAntAux?:   string;

    PiezasAnioActAux?:          string;
    GramosAnioActAux?:          string;
    ImporteAnioActAux?:         string;
    ValorAgregadoAnioActAux?:   string;
}
