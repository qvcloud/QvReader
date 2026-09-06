# Guía de Uso y Atajos de Teclado

QvReader está diseñado alrededor de tres vistas principales. Siempre comenzará en **modo lectura** (el estado más seguro: los clics y la navegación nunca modificarán sus archivos de origen).

## Atajos de Teclado Principales

| Acción / Modo | Atajo (macOS) | Atajo (Windows/Linux) | Descripción |
|---|---|---|---|
| Abrir archivo | Doble clic en `.md`, o `qvreader file.md` | Mismo | Apertura instantánea |
| Abrir carpeta como espacio de trabajo | `qvreader .` | Mismo | Abre el panel lateral de carpetas |
| **Edición en el lugar** | `F2` | `F2` | Edición directa en el lienzo; **100% gratuita para siempre** |
| **Vista previa dividida** | `F3` | `F3` | Edición en paralelo; 300 usos de prueba, no se bloquea |
| Volver a lectura / Salir de edición | `Esc` o presione `F2`/`F3` de nuevo | Mismo | Regreso a la lectura limpia |
| Guardar documento | `Cmd + S` | `Ctrl + S` | Preserva saltos de línea (LF/CRLF) y codificación UTF-8 |
| Imprimir documento | `Cmd + P` | `Ctrl + P` | Cuadro nativo de impresión con formato económico |
| Exportar a PDF | `Cmd + Shift + P` | `Ctrl + Shift + P` | Generación directa de PDF vectorial |
| Exportar a imagen Retina | `Cmd + Shift + E` | `Ctrl + Shift + E` | Captura 2x Retina con copia al portapapeles |
| Exportar a HTML independiente | `Cmd + Shift + H` | `Ctrl + Shift + H` | Archivo HTML completamente autónomo y offline |
| Alternar barra de índice (TOC) | `Cmd + Shift + O` | `Ctrl + Shift + O` | Navegación por encabezados |
| Alternar barra de espacio de trabajo | `Cmd + Shift + W` | `Ctrl + Shift + W` | Explorador de archivos del proyecto |
| Guía rápida de atajos | `Cmd + /` | `Ctrl + /` | Ventana emergente con lista de atajos |
| Acercar / Alejar zoom | `Cmd + Rueda` | `Ctrl + Rueda` | Escala interfaz y texto |
| Cerrar ventana / Salir | `Esc` (sin cambios) | `Esc` | Cierre inmediato |
| Abrir Centro de Ajustes | `Cmd + ,` | `Ctrl + ,` | Temas, modo de diseño y tamaño de fuente |

---

## Modo Lectura

- **Seguridad predeterminada**: Lea, desplácese, seleccione texto, acceda a enlaces y visualice imágenes.
- **Diseño fluido adaptativo**: Elija entre `adaptativo` (896px–1280px fluido), `estándar` (896px fijo) o `ancho completo` en Ajustes (`Cmd/Ctrl+,`).
- **Interacción con diagramas Mermaid**: Haga doble clic en cualquier diagrama Mermaid para abrir el modal interactivo de pantalla completa (soporta arrastre y zoom con rueda del ratón).
- **Navegación por índice**: La barra lateral (`Cmd/Ctrl+Shift+O`) resalta la sección activa de lectura.
- **Impresión estándar**: `Cmd/Ctrl+P` abre el cuadro de impresión nativo del sistema.

---

## Edición en el Lugar (F2)

- **Función central, gratuita para siempre**: Sin límites de prueba ni ventanas emergentes.
- Edite directamente sobre el lienzo de lectura en la posición actual del cursor, preservando el contexto visual.
- Ideal para correcciones rápidas, actualización de enlaces o notas breves. Presione `Esc` o `F2` para regresar a la vista de lectura.
- Presione `Cmd/Ctrl+S` para guardar conservando los saltos de línea y la codificación de bytes.

---

## Vista Dividida (F3)

- Panel izquierdo: editor de Markdown; panel derecho: vista previa sincronizada en tiempo real.
- Las modificaciones actualizan la vista previa al instante con optimización inteligente.
- El desplazamiento se sincroniza entre ambos paneles; **la línea activa se resalta en la vista previa**.
- **Política de prueba**: Incluye 300 sesiones de prueba gratuitas. **Nunca se bloquea al agotar la cuota**: Puede seguir utilizando el modo F3 libremente (solo aparece un aviso de Pro no intrusivo al abrir un nuevo archivo), y **la edición y guardado de documentos nunca se bloquean**.

---

## Espacio de Trabajo y Exportación Avanzada (Funciones Pro)

- **Panel de espacio de trabajo** (`Cmd/Ctrl+Shift+W`): Explore directorios completos de archivos Markdown.
- **Canal de exportación avanzada**: Exportación a PDF vectorial (`Cmd/Ctrl+Shift+P`), PNG 2x Retina (`Cmd/Ctrl+Shift+E`) y HTML autónomo (`Cmd/Ctrl+Shift+H`).
- La Edición Comunitaria incluye 300 usos de prueba; los usuarios de la versión Pro disfrutan de acceso ilimitado de por vida.

---

## Instrucciones de Instalación y Seguridad

- **macOS**: Si aparece el aviso de desarrollador no identificado, haga clic derecho en la aplicación y elija "Abrir", o ejecute en la terminal `xattr -cr /Applications/QvReader.app`.
- **Windows**: Si aparece SmartScreen, haga clic en "Más información" y seleccione "Ejecutar de todas formas".
