export class FiltrosExistencias {
  constructor(
    public TipoUsuario: string,
    public Usuario: string,
    public OficinaDesde: string,
    public OficinaHasta: string,
    public LineaPTDesde: string,
    public LineaPTHasta: string,
    public AlmacDesde: string,
    public AlmacHasta: string,
    public SoloExist: string,
    public Pagina: number
  ) { }
}
