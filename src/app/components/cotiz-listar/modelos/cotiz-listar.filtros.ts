export interface CotizListarFiltros {
  TipoUsuario: string;
  Usuario: number | string;
  ClienteCodigo: number | null;
  ClienteFilial: number | null;
  AgenteCodigo: number | null;
  FechaDesde: string;
  FechaHasta: string;
  FolioDesde: number;
  FolioHasta: number;
  Status: string;
  Pagina: number;
}