export class FiltrosConsultaPedidos{
    constructor(
       public TipoUsuario: string | null,
       public ClienteCodigo: number| null,
       public ClienteFilial: number| null,
       public Usuario: number,
       public Status: string
    ){}
}