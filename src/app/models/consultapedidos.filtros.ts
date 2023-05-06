export class FiltrosConsultaPedidos{
    constructor(
       public TipoUsuario: string | null,
       public ClienteCodigo: number| null,
       public ClienteFilial: number| null,
       public Usuario: number | string,
       public Status: string
    ){}
}