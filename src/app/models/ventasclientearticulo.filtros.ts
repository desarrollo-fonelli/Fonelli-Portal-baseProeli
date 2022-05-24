class FiltrosVentaArticuloCliente {
  constructor(
    public Usuario: number,
    public OficinaDesde: string,
    public OficinaHasta: string,
    public FechaDesde: string,
    public FechaHasta: string,
    public ClienteDesde: number,
    public FilialDesde: number,
    public ClienteHasta: number,
    public FilialHasta: number,
    public LineaDesde: string,
    public LineaHasta: string,
    public ClaveDesde: string,
    public ClaveHasta: string,
    public FamiliaDesde: string,
    public FamiliaHasta: string,
    public TipoArticulo: string,
    public TipoOrigen: string,
    public Orden: string,
    public Presentacion: string,
    public Pagina: number
  ) {}
}
