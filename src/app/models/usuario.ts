export interface Usuario {
    Codigo?:     number;
    Mensaje?:    string;
    Contenido?:  Contenido[];
    Paginacion?: Paginacion;
}

export interface Contenido {
    UsuarioCodigo?:   string;
    UsuarioNombre?:   string;
    UsuarioCorreoE?:  string;
    UsuarioPassword?: string;
    UsuarioTipo?:     string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
