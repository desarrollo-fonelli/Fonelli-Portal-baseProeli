class FiltrosRelacionPedidos {
    constructor(
      public  Usuario: number,
      public OficinaDesde: string,
      public OficinaHasta: string, 
      public ClienteDesde: number,
      public FilialDesde: number,
      public ClienteHasta: number,
      public FilialHasta: number,
      public FechaPedidoDesde: string,
      public FechaPedidoHasta: string,
      public FechaCancelacionDesde: string,
      public FechaCancelacionHasta: string,
      public Estatus: string,
      public TipoPedido: string,
      public TipoOrigen: string,
      public Atrasados: string,
      public Pagina: number
    ){}
}