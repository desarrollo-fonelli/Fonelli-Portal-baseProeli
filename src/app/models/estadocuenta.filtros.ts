export class FiltrosEstadoCuenta {
  constructor(
    public TipoUsuario: String,
    public Usuario: number | string,
    public ClienteDesde: number | null,
    public FilialDesde: number,
    public ClienteHasta: number | null,
    public FilialHasta: number,
    public CarteraDesde: string,
    public CarteraHasta: string,
    public Pagina: number
  ) {}
}
