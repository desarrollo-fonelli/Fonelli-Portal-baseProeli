export interface CalcPrecParam {
  TipoUsuario: string;    // Tipo de usuario que solicita el cálculo
  Usuario: number | string; // Identificador del usuario
  ClienteCodigo: number;  // Código del cliente
  ClienteFilial: number;  // Filial del cliente
  ItemLinea: string;      // Línea de producto
  ItemCode: string;       // Código del artículo
  ListaPrecCode: string;  // Código de la lista de precios
  ParidadTipo: string;    // Tipo de paridad: N-Normal|E-Especial|P-Premium
  PiezasCosto?: number; // Cantidad de piezas para Formulación 4
  GramosCosto?: number | null;  // Peso en gramos de las piezas para Formulación 4
}
