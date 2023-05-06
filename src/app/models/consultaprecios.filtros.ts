export class FiltrosConsultaPrecios {
  constructor(
    public TipoUsuario: string | null,
    public Usuario: number | string,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null,
    public Lista: number,
    public ParidadTipo: string,
    public ArticuloLinea: string,
    public ArticuloCodigo: string
  ) {}
}
