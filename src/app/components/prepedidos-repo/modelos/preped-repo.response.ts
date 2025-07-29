export interface PrePedRepoResponse {
  Codigo: number;
  Mensaje: string;
  Paginacion: Paginacion;
  Contenido: PrepedRepoContenido;
}

export interface PrepedRepoContenido {
  PrepedOficinas: PrepedOficina[];
}

export interface PrepedOficina {
  OficinaCode: string;
  OficinaNom: string;
  Pedidos: Pedido[];
}

export interface Pedido {
  PedLetra: string;
  PedFolio: string;
  Status: string;
  PedFecha: Date;
  FechaCanc: Date;
  AgenteCode: string;
  AgenteNom: string;
  PedClteCode: string;
  PedClteFil: string;
  PedClteNom: string;
  PedClteSuc: string;
  PedPiezas: number;
  PedGramos: number;
  PedImporte: number;
  Observac: string;
  OrdenCompra: string;
  TiendaDest: string;
  Documentado: string;
  DocAutoriz: string;

  cp3: number;
  cp35: number;
  cp4: number;
  cp45: number;
  cp5: number;
  cp55: number;
  cp6: number;
  cp65: number;
  cp7: number;
  cp75: number;
  cp8: number;
  cp85: number;
  cp9: number;
  cp95: number;
  cp10: number;
  cp105: number;
  cp11: number;
  cp115: number;
  cp12: number;
  cp125: number;
  cp13: number;
  cp135: number;
  cp14: number;
  cp145: number;
  cp15: number;
  cp155: number;
  mpx: number;
  cpx: number;

}


export interface Paginacion {
  NumFilas?: number;
  TotalPaginas?: number;
  Pagina?: number;
}