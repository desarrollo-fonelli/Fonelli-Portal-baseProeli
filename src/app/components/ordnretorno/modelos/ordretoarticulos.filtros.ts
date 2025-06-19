export class OrdRetoArticulosFiltros {
  constructor(
    public TipoUsuario: string,
    public Usuario: number | string,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null,
    public Folio: string
  ) { }
}
