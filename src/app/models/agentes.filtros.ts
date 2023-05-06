export class FiltrosAgente {
  constructor(
    public AgenteCodigo: number,
    public Password: string,
    public Status: string,
    public Pagina: number,
    public TipoUsuario: string,
    public Usuario: number|string
  ) {}
}
