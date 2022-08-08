export class FiltrosFichaTecnica{
    constructor(
        public Usuario: number,
        public TipoUsuario: string,
        public Cliente: number,
        public FilialDesde: number,
        public FilialHasta:number,
        public FechaDesdeAnterior: string,
        public FechaHastaAnterior: string,
        public FechaDesdeActual: string,
        public FechaHastaActual: String

    ){}
}