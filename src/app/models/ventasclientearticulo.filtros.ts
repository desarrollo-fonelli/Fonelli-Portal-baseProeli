export class FiltrosVentaArticuloCliente {
  constructor(
    public TipoUsuario: String | null,
    public Usuario: number,
    public OficinaDesde: string,
    public OficinaHasta: string,
    public FechaDesde: string,
    public FechaHasta: string,
    public ClienteDesde: number | null,
    public FilialDesde: number,
    public ClienteHasta: number | null,
    public FilialHasta: number,
    public LineaDesde: string,
    public LineaHasta: string,
    public ClaveDesde: string,
    public ClaveHasta: string,
    public CategoriaDesde: string,
    public SubcategoriaDesde: string ,
    public CategoriaHasta: string,
    public SubcategoriaHasta: string ,
    public FamiliaDesde: string,
    public FamiliaHasta: string,
    public TipoArticulo: string,
    public TipoOrigen: string,
    public OrdenReporte: string,
    public Presentacion: string,
    public Pagina: number
  ) {}
}
