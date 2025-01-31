import { GuiasComponent } from '../components/guias/guias.component';
export interface ConsultaGuias {
    Codigo?:     number;
    Mensaje?:    string;
    Paginacion?: Paginacion;
    Contenido:  Contenido;
}

export interface Contenido {
    ClienteCodigo?: string;
    ClienteFilial?: string;
    ClienteNombre?: string;
    ClienteSucursal?: string;
    Guias: Guia[];
}

export interface Guia {
    Paquete?:       string;
    FechaPaq?:      Date | null;
    Oficina?:       string;
    SeriePref?:     string;
    Prefactura?:    string;
    Serie?:         string;
    Factura?:       string;
    OrdenComp?:     string;
    Traspaso?:      string;
    OrdenReto:      string;
    Piezas?:        number;
    Gramos?:        number;
    Importe?:       number;
    FechaExpe?:     Date | null;
    Carrier?:       string;
    Guia?:          string;
    Stat?:          string;
    FechaRece?:     Date | null;
    Observac?:      string;
    Cliente?:       string;
    Filial?:        string;
}

export interface Paginacion {
    NumFilas?:     number;
    TotalPaginas?: number;
    Pagina?:       number;
}
