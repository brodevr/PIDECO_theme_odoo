# Historial de cambios — PIDECO Theme

## 19.0.1.2.0

Correcciones realizadas por Devoo sobre la versión 19.0.1.1.0.

### Instalación

- Cambiamos la categoría del módulo de "Theme" a "Website/eCommerce". Odoo trata cualquier módulo de categoría "Theme" como un tema de sitio web, y eso le exige un nombre y un circuito de instalación especiales. Por eso el módulo no se instalaba como uno normal. Ahora se instala y actualiza sin problemas.
- Regeneramos el archivo de traducciones base (.pot), que estaba desactualizado respecto de los textos reales del módulo, y agregamos las traducciones nuevas en español y chino.

### Cambio de idioma

- Corregimos un error que dejaba el sitio trabado en chino (o en cualquier idioma distinto del principal): al elegir Español en el pie de página, la tienda volvía a mostrarse en chino. Ahora se puede pasar de un idioma a otro y volver sin problemas, manteniéndose en la misma página.

### Precio sin impuestos nacionales

- La versión original ocultaba la leyenda "Precio s/Imp. Nac." solo en el listado de productos; en la página de cada producto se seguía viendo. Ahora queda oculta en todo el sitio: listado, página de producto y ventanas emergentes.
- Es un cambio solo visual: los precios, el carrito, las órdenes de venta y las facturas calculan los impuestos exactamente igual que antes.

### Página de producto

- El botón "Comprar ahora" se veía descentrado. Ahora ocupa toda la fila, con el ícono y el texto centrados y el mismo estilo que "Agregar al carrito", en escritorio y celular.
- Las ventanas emergentes de Odoo, como el configurador de producto al agregar al carrito, ahora usan los colores de la marca en sus botones.

### Encabezado y cuenta de usuario

- El ícono de cuenta ahora lleva a "Mi cuenta" si el usuario ya inició sesión. Antes siempre mandaba a la pantalla de login.
- Se agregó la opción "Cerrar sesión" en el menú, visible solo para usuarios logueados.
- El contador de favoritos (wishlist) ahora muestra la cantidad y se actualiza solo al agregar o quitar productos. El del carrito también se actualiza en el momento, y ambos se ocultan cuando están en cero.

### Carrito

- El carrito lateral funciona con cualquier idioma activo en el sitio. Antes solo reconocía inglés, español y chino.
- Las cantidades se muestran como "2" en lugar de "2.0".

### Menú de categorías

- Si no hay categorías con productos publicados, el menú de categorías (escritorio y celular) no se muestra vacío.
- La consulta de categorías se hace una sola vez en lugar de dos, así la página carga un poco más liviana.

### Buscador

- Los resultados de búsqueda en vivo ahora "escapan" el texto de nombres y descripciones. Esto evita que un contenido mal cargado rompa el diseño o inyecte código en la página.
