export interface Agentes {
    Codigo?:     number;
    Mensaje?:    string;
    Paginacion?: Paginacion;
    Contenido?:  Contenido[];
}

export interface Contenido {
    AgenteCodigo?: string;
    AgenteNombre?: string;
    Password?:     string;
    Status?:       string;
    Oficina?:      string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
