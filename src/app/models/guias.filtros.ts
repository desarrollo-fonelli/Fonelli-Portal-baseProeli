export class FiltrosGuias {
  constructor(
    public TipoUsuario: string,
    public Usuario: number | string,
    public OficinaDesde: string,
    public OficinaHasta: string,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null,
    public ClteCredito?: string | null,
    public Paquete?: string | null,
    public FactSerie?: string | null,
    public Factura?: string | null,
    public Remision?: string | null,
    public PrefaSerie?: string | null,
    public Prefactura?: string | null,
    public Pedido?: string | null,
    public Traspaso?: string | null,
    public OrdenRetorno?: string | null,
    public Carrier?: string | null,
    public OrdenCompra?: string | null,
    public Pagina?: number,
  ) { }
}