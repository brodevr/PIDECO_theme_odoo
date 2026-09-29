# PIDECO Theme — instalación en Odoo 19

Módulo visual para Website y eCommerce en Odoo 19 Community o Enterprise. Incluye el home base, header, footer, tienda, ficha de producto, estilos responsive, interacciones, fuentes y traducciones.

## Requisitos

- Odoo 19 con `website_sale` y `website_sale_wishlist` instalados.
- Los idiomas públicos del sitio son `es_AR` y `zh_CN`. `es_AR` debe quedar como idioma principal y predeterminado. Inglés se mantiene únicamente como idioma fuente técnico de Odoo y no debe añadirse al website de PIDECO.
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
- Revisar home, tienda, wishlist, ficha de producto, carrito y checkout en español y chino.
- Confirmar que el QR de ARCA, el botón de arrepentimiento y cualquier otro bloque legal del footer sigan visibles.
- Validar las reglas reales de compra mínima y descuentos en el backend. Los montos mostrados por el theme son informativos.
- Probar editar el hero, actualizar el módulo y verificar que la personalización del editor se conserve.
- Verificar móvil desde 320 px y escritorio desde 1024 px.

## Alcance técnico

Los estilos, interacciones y variables SCSS se declaran únicamente en `web.assets_frontend`. Las variables se anteponen dentro de ese bundle para no cambiar la compilación de estilos del backend. El módulo añade sus campos de configuración al formulario de ajustes de Website.

El footer PIDECO reemplaza únicamente el primer bloque visual del footer estándar y conserva el contenedor nativo para que otros módulos puedan añadir contenido legal.
