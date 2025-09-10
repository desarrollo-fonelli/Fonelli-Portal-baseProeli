#### MED_FONELLI_Portal
## Control de Cambios

----------
## v2.14.0 | 2025-09-12 | Presentación de imagenes en catálogo de artículos
1. 

----------
## v2.13.4 | 2025-09-09 | Componente para editar cotizaciones registradas
#### Nuevo:
1. Se crean componente y artefactos necesarios para obtener datos de documentos registrados y permitir su edición.
   a. Los precios del documento original deben ser actualizados con las paridades del día.
   b. Se debe llamar un servicio API REST para actualizar la información.,
      * El servicio debe actualizar la fecha del documento original, borrar las filas del documento original y crearlas nuevamente.
2. Se ajusta el componente que presenta el listado de cotizaciones y llama el componente para modificar el documento.
3. Se agrega la propiedad "DocId" a los modelos del documento de cotización.

----------
## v2.13.1 | 2025-08-29 | Ajustes a la creación del documento de Cotización
#### Nuevo:
1. Se agregan campos al formulario y se ajusta rutina que llama el servicio para crear registros en la base de datos: código de lista de precios, tipo de paridad y comentarios del documento.

----------
## v2.13.0 | 2025-08-27 | Extender módulo de Cotizaciones de Venta
#### Nuevo:
1. Se guardan en la base de datos los documentos creados.
2. Se modifica el menú principal para tener los ítems:
   a. Crear Cotización
   b. Consultar Cotización
3. Se crean componentes para presentar Lista de Cotizaciones:
   a. Lista de cotizaciones filtrando por agente, cliente y fecha.
   b. Las filas de la lista son colapsables, presentando en una tabla anidada los artículos que contiene.

----------
## v2.12.0 | 2025-08-12 | prepedidos-repo | Ajustes reporte de prepedidos
#### Cambios:
1. Se modifica el layout de la lista resumida, se agregan totales por oficina.

----------
## v2.11.1 | 2025-08-08 | indic-venta2025 | Indicadores de Venta 2025
#### Nuevo:
1. Se crean componentes, servicios y demás artefactos para mostrar indicadores de venta de acuerdo a los criterios establecidos por el Director General en 2025.
2. Organizo el menú lateral para agrupar los ítems para Indicadores de Venta
3. Se crea un nuevo componente basado en los indicadores de venta anteriores para mostrar solamente las ventas acumuladas en el periodo.

----------
## v2.10.0 | 2025-07-29 | prepedidos-repo > Reporte de Prepedidos
#### Nuevo:
1. Reporte de prepedidos. Se crean componente, servicios y demás artefactos para mostrar formulario de criteros de filtro, lista resumida y detalle del documento elegido.

----------
## v2.9.0 | 2025-07-19 | sidenav > reingeniería del menú de la app
#### Cambios:
1. Se cambia por completo el layout del menú lateral para agrupar los ítems, usando un "acordeón" en vez de una lista plana.
2. Ajustes menores al formulario articulos-consulta.
3. Se cambia la fuente de los títulos en los formularios.

----------
## v2.8.1 | 2025-07-17 | articulos-consulta > Ajustes Reporte Catálogo de Artículos
#### Cambios:
1. Se pide descartar todos los crterios de filtro actuales, solo dejar una casilla para buscar código semejante.
1.1 La búsqueda debe presentar artículos cuyo código coincida fonéticamente con el texto indicado por el usuario
2. El reporte no va a llevar precio ni gramos, solo debe presentar línea de PT, código de modelo y descripción.
3. NOTA: Se crea un nuevo componente en vez de cambiar "articulos-reporte" que fue desarrollado en versión anterior.

----------
## v2.8.0 | 2025-07-15 | articulos-reporte > Reporte Catálogo de Artículos 
#### Nuevo:
1. Este reporte presenta una lista de artículos de PT permitiendo filtrar por "códigos semejantes".
2. Para cada artículo devuelto se llama la rutina de cálculo de precio (en  la API REST), lo cual ocasiona que el reporte tarde, así que la presentación se limita a 500 registros máximo. 

----------
## v2.7.1 | 2025-07-11 | cotizacion > correcciones derivadas de la revisión 
#### Issues:
1. Al acceder a la app como agente, e indicar un código de cliente, el servicio CltesDocVenta devuelve un "Error de autenticación".
1.1 RESUELTO: se modificó el servicio API REST.
#### Cambios:
2. Las casillas "input" para mostrar los datos del cliente se reemplazan con una "textbox".
3. Ajustes al layout del formulario usando "cards".
4. Se mejora el formato para la salida impresa.
5. Se implementa el acceso con el tipo de usuario "C - Cliente" (distribuidor).
5.1 Se ajusta el comportamiento interactivo de los controles para indicar código de cliente.

----------
## v2.7.0 | 2025-07-10 | cotizacion > Formulario para Cotizaciones
#### Nuevo:
1. Se crean componentes y artefactos requeridos para presentar un formulario de cotización similar a un pedido de venta.
2. Se revisan y en su caso se crean los servicios para consultar la API REST para obtener los precios fijos o calculados.

----------
## v2.6.0 | 2025-06-19 | ordenretorno > Ordenes de Reparación | Consulta de Logística
#### Nuevo:
1. Se crea componente OrdenReparacion y artefactos requeridos: modelos, servicios, etc.
2. Se crea formulario para criterios de filtro.
3. Se crean tablas HTML y se aplican caracteristicas de datatables.net

#### Cambios
1. En Consulta de Logistica, se modifica formulario de criterios de filtro.
1.1 Ahora se permite indicar algún documento u otro criterio de búsqueda único sin tener que indicar el número de cliente.
1.2 Se agregan reglas de interacción entre controles relacionados, para asignar el valor correcto según el caso.

----------
## v2.5.0 | 2025-05-25 | guias2025 > Consulta de Logistica 
#### Nuevo:
1. Se crean componente guias2025 y artefactos para el módulo "Consulta de Logística".
2. Se crea formulario de criterios de filtro.
3. Se crea tabla para presentar lista de Paquetes (Guías) y documentos sin guía.
4. Se crea tabla para presentar documentos incluidos en el Paquete.
5. Se crea formulario modal para presentar modelos incluidos en el documento.
6. Se crean componentes para servicios y modelos requeridos.

## v2.4.2 | 2025-05-28 | Consulta de Pedidos DETALLE - Revisión | Relación de Pedidos
---------
#### Cambios:
1. Se agrega código para ver ubicación del pedido cuando se tiene Orden de Producción que no se ha ensobretado
2. Se corrigen criterios de filtro en relación de pedidos para que el "cliente inicial" y "final" sean iguales y no se puedan modificar.

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
