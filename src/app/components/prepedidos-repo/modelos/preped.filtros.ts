export interface PrePedFiltros {
  TipoUsuario: string,
  Usuario: number | string,
  OficinaDesde: string,
  OficinaHasta: string,
  AgenteDesde: number,
  AgenteHasta: number,
  ClienteDesde: number | null,
  FilialDesde: number,
  ClienteHasta: number | null,
  FilialHasta: number,
  FechaPrepDesde: string,
  FechaPrepHasta: string,
  FolioDesde: number,
  FolioHasta: number,
  OrdenCompra: string,
  Status: string,
  Documentados: string,
  Autorizados: string
}

export interface PrepedDetalleFiltros {
  TipoUsuario: string | null,
  Usuario: number | string,
  ClienteCodigo: number | null,
  ClienteFilial: number | null,
  PedidoLetra: string,
  PedidoFolio: number
}
