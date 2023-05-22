export class FiltrosGuias {
    constructor(
      public TipoUsuario: string,
      public Usuario: string | number,
      public ClienteCodigo: number,
      public ClienteFilial: number,
      public Factura: string,
      public Remision: string, 
      public Prefactura: string,
      public Pedido: string, 
      public Carrier: string, 
      public TipoGuia: number, 
      public Pagina: number, 
    ){}
  }