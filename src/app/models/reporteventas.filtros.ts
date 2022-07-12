export class FiltrosReporteVentas {
  constructor( 
    public Tipo: string,
    public TipoUsuario: string,
    public Usuario: number,
    public AgenteCodigo: number,
    public ClienteDesde: number,
    public FilialDesde: number,
    public ClienteHasta: number,
    public FilialHasta: number,
    public CategoriaDesde: string,
    public SubcategoDesde: string,
    public CategoriaHasta: string,
    public SubcategoHasta: string,
    public Fecha1Desde: string,
    public Fecha1Hasta: string,
    public Fecha2Desde: string,
    public Fecha2Hasta: string,
    public TipoClienteDesde: string,
    public TipoClienteHasta: string,
    public OrdenReporte: string,
    public DesglosaCliente: string,
    public DesglosaCategoria: string,
    public TipoOrigen: string,
    public Pagina: number
  ) {}
}
