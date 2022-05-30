export interface Clientes {
    Codigo:     number;
    Mensaje:    string;
    Paginacion: Paginacion;
    Contenido:  Contenido[];
}

export interface Contenido {
    ClienteCodigo?:  string;
    ClienteFilial?:  string;
    RazonSocial?:    string;
    Password?:       string;
    DatosGenerales: DatosGenerales;
    Condiciones:    Condiciones;
    Contactos:      Contactos;
}

export interface Condiciones {
    OficinaAtencionCodigo?:     string;
    OficinaAtencionNombre?:     string;
    TipoListaPrecios?:          string;
    TipoListaPreciosDescripc?:  string;
    TipoListaPrecios2?:         string;
    TipoListaPrecios2Descripc?: string;
    ParidadCodigo?:             string;
    ParidadDescripc?:           string;
    PagoRefBanamex?:            string;
    LimiteCredito?:             string;
    Plazo?:                     string;
    FechaAlta?:                 Date;
}

export interface Contactos {
    Contacto1Nombre?:          string;
    Contacto1ApellidoPaterno?: string;
    Contacto1ApellidoMaterno?: string;
    Contacto1Email?:           string;
    Contacto2Nombre?:          string;
    Contacto2ApellidoPaterno?: string;
    Contacto2ApellidoMaterno?: string;
    Contacto2Email?:           string;
}

export interface DatosGenerales {
    Sucursal?:            string;
    Status?:              string;
    TipoClienteCodigo?:   string;
    TipoClienteDescripc?: string;
    Calle?:               string;
    NumExterior?:         string;
    NumInterior?:         string;
    Colonia?:             string;
    AlcaldiaNombre?:      string;
    CiudadPoblacion?:     string;
    EntidadNombre?:       string;
    CodigoPostal?:        number;
    PaisNombre?:          string;
    Rfc?:                 string;
    Lada?:                string;
    Telefono?:            string;
    AgenteCodigo?:        string;
    AgenteNombre?:        string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
