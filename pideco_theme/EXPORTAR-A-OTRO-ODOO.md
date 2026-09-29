# PIDECO Theme — instalación en Odoo 19

Módulo visual para Website y eCommerce en Odoo 19 Community o Enterprise. Incluye el home (carrusel principal, secciones e imágenes), header, footer, buscador, carrito lateral, tienda, ficha de producto, estilos responsive, interacciones, fuentes y traducciones (español y chino; los textos base están en inglés).

El historial de cambios por versión está en `CHANGELOG.md`.

## Requisitos

- Odoo 19 con `website_sale` y `website_sale_wishlist` instalados.
- Los idiomas públicos del sitio son `es_AR`, inglés y `zh_CN`. `es_AR` debe quedar como idioma principal y predeterminado. Los tres deben estar activos en *Website → Configuración → Ajustes → Idiomas* para aparecer en el selector del footer (ES · EN · 中文). Sirve cualquier variante de inglés (`en_US`, `en_GB`, etc.). Los textos del theme están escritos en inglés, así que ese idioma no necesita archivo de traducción.
- Configurar `auto_redirect_lang=False`. En esta versión de Odoo 19, el enrutador todavía puede priorizar el idioma del navegador o una selección recordada; comprobar ese comportamiento en UAT. El enlace `/website/lang/es?r=/` selecciona español explícitamente.
- La localización argentina, impuestos, moneda, medios de pago, envíos y compra mínima se configuran en el entorno. No son dependencias del theme.

Odoo Online estándar no permite instalar módulos personalizados. Para este módulo se necesita Odoo.sh o un servidor administrado por el implementador.

## Instalación

1. Copiar la carpeta `pideco_theme` completa dentro de un directorio incluido en `addons_path`.
2. Reiniciar Odoo y actualizar la lista de aplicaciones.
3. Instalar **PIDECO Theme** o ejecutar:

```bash
odoo -d NOMBRE_BASE -i pideco_theme --stop-after-init
```

Desde la versión 19.0.1.2.0 el módulo es de categoría **Website/eCommerce**, no un tema de Odoo. No hay que seleccionarlo como tema activo: al instalarlo, sus estilos, interacciones y plantillas se aplican directamente. Si la base tiene más de un website, el diseño PIDECO se aplica a todos.

Para actualizar una instalación existente:

```bash
odoo -d NOMBRE_BASE -u pideco_theme --stop-after-init
```

## Carrusel del banner principal

El banner del home es un carrusel nativo de Odoo y se edita desde el editor del website:

- **Imagen de fondo:** seleccionar la diapositiva y cambiar su fondo. Tamaño recomendado: 2400 × 1350 px, con el motivo principal centrado.
- **Punto de foco para celular:** en celular la imagen se recorta a lo alto. Ajustar la posición del fondo de cada diapositiva para elegir qué parte queda visible.
- **Link:** toda la diapositiva lleva al link de su botón. Para cambiarlo, editar el link del botón. Si una diapositiva no debe tener link, borrar el botón.
- **Diapositivas y velocidad:** agregar, quitar o reordenar diapositivas y cambiar el intervalo (4 segundos por defecto) desde las opciones del carrusel.

Si el home ya había sido editado con el editor antes de actualizar el módulo, esa versión personalizada tiene prioridad y el carrusel no aparece. Hay que restablecer la vista del home o insertar el bloque desde el editor.

## Imágenes del home

El home usa 6 imágenes que viajan con el módulo, en `static/src/img/home/`. Así aparecen al instalar en cualquier base y se pueden reemplazar desde el editor.

| Espacio | Archivo | Tamaño actual | Encuadre |
|---|---|---|---|
| Carrusel, diapositiva 1 | `hero-1.jpg` (mesa de comedor) | 1672 × 941 px | Motivo centrado; en celular se recorta a lo alto |
| Carrusel, diapositiva 2 | `hero-2.jpg` (consola de madera) | 1672 × 941 px | Igual que la 1 |
| Carrusel, diapositiva 3 | `hero-3.jpg` (showroom mayorista) | 1672 × 941 px | Igual que la 1 |
| Nuestra esencia | `esencia.jpg` (sillón borgoña) | 1122 × 1402 px | Se muestra con la parte superior en arco |
| Banner editorial "cocina" | `editorial-cocina.jpg` (utensilios) | 1400 × 788 px | El texto va abajo a la izquierda |
| Banner editorial "orden" | `editorial-orden.jpg` (tarros de vidrio) | 1355 × 1161 px | El texto va abajo a la izquierda |

Para reemplazarlas en el módulo, conviene respetar la orientación y usar JPG o WebP de menos de 400 KB. Para el carrusel se recomienda 2400 × 1350 px, así se ve nítido en pantallas grandes. Si el home ya fue editado con el editor en una base, las imágenes nuevas del módulo no reemplazan las que ya se cargaron ahí.

`static/src/assets/pideco-editorial.png` ya no se usa en las plantillas, pero se conserva porque un home editado en alguna base puede seguir referenciándola.

## Página de producto

- **Escritorio (desde 992 px):** la ficha ocupa todo el ancho. Las imágenes del producto se muestran en mosaico: la primera grande a lo ancho y el resto en dos columnas. Los detalles quedan fijos a la derecha mientras se recorren las imágenes.
- **Celular y tablet:** carrusel con la imagen de borde a borde y las miniaturas debajo.
- **Imágenes:** llenan su cuadro y se recorta lo que sobra (el mosaico usa cuadros 3:2 y 1:1). Conviene cargar fotos con el producto centrado y algo de aire alrededor.
- **Opción de Odoo:** el diseño funciona con la galería en modo **Carrusel**, que es el valor por defecto de Odoo (editor del website → página de producto → imágenes). Si se cambia a **Grilla**, se usa la grilla nativa de Odoo y el mosaico PIDECO no se aplica.
- Es un ajuste solo de estilos: no reemplaza plantillas de `website_sale`, así que las opciones y funciones nativas de la ficha siguen disponibles.

## Carrito lateral y buscador

- Al agregar un producto se abre el carrito lateral PIDECO. El aviso flotante de Odoo ("agregado al carrito") se oculta para que no quede encima; los avisos de advertencia, como falta de stock, se siguen mostrando.
- El buscador se abre como un panel pegado al borde superior de la pantalla, con resultados en vivo a partir de 2 caracteres y sugerencias fijas (Baskets, Jars, Cutlery, Rugs), que se editan en `views/pideco_theme_19.xml`.

## Montos escritos en el sitio

La compra mínima y los descuentos por monto se muestran como texto fijo en el frontend. Son informativos: el theme no aplica ninguna regla de compra mínima ni descuento. Las reglas reales se configuran en el backend de Odoo.

Compra mínima ($200,000):

- **Barra de anuncios:** mensaje 2. Se edita en *Website → Configuración → Ajustes → PIDECO promotional bar*, en cada idioma. El monto del código es solo el valor inicial.
- **Home, bloque de beneficios:** "Minimum order $200,000", en la plantilla `pideco_homepage_19`.
- **Página de producto, garantías:** "Minimum order $200,000", en la plantilla `pideco_product_terms_19`.

Descuentos por monto (efectivo y transferencia):

- **Home:** bloque "Discounts by order amount", en `pideco_homepage_19`.
- **Página de producto:** bloque "Discounts", en `pideco_product_page_19`.

Para cambiar un monto fuera de la barra de anuncios hay que editar `views/pideco_theme_19.xml` y las traducciones de `i18n/`, que en español usan punto de miles ($200.000). Después hay que actualizar el módulo. Los bloques del home también se pueden editar con el editor del website, pero ese cambio queda solo en esa base.

A futuro se puede reemplazar el monto fijo por un campo de configuración conectado a la regla de pedido mínimo de Odoo.

## Datos que no viajan con el módulo

El paquete no incluye productos, imágenes del catálogo, categorías importadas, clientes, pedidos, usuarios, métodos de pago, reglas de envío ni configuraciones de compañía. Tampoco incluye cambios hechos directamente con el editor visual de una base distinta.

Para reproducir el catálogo hay que importar sus datos e imágenes por separado. Para reproducir una base completa se necesita un backup compatible de PostgreSQL y su filestore.

## Validaciones obligatorias en UAT

- Confirmar que el website de PIDECO sea el website activo y que sus productos y categorías estén asignados correctamente.
- Revisar home, tienda, wishlist, ficha de producto, carrito y checkout en español, inglés y chino.
- Confirmar que el QR de ARCA, el botón de arrepentimiento y cualquier otro bloque legal del footer sigan visibles.
- Validar las reglas reales de compra mínima y descuentos en el backend. Los montos mostrados por el theme son informativos.
- Carrusel del home: cambia cada 4 segundos, las flechas funcionan, toda la diapositiva lleva al link del botón y desde el editor se pueden agregar diapositivas y cambiar la velocidad.
- Probar editar el carrusel del home, actualizar el módulo y verificar que la personalización del editor se conserve.
- Ficha de producto: revisar productos con 1, 2 y 4 o más imágenes, que los detalles queden fijos al hacer scroll en escritorio, y el carrusel con miniaturas en celular.
- Agregar al carrito desde el home, la tienda y la ficha: debe abrirse solo el carrito lateral, sin el aviso flotante de Odoo encima.
- Abrir el buscador con la página scrolleada: el panel debe quedar pegado arriba.
- Cambiar entre ES, EN y 中文 desde el footer y volver, en distintas páginas.
- Verificar móvil desde 320 px y escritorio desde 1024 px.

## Alcance técnico

Los estilos, interacciones y variables SCSS se declaran únicamente en `web.assets_frontend`. Las variables se anteponen dentro de ese bundle para no cambiar la compilación de estilos del backend. El módulo añade sus campos de configuración al formulario de ajustes de Website.

El footer PIDECO reemplaza únicamente el primer bloque visual del footer estándar y conserva el contenedor nativo para que otros módulos puedan añadir contenido legal.

Plantillas que modifica el módulo (`views/pideco_theme_19.xml`):

- `pideco_layout_19` (hereda `website.layout`): header, barra de anuncios, buscador, carrito lateral y footer con selector de idioma.
- `pideco_homepage_19` (hereda `website.homepage`): contenido completo del home.
- `pideco_product_page_19`, `pideco_product_title_19` y `pideco_product_terms_19` (heredan de `website_sale`): recomendaciones, descuentos, categoría y SKU sobre el título, y garantías de compra.

La página de producto, el aviso del carrito y la posición del buscador se ajustan solo con CSS, sin reemplazar plantillas nativas. El JS (`static/src/js/pideco_ui.js`) maneja el buscador en vivo, el carrito lateral, el menú, los sliders, el cambio de idioma y la medición del alto del header para el carrusel del home.
