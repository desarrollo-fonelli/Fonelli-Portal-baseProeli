export class FiltrosDetalleGuia {
    constructor(
        public TipoUsuario: string | null,
        public Usuario: number | string,
        public PedidoFolio: number,
        public PedidoLetra: string
    ) { }
}