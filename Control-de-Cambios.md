#### MED_FONELLI_Portal
## Control de Cambios

----------
## v2.3.1 | 2025-05-13 | Consulta de Pedidos DETALLE - Primera iteración
#### Cambios
1. Se modifica la presentación de los artículos incluidos en el pedido seleccionado por el usuario. En vez de una ventana modal, se presentan en un container de la pagina principal.
2. Se depuran columnas y se descarta tabla de pedidos a producción.
3. Se agrega formulario modal para presentar medidas con piezas solicitadas.

----------
## v2.3.0 | 2025-05-06 | Consulta de Pedidos
#### Nuevo:
1. Se agregan criterios de filtro para Folio de Pedido y Orden de Compra.

#### Cambios:
1. Se modifican modelos y servicios para aplicar nuevos filtros y recuperar Orden de Compra y Tienda destino

----------
## v2.2.1 | 20025-04-29 | Existencias por Almacén

#### Nuevo:
1. Se agrega consulta de "Existencias por Almacén". Solo para asesores
2. Se crean modelos y servicios para cargar Almacenes.
   - almacenes | almacenes.filtros | almacenes.service

#### Cambios:
1. Se oculta botón 'Imprimir PDF' en varias templates de reportes.
2. Relación de Pedidos: Se controla mensaje 'No se encontraron registros'.
3. Ajustes menores a "Descarga de CFDIS".
