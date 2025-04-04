export class FiltrosDetalleordnretorno {
  constructor(
    public TipoUsuario: string,
    public Usuario: number | string,
    public Folio: string,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null
  ) { }
}
