# Historial de cambios — PIDECO Theme

## Sin publicar

### Home

- El banner principal pasa a ser un carrusel de 3 diapositivas que cambia cada 4 segundos, con flechas a los lados e indicadores. Ocupa todo el ancho y el alto de la pantalla debajo del encabezado, con un alto máximo para que no quede desproporcionado en pantallas altas.
- Usa el carrusel nativo de Odoo, así que desde el editor se pueden agregar o quitar diapositivas y cambiar la imagen de fondo, los textos, el botón y la velocidad. También se respetan sus opciones de ocultar flechas y de cambiar el estilo de los indicadores.
- Toda la diapositiva es clickeable y lleva al link de su botón.
- Textos del banner con tamaños escalonados para escritorio, tablet y celular.
- En celular el texto se ubica abajo, las flechas van en las esquinas inferiores a la altura de los indicadores, y cada diapositiva muestra la parte de la imagen elegida como punto de foco en el editor.
- Corrección: los estilos propios del carrusel de Odoo pisaban el relleno de las diapositivas y la posición y el tamaño de las flechas, sobre todo por debajo de 768 px, y el banner se veía roto en celular. Las reglas del banner ahora tienen prioridad sobre esas.
- Corrección: por debajo de 768 px Odoo anula el alto de todas las secciones, así que el banner quedaba más bajo de lo previsto y con una franja vacía debajo. El alto ahora se aplica al carrusel, y en celular el banner ocupa la pantalla debajo del encabezado.
- El home se divide en cuatro zonas editables, intercaladas con las secciones automáticas de categorías y productos. En cada zona el editor de Odoo permite agregar, quitar, reordenar y editar bloques, y cada zona se guarda por separado. Antes el editor solo dejaba cambiar textos e imágenes dentro de cada bloque.
- Nueva sección "Nuestra esencia" con los cuatro valores del manual de marca (Sencillez práctica, Esencia orgánica, Cercanía en el diseño y Encuentro en el hogar). El texto va en una tarjeta que se superpone a una imagen grande, y los valores quedan en una fila propia debajo, con números grandes. En celular la tarjeta se apoya sobre la parte inferior de la imagen y los valores pasan a una lista compacta.
- Textos del home reescritos con el tono del manual de marca: carrusel, categorías, banners editoriales y "Transformá tus espacios".
- Corrección: los links "Nosotros" del menú y "Nuestra historia" y "Materiales" del footer apuntaban a un ancla que no existía en el home. Ahora llevan a la sección "Nuestra esencia".

### Página de producto

- La ficha ocupa todo el ancho de la pantalla.
- En escritorio, la galería se muestra como mosaico: la primera imagen grande a lo ancho y el resto en dos columnas. Los detalles del producto quedan fijos a la derecha mientras se recorren las imágenes.
- En celular, la imagen va de borde a borde, con las miniaturas debajo.
- Vuelve a mostrarse la leyenda "Precio s/Imp. Nac." de la localización argentina, solo en la página de producto y debajo del precio. Sigue oculta en el listado y en las ventanas emergentes.
- Correcciones de la galería frente a los estilos y el script propios de Odoo: el mosaico ya no puede desbordar sobre la sección siguiente, las imágenes cuadradas ya no se estiran, y en celular las miniaturas muestran su imagen (Odoo las convierte en puntos por debajo de 992 px).
- Es un cambio solo visual (CSS): no modifica las plantillas ni las opciones de Odoo.

### Encabezado y menú

- El header muestra solo íconos: búsqueda, cuenta, favoritos y carrito en escritorio; menú, búsqueda y carrito en celular. Los íconos están agrupados, cada uno con un área de toque de 44 px, y los contadores de favoritos y carrito quedan en la esquina del ícono. Los nombres siguen disponibles para lectores de pantalla y al pasar el mouse.
- En celular, cuenta y favoritos están dentro del menú.
- El menú de celular muestra el logo en lugar del texto "PIDECO".
- El menú de celular usa una sola tipografía: el título "Categorías" ya no va en una fuente con serifa.
- La vista de categorías del menú de celular pasa a ser un acordeón: una fila por categoría, y las subcategorías se despliegan al tocar. Antes se listaban todas juntas.
- Corrección: el logo del header no quedaba centrado en celular.

### Footer

- El selector de idioma es más visible: un grupo con ícono, etiqueta y botones más grandes.
- En celular el footer se muestra en una sola columna centrada, con el selector de idioma primero en la franja inferior.

### Buscador

- El panel de búsqueda se abre pegado al borde superior de la pantalla, deslizándose desde arriba, en lugar de aparecer a mitad de pantalla cuando la página está scrolleada.
- Corrección: los resultados de la búsqueda en vivo mostraban etiquetas HTML (`<span class=…>`) en lugar del nombre, la descripción y el precio. Odoo ya entrega esos textos como HTML y el theme los volvía a escapar. Ahora se muestran limpios, con el término buscado en negrita.
- En celular, los nombres largos de los resultados ya no se superponen con el precio: el nombre ocupa todo el ancho y el precio va debajo. Si la lista no entra en la pantalla, se puede scrollear.

### Carrito

- Se quitó el carrito lateral propio del theme. Al agregar un producto se muestra el aviso nativo de Odoo, y el ícono del carrito del header lleva a la página de carrito de Odoo (`/shop/cart`), con el contador de productos.
- Corrección: el aviso nativo quedaba en parte detrás del header y se veía cortado. Ahora aparece por encima y justo debajo de la parte visible del header.
- Corrección: los botones de cantidad (+/−) y los botones tipo link de Odoo heredaban el estilo de los botones de marca (píldora ancha en mayúsculas) y se veían deformados, por ejemplo en la página del carrito. Vuelven a su tamaño nativo.

### Traducciones

- Traducciones al español y al chino de todos los textos nuevos: carrusel, "Nuestra esencia", banners editoriales, menú de celular y secciones reescritas.
- Los archivos de traducción se verificaron contra el mismo algoritmo con el que Odoo extrae los textos de las plantillas: coinciden exactamente, sin entradas faltantes ni sobrantes.
- Las flechas del banner ya no llevan un texto oculto duplicado: su nombre para lectores de pantalla es la etiqueta del botón, que sí se traduce.
- Texto en inglés corregido: "The more you buy, the more you save".
- Corrección: los mensajes de la barra de anuncios aparecían en inglés en español y en chino mientras no se editaran a mano. Ahora, mientras conservan su texto original, se muestran traducidos; al editarlos en Ajustes se usa el texto cargado.
- El selector de idioma del footer suma inglés y muestra los tres idiomas como códigos: ES · EN · ZH. Antes el chino se mostraba como "中文", que se veía con caracteres extraños en equipos sin fuentes chinas. El inglés aparece si el website tiene activa alguna variante de inglés.

### Documentación

- La guía de instalación ya no pide seleccionar el módulo como tema activo, suma el inglés a los idiomas del sitio y documenta el carrusel, las zonas editables y las imágenes del home, la página de producto, el carrito, el buscador y los montos escritos en el sitio.
- Nuevas validaciones de UAT para el carrusel, la edición del home, la galería, el carrito, el buscador y el menú de celular.
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
