export class FiltrosClientes {
  constructor(
    public Usuario: number | string,
    public ClienteCodigo: number,
    public ClienteFilial: number,
    public TipoUsuario: string,
    public Pagina: number 
    
  ){}
}

/*class FiltrosClientes {
  constructor(
    public Usuario: number,
    public ClienteCodigo: number,
    public ClienteFilial: number,
    public Pagina: number
  ) {}
}*/
