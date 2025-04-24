export class FiltrosListaCFDIS {
    constructor(
        public TipoUsuario: string | null,
        public Usuario: number | string,
        public ClienteCodigo: number | null,
        public ClienteFilial: number | null,
        public FechaInicial: string,
        public Pedido: string,
        public Status: string
    ) { }
}