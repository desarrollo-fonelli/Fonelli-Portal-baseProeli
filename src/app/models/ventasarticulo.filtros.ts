export class FiltrosVentasArticulo {
  constructor(
    public TipoUsuario: string,
    public Usuario: number,
    public OficinaDesde: string,
    public OficinaHasta: string,
    public FechaDesde: string,
    public FechaHasta: string,
    public LineaDesde: string,
    public LineaHasta: string,
    public ClaveDesde: string,
    public ClaveHasta: string,
    public CategoriaDesde: string,
    public SubcategoDesde: string,
    public CategoriaHasta: string,
    public SubcategoHasta: string,
    public TipoArticulo: string,
    public TipoOrigen: string,
    public OrdenReporte: string,
    public Presentacion: string,
    public Pagina: number
  ) {}
}
