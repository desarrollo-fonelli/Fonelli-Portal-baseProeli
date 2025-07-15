/************************************************************
 * Propiedades asociadas al formulario de criterios de filtro
 */
export class FiltrosArticulosReporte {
  constructor(
    public TipoUsuario: string,
    public Usuario: string,
    public LineaPTDesde: string,
    public LineaPTHasta: string,
    public ClienteCodigo: number | string,
    public ClienteFilial: number | string,
    public ItemCode: string,
    public Status: string,
    public BuscarSemejantes: boolean
  ) { }
}



