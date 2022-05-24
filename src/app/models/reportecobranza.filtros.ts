class FiltrosReporteCobranza {
  constructor(
    public Usuario: number,
    public OficinaDesde: string,
    public OficinaHasta: string,
    public ClienteDesde: number,
    public FilialDesde: number,
    public ClienteHasta: number,
    public FilialHasta: number,
    public CarteraDesde: string,
    public CarteraHasta: string,
    public TipoClienteDesde: string,
    public TipoClienteHasta: string,
    public StatusCliente: string,
    public Pagina: number
  ) {}
}
