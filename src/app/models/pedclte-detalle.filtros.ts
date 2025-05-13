export class FiltrosPedclteDetalle {
  constructor(
    public TipoUsuario: string | null,
    public Usuario: number | string,
    public PedidoLetra: string,
    public PedidoFolio: number,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null
  ) { }
}