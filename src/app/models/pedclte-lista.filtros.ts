export class PedclteListaFiltros {
  constructor(
    public TipoUsuario: string | null,
    public Usuario: number | string,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null,
    public PedidoBuscar: number | null,
    public OrdCompBuscar: string | null,
    public Status: string,
    public MostrarUbicacion: boolean
  ) { }
}
