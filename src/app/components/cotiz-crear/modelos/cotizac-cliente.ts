/**
 * cotizac-cliente.ts
 * Interfaces utilizadas para filtros y response en los
 * servicios que se refieren al catálog de clientes
 */

export interface CotzClteFiltros {
  TipoUsuario: string;
  Usuario: number | string;
  ClienteCodigo: number;
  ClienteFilial: number;
  AgenteCodigo: string;
}

export interface CotzClteResponse {
  Codigo?: number;
  Mensaje?: string;
  Paginacion?: Paginacion;
  Contenido: CotzClteDatos;
}

export interface CotzClteDatos {
  ClienteCodigo: number;
  ClienteFilial: number;
  ClteRazonSocial: string;
  ClteSucursal: string;
  ClteStatus: string;
  ClteRfc: string;
  AgenteCodigo: string;
  AgenteNombre: string;
  ListaPreciosCodigo: string;
  ListaPreciosDescripc: string;
  ListaPrecios2Codigo: string;
  ListaPrecios2Descripc: string;
  ParidadCodigo: string;
  ParidadDescripc: string;
  ClteLimiteCredito: number;
  CltePlazo: number
}

export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}