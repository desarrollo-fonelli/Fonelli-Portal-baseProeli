export class FiltroIndicadoresVenta {
  constructor(
    public AgenteDesde: number,
    public AgenteHasta: number,
    public FechaCorte: string,
    public Pagina: number,
    public TipoUsuario: string,
    public Usuario: number|string
  ) {}
}
