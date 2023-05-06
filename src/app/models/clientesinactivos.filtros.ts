export class FiltrosClientesInactivos {
  constructor(
    public AgenteDesde: number,
    public AgenteHasta: number,
    public TipoUsuario: string,
    public Usuario: string,
    public Pagina: number
  ) {}
}
