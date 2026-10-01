# Historial de cambios — PIDECO Theme

## Sin publicar

### Home

- El banner principal pasa a ser un carrusel de 3 diapositivas que cambia cada 4 segundos, con flechas a los lados e indicadores. Ocupa todo el ancho y el alto de la pantalla debajo del encabezado.
- Usa el carrusel nativo de Odoo, así que desde el editor se pueden agregar o quitar diapositivas y cambiar la imagen de fondo, los textos, el botón y la velocidad.
- Toda la diapositiva es clickeable y lleva al link de su botón.
- En celular el texto se ubica abajo y cada diapositiva muestra la parte de la imagen elegida como punto de foco en el editor.
- Textos del banner más chicos, con tamaños escalonados para escritorio, tablet y celular. El alto tiene un máximo para que no quede desproporcionado en pantallas altas.
- Flechas de navegación centradas y con márgenes laterales para que no se superpongan con el texto. En celular bajan a las esquinas inferiores, a la altura de los indicadores.
- Nueva sección "Nuestra esencia" con los cuatro valores del manual de marca (Sencillez práctica, Esencia orgánica, Cercanía en el diseño y Encuentro en el hogar) y una imagen con forma de arco.
- Textos del home reescritos con el tono del manual de marca: carrusel, categorías, banners editoriales y "Transformá tus espacios".

### Página de producto

- La ficha ocupa todo el ancho de la pantalla.
- En escritorio, la galería se muestra como mosaico: la primera imagen grande a lo ancho y el resto en dos columnas. Los detalles del producto quedan fijos a la derecha mientras se recorren las imágenes.
- En celular, la imagen va de borde a borde, con las miniaturas debajo.
- Es un cambio solo visual (CSS): no modifica las plantillas ni las opciones de Odoo.

### Encabezado

- El header muestra solo íconos: búsqueda, cuenta y carrito en escritorio; menú, búsqueda y carrito en celular. Cada ícono tiene un área de toque de 44 px y el contador del carrito queda en su esquina. Los nombres siguen disponibles para lectores de pantalla y al pasar el mouse.
- Favoritos sale del header: sigue accesible desde el menú y desde cada producto.

### Buscador

- El panel de búsqueda se abre pegado al borde superior de la pantalla, deslizándose desde arriba, en lugar de aparecer a mitad de pantalla cuando la página está scrolleada.

### Carrito

- Al agregar un producto ya no aparece el aviso flotante de Odoo encima del carrito lateral: se abre solo el carrito lateral. Los avisos de advertencia (por ejemplo, falta de stock) se siguen mostrando.

### Traducciones

- Traducciones al español y al chino de todos los textos nuevos del home: carrusel, "Nuestra esencia", banners editoriales y secciones reescritas.
- Se quitaron del archivo base (.pot) y de las traducciones los textos que ya no se usan.
- El selector de idioma del footer suma inglés y muestra los tres idiomas como códigos: ES · EN · ZH. Antes el chino se mostraba como "中文", que se veía con caracteres extraños en equipos sin fuentes chinas. El inglés aparece si el website tiene activa alguna variante de inglés.

### Documentación

- La guía de instalación ya no pide seleccionar el módulo como tema activo, suma el inglés a los idiomas del sitio y documenta el carrusel, las imágenes del home, la página de producto, el carrito lateral, el buscador y los montos escritos en el sitio.
- Nuevas validaciones de UAT para el carrusel, la galería, el carrito y el buscador.
- El README del repositorio explica la documentación, las ramas y cómo publicar una versión.

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
