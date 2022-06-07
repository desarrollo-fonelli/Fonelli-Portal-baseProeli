export class FiltrosDetallePedidos{
    constructor(
        public PedidoLetra: string, 
        public PedidoFolio: number,
        public TipoUsuario: string | null,
        public ClienteCodigo: number,
        public ClienteFilial: number,
        public Usuario: number

    ){}
}