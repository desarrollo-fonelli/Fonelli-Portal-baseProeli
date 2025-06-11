export class DocumArticFiltros {
  constructor(
    public Usuario: number | string,
    public TipoUsuario: string | null,
    public ClienteCodigo: number | null,
    public ClienteFilial: number | null,
    public DocTipo: string,
    public DocSerie: string | null,
    public DocFolio: number | string | null,
    public DocFecha: string | null
  ) { }
}

