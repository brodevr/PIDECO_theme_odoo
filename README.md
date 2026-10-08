# PIDECO_theme_odoo

Módulo de Odoo 19 `pideco_theme`: identidad visual de PIDECO para Website y eCommerce (home, header, footer, buscador, tienda y ficha de producto), con traducciones al español y al chino.

## Documentación

- [Instalación y uso](pideco_theme/EXPORTAR-A-OTRO-ODOO.md): requisitos, instalación, edición del carrusel e imágenes del home, ficha de producto, montos informativos y validaciones.
- [Historial de cambios](pideco_theme/CHANGELOG.md): qué cambió en cada versión.

## Ramas y versiones

- `main`: versión estable, la que se instala en producción. Cada versión publicada tiene su tag (`v19.0.1.2.0`, …).
- `dev`: trabajo en curso para la próxima versión.
- Entregas de terceros (por ejemplo, un partner de implementación) entran por una rama propia y se revisan antes de pasar a `main`.

Para publicar una versión: subir `version` en `pideco_theme/__manifest__.py`, pasar la sección "Sin publicar" del `CHANGELOG.md` a la nueva versión, mergear `dev` en `main` y crear el tag.

```bash
git switch main
git merge dev
git tag v19.0.X.Y.Z
git push origin main v19.0.X.Y.Z
git switch dev
```
