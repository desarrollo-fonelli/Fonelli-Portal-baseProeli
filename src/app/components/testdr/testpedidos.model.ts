export interface Testpedido {
  id: number;
  fecha: string;  // o date si se convierte desde string
  total: number;
  clienteId: number;
}

export interface Testarticulo {
  id: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  pedidoId: number;
}

export interface ApiResponsePedidos {
  success: boolean;
  data: Testpedido[];
}

export interface ApiResponseArticulos {
  success: boolean;
  data: Testarticulo[];
}