# Historial de cambios — PIDECO Theme

## 19.0.1.5.0

### Home (rediseño según el PDF "PÁGINA WEB")

- Orden nuevo: carrusel, "Conocé nuestros productos", "Recién llegados", "La marca, paso a paso", "Estamos por abrir nuestras puertas", beneficios mayoristas, descuentos por monto, "Enterate primero de todo" y footer.
- "Conocé nuestros productos": grilla de 6 cuadros de categorías (3 por fila, 2 en celular) con foto, nombre y flecha. Son bloques editables: foto, nombre y link se cambian en el editor. Reemplaza el slider automático de categorías.
- "Recién llegados": 4 productos, sin carrusel, con la etiqueta "Nuevo" y el botón "Agregar al carrito" con borde. Muestra los productos marcados como "Destacado en el home"; si no hay ninguno marcado, los últimos 4 publicados. Reemplaza "Productos destacados".
- Nuevo campo **"Destacado en el home"** en la ficha del producto (pestaña Ventas, sección de la tienda) y filtro con el mismo nombre en la lista de productos.
- Nueva sección "La marca, paso a paso" con los cuadros de color Bordó, Crema y Tipografía, y nueva sección "Estamos por abrir nuestras puertas" con la foto del local.
- "Beneficios mayoristas" va pegado a "Estamos por abrir", con el mismo bordó y una línea fina entre los dos. Los descuentos por monto siguen igual.
- Nuevo formulario "Enterate primero de todo": suscripción por mail con Marketing por correo, a la lista "PIDECO news" que crea el módulo.
- Se quitan la franja de beneficios de compra debajo del carrusel, "Nuestra esencia", los banners editoriales y "Transformá tus espacios".
- Los botones nuevos y los links del footer quedan sin destino (`#`) y los textos entre corchetes quedan para completar desde el editor.

- Nuevas fotos del carrusel (los textos no cambian): diapositiva 1 la mesa con la tetera, 2 la consola de madera, 3 el depósito con cajas Pídeco.
- Nuevo popup "Sumate a la casa Pídeco", solo en el home, a los 3 segundos: foto, nombre y email. Cada suscripción crea un contacto en la lista "PIDECO news" de Marketing por correo. Es el popup y el formulario nativos de Odoo, así que se edita desde el editor; una vez cerrado no vuelve a aparecer por 7 días.

- Corrección: las zonas de categorías, "La marca", el formulario de mail y el popup no se podían editar en el editor, porque tenían atributos de plantilla (`t-…`) adentro y Odoo las trataba como contenido dinámico. Ahora no tienen ninguno: el id de la lista de correo se pasa a los formularios desde `pideco_ui.js`.

### Barra de anuncios

- Pasa a ser una cinta que se desliza de forma continua (en lugar de cambiar de mensaje cada 4 segundos) y se detiene al pasar el mouse. Queda quieta en el editor y con movimiento reducido.

### Tienda y ficha de producto (documento "Ficha y Grilla")

- Corrección: en celular el bloque de compra era una grilla con una segunda columna de 54 px pensada solo para favoritos; cualquier otro elemento que Odoo agregara ahí (el precio, el botón Comparar) caía en esa columna y se salía de la tarjeta, y la página se podía deslizar de costado. Ahora cantidad y botones van en la primera fila, "Agregar al carrito" debajo, y todo lo demás ocupa una fila completa.
- Galería de la ficha como en Atelier Isadora: en escritorio, miniaturas en columna a la izquierda y la foto grande a la derecha (reemplaza al mosaico). Con una sola foto, la foto ocupa todo el ancho. En celular sigue el carrusel con miniaturas debajo.
- Frase de bienvenida en cada categoría: se usa la descripción de la categoría de Odoo, centrada debajo del título.
- Stock bajo ("2 unidades en stock", módulo Inventario de la tienda): texto bordó en lugar del recuadro amarillo.
- La descripción corta del producto (eCommerce) se muestra completa debajo del título, sin recorte ni botón "Ver más".
- La descripción completa del producto (la que Odoo muestra al final de la ficha) pasa a la tarjeta, debajo del título y de la descripción corta. Es el mismo campo y se edita ahí desde el editor; su lugar original al final de la página queda oculto.
- Galería de la ficha: fundido suave entre fotos en lugar del deslizamiento lateral de Odoo (miniaturas, flechas y deslizar en celular).
- "Cambios y devoluciones" se suma a la lista de garantías de compra de la ficha (mismo formato de ícono), y debajo va el nuevo bloque "Medios de pago": efectivo, transferencia bancaria, débito y QR de Nave (sin cuotas).
- "Compra segura · Tus datos están protegidos" pasa al footer, junto al copyright. Los links a Botón de arrepentimiento y Defensa del consumidor quedan solo en la columna "Legales" del footer.

### Tipografía

- Los títulos principales (h1 y h2) usan Coolvetica y el resto del sitio Barlow, como en el PDF. Las dos fuentes viajan con el módulo (`static/src/assets/fonts/`); Coolvetica tiene un solo peso y nunca se engrosa artificialmente. Reemplazan a Hanken Grotesk.

### Footer

- Fondo claro con el logo, "Calidez en cada rincón", la dirección y las columnas Ayuda, Legales y Seguinos. Se conserva el selector de idioma.

### Requisitos

- Nueva dependencia: `website_mass_mailing` (Marketing por correo). Odoo la instala al actualizar el módulo.
- Si una base ya tenía guardada la zona del carrusel con el editor, la franja de beneficios de compra puede seguir apareciendo debajo del carrusel: se borra desde el editor.

## 19.0.1.4.2

### Página de producto

- Corrección: en la 19.0.1.4.1 la descripción se veía completa y el botón "Ver más" no hacía nada. Odoo arma la clase de esa caja con `t-attf-class`, que pisaba la clase que agregaba el módulo; ahora se agrega en ese mismo atributo.

## 19.0.1.4.1

### Página de producto

- La descripción para el sitio web vuelve a su lugar de Odoo, debajo del título. Se ven sus primeras líneas, que se desvanecen, y el botón "Ver más" la despliega ahí mismo ("Ver menos" la cierra). Si el texto es corto se muestra entero y sin botón. En el editor de Odoo se ve siempre completa, para poder editarla. Reemplaza la tarjeta de descripción separada de la 19.0.1.4.0.

## 19.0.1.4.0

### Tienda

- Las tarjetas de producto muestran la referencia interna del producto, en pequeño y gris, arriba del nombre. Aplica a la tienda, a la lista de deseos y a los bloques de productos de Odoo. Los productos con varias variantes no tienen una referencia única y no la muestran.

### Página de producto

- La "Descripción para el sitio web" del producto deja el área del título. Al final de la tarjeta de detalles, debajo de los avisos de compra, se ven sus primeras líneas con el link "Ver descripción completa" (solo si el texto no entra). El texto completo va en una tarjeta propia justo debajo del producto, con un ancho de lectura cómodo. Si el producto no tiene descripción no se muestra nada, salvo en el editor, donde la tarjeta completa queda disponible para escribirla.

### Edición desde Odoo

- Corrección: en el editor, las imágenes de los dos banners editoriales no se podían seleccionar ni reemplazar, porque la capa de degradado las tapaba. Ahora se reemplazan haciendo clic sobre la imagen.
- Corrección: en el editor, la barra de anuncios seguía rotando y Odoo registraba cada cambio como una edición del header. Al guardar cualquier otra cosa se habría guardado también una copia del header con la barra a mitad de rotación. Ahora la barra se detiene al entrar en modo edición.
- El bloque de descuentos se llama "Descuentos por monto" en el editor (antes "Discounts").

## 19.0.1.3.0

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
