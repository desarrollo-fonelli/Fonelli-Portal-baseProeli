export interface OrdenesReparacion {
    Codigo?:    number;
    Mensaje?:   string;
    Contenido?: Contenido;
}

export interface Contenido {
    OrdenFolio?:           string;
    OrdenStatus?:          string;
    ClienteCodigo?:        string;
    ClienteFilial?:        string;
    ClienteNombre?:        string;
    OficinaFonelliCodigo?: string;
    OficinaFonelliNombre?: string;
    AgenteCodigo?:         string;
    FechaRegistro?:        Date;
    FechaRecepcion?:       Date;
    FechaEntrega?:         string;
    Observaciones?:        string;
    ArticulosOrden?:       ArticulosOrden[];
}

export interface ArticulosOrden {
    ArticuloLinea?:    string;
    ArticuloCodigo?:   string;
    ArticuloDescripc?: string;
    Piezas?:           number;
    Gramos?:           number;
    Serie?:            string;
    Referencia?:       string;
}
