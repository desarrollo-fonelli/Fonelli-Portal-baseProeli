export class FiltrosEstadoCuenta {
  constructor(
    public TipoUsuario: String,
    public Usuario: number,
    public ClienteDesde: number,
    public FiliadDesde: number,
    public ClienteHasta: number,
    public FilialHasta: number,
    public CarteraDesde: string,
    public CarteraHasta: string,
    public Pagina: number
  ) {}
}
