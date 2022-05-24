class FiltrosReporteVentas {
  constructor(
    public Usuario: number,
    public AgenteCodigo: number,
    public ClienteDesde: number,
    public FilialDesde: number,
    public ClienteHasta: number,
    public FilialHasta: number,
    public FamiliaDesde: string,
    public FamiliaHasta: string,
    public Fecha1Desde: string,
    public Fecha1Hasta: string,
    public Fecha2Desde: string,
    public Fecha2Hasta: string,
    public TipoClienteDesde: string,
    public TipoClienteHasta: string,
    public Orden: string,
    public DesglosaCliente: string,
    public DesglosaFamilia: string,
    public TipoOrigen: string,
    public Pagina: number
  ) {}
}
