class FiltrosReporteExpediente {
  constructor(
    public Usuario: number,
    public ClienteDesde: number,
    public FilialDesde: number,
    public ClienteHasta: number,
    public FilialHasta: number,
    public OperadorDesde: number,
    public OperadorHasta: number,
    public AgenteDesde: number,
    public AgenteHasta: number,
    public FechaDesde: string,
    public FechaHasta: string,
    public Pagina: number
  ) {}
}
