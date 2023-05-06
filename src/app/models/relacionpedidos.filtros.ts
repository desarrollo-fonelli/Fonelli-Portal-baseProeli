export class FiltrosRelacionPedidos {
    constructor(
      public TipoUsuario : string,
      public Usuario: number | string,
      public OficinaDesde: string,
      public OficinaHasta: string, 
      public ClienteDesde: number | null,
      public FilialDesde: number,
      public ClienteHasta: number | null,
      public FilialHasta: number,
      public FechaPedidoDesde: string,
      public FechaPedidoHasta: string,
      public FechaCancelacDesde: string,
      public FechaCancelacHasta: string,
      public Status: string,
      public TipoPedido: string,
      public TipoOrigen: string,
      public SoloAtrasados: string,
      public Pagina: number
    ){}
}