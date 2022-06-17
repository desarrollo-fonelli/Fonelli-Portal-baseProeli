export interface ConsultaPrecios {
    Codigo?:    number;
    Mensaje?:   string;
    Contenido?: Contenido;
}

export interface Contenido {
    ClienteCodigo?:           string;
    ClienteFilial?:           string;
    ClienteNombre?:           string;
    ListaNumero?:             string;
    TipoListaCodigo?:         string;
    TipoListaDescripc?:       string;
    TipoParidadCodigo?:       string;
    TipoParidadDescripc?:     string;
    ArticuloCodigoBarras?:    string;
    ArticuloLinea?:           string;
    LineaDescripc?:           string;
    ArticuloCodigo?:          string;
    ArticuloDescripc?:        string;
    TipoCalculoDescripc?:     string;
    TipoCosteoCodigo?:        string;
    TipoCosteoDescripc?:      string;
    "Valor agregado"?:        number;
    CodigoNormalEquivalente?: string;
    Precio?:                  number;
    Componentes?:             Componente[];
}

export interface Componente {
    ComponenteGrupo?:    string;
    ComponenteLinea?:   string;
    ComponenteCodigo?:   string;
    ComponenteDescripc?: string;
    PiezasNormal?:       number;
    GramosNormal?:       number;
    PiezasEquivalente?:  number;
    GramosEquivalente?:  number;
}
