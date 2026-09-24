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

Después de instalar, seleccionar **PIDECO Theme como tema activo del website PIDECO**. Instalar el módulo no basta: Odoo excluye los assets de los temas que no están seleccionados. Verificar que `website.theme_id` apunte a `pideco_theme`; si conserva `theme_default`, la web aparecerá sin estilos ni interacciones PIDECO.

Para actualizar una instalación existente:

```bash
odoo -d NOMBRE_BASE -u pideco_theme --stop-after-init
```

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
