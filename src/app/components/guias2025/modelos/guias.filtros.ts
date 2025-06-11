export class GuiasFiltros {
  constructor(
    public TipoUsuario: string | null,
    public Usuario: number | string,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null,
    public OficinaDesde: string,
    public OficinaHasta: string,
    public PaqueteBuscar: number | string | null,
    public DocTipoBuscar: string,
    public DocSerieBuscar: string | null,
    public DocFolioBuscar: number | string | null,
    public PedLetraBuscar: string,
    public PedidoBuscar: string | null,
    public OrdCompBuscar: string | null,
    public CarrierBuscar: string | null,
    public FechaDesdeBuscar: string | null,
    public DocumSinGuia: string | null,
    public Pagina?: number
  ) { }
}

