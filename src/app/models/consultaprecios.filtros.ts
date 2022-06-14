export class FiltrosConsultaPrecios {
  constructor(
    public Usuario: number,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null,
    public Lista: number,
    public Paridad: string,
    public ArticuloLinea: string,
    public ArticuloCodigo: string
  ) {}
}
