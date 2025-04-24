export interface ListaCfdis {
    Codigo?: number;
    Mensaje?: string;
    Paginacion?: Paginacion;
    Contenido: Contenido;
}

export interface Contenido {
    ClienteCodigo?: string;
    ClienteFilial?: string;
    ClienteNombre?: string;
    Sucursal?: string;
    ClienteRfc?: string;
    Cfdis: Cfdi[];
}

export interface Cfdi {
    Documento: string;
    Serie: string;
    Folio: string;
    Fecha: Date;
    Total: number;
    Pedido: string;
}

export interface Paginacion {
    NumFilas?: number;
    TotalPaginas?: number;
    Pagina?: number;
}
