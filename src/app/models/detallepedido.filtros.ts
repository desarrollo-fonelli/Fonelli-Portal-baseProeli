export class FiltrosDetallePedidos{
    constructor(
        public PedidoLetra: string, 
        public PedidoFolio: number,
        public TipoUsuario: string | null,
        public ClienteCodigo: number | null,
        public ClienteFilial: number | null,
        public Usuario: number

    ){}
}