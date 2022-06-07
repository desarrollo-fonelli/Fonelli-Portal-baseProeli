export class FiltrosConsultaPedidos{
    constructor(
       public TipoUsuario: string = "C",
       public ClienteCodigo: number,
       public ClienteFilial: number,
       public Usuario: number,
       public Status: string
    ){}
}