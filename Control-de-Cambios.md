#### MED_FONELLI_Portal
## Control de Cambios

## v2.4.1 | 2025-05-26 | Relacion de Pedidos - Orden de Compra
### Cambios:
1. En la tabla de pedidos, se agrega una columna para mostrar la Orden de Compra.

----------
## v2.4.0 | 2025-05-25 | Consulta de Logistica | Consulta de Pedidos DETALLE
#### Cambios:
1. Se corrigen detalles en Consulta de Pedidos (criterios, lista de pedidos, detalle de pedidos y consulta de guias)

----------
## v2.3.4 | 2025-05-22 | Consulta de Pedidos DETALLE - Cuarta iteración
### Cambios:
1. Se aplica restricción para que distribuidores no vean la "ubicación" del artículo en las áreas de producción.
2. La columna "Ubicación" no se incluye en el excel exportado
2. Se incluye ítem para consulta de pedidos en menú de distribuidores.

----------
## v2.3.3 | 2025-05-21 | Consulta de Pedidos DETALLE - Tercera iteración
### Cambios:
1. Se revisa la obtención de las piezas producidas.
   (si no hay piezas producidas debe aparecer la ubicación).
2. La tabla de guías debe permitir consultar los artículos que contiene el documento de venta.
3. Se aplican caracteristicas de datatables a todas las tablas del formulario
4. Se debe generar una hoja de Excel con los artículos del pedido, mostrando las piezas por cada medida.

----------
## v2.3.2 | 2025-05-14 | Consulta de Pedidos DETALLE - Segunda iteración
#### Cambios:
1. Se agrega TAB para mostrar guias de paquetes enviados por pedido. Se crean modelo y se modifica plantilla HTML.
2. Se agrega columna para mostrar ubicación del artículo en producción. Se modifican modelo y plantilla HTML.

----------
## v2.3.1 | 2025-05-13 | Consulta de Pedidos DETALLE - Primera iteración
#### Cambios:
1. Se modifica la presentación de los artículos incluidos en el pedido seleccionado por el usuario. En vez de una ventana modal, se presentan en un container en la pagina principal.
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
