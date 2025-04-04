export class FiltrosOrdnretorno {
  constructor(
    public TipoUsuario: string,
    public Usuario: number | string,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null,
    public AgenteCodigo: number | null,
    public Folio: number | null,
    public Referencia: number | null,
    public Status: string,
    public Pagina: number,
  ) { }
}
