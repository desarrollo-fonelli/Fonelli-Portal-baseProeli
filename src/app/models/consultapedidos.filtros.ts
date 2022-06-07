export class FiltrosConsultaPedidos{
    constructor(
       public TipoUsuario: string | null,
       public ClienteCodigo: number,
       public ClienteFilial: number,
       public Usuario: number,
       public Status: string
    ){}
}