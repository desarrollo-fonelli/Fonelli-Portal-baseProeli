export class FiltrosGuias {
    constructor(
      public TipoUsuario: string,
      public Usuario: number | string,
      public OficinaDesde: string,
      public OficinaHasta: string, 
      public ClienteCodigo: number | null,
      public ClienteFilial: number | null,
      public Factura?: string,
      public Remision?: string, 
      public Prefactura?: string,
      public Pedido?: string, 
      public Carrier?: string, 
      public TipoGuia?: number, 
      public Pagina?: number, 
    ){}
  }