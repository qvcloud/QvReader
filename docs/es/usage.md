# Uso y atajos de teclado

QvReader se diseña en torno a tres estados. Siempre comienzas en el **modo de lectura** (el
predeterminado, y la única vista segura — los clics y la escritura comunes nunca alteran tu fuente).

## Interacciones principales

| Acción | macOS | Windows / Linux |
|---|---|---|
| Abrir un archivo | Doble clic en `.md`, o `qvreader file.md`, o Archivo → Abrir | igual |
| Abrir carpeta como espacio de trabajo | `qvreader .` | igual |
| Entrar en la **vista dividida** | `F3` | `F3` |
| Entrar en la **edición en línea** | `F2` | `F2` |
| Volver a la lectura | `F3` / `F2` (alternar) | igual |
| Guardar | `Cmd + S` | `Ctrl + S` |
| Zoom | `Cmd + desplazamiento` | `Ctrl + desplazamiento` |
| Cerrar / salir | `Esc` (cuando está limpio) | `Esc` |
| Configuración | `Cmd + ,` | `Ctrl + ,` |

## Modo de lectura

- Leer, desplazarte, seleccionar texto, seguir enlaces, ver imágenes.
- Barra lateral **Esquema**: navega por encabezados; la sección actual está resaltada.
- Barra lateral **Espacio de trabajo**: navega y cambia entre archivos Markdown en una carpeta.
- **Temas** y tamaño del texto viven en Configuración (`Cmd/Ctrl+,`).

## Vista dividida (F3)

- Izquierda: fuente Markdown. Derecha: vista previa renderizada en vivo.
- La edición actualiza la vista previa (con debounce para que la escritura siga siendo fluida).
- El panel que desplazas impulsa al otro; tu **línea activa está resaltada** en la vista previa y se mantiene alineada.
- Guarda con `Cmd/Ctrl+S`. Los saltos de línea y la codificación originales se preservan.

## Edición en línea (F2)

- Edita directamente sobre el lienzo de lectura, en la posición actual.
- Útil para errores tipográficos rápidos, enlaces rotos o un arreglo de una línea sin abrir un panel dividido.
- Mismas reglas de fidelidad de fuente que la vista dividida.

## Guardar y seguridad

- QvReader preserva los **bytes originales** de tu archivo: saltos de línea (LF/CRLF) y codificación
  (UTF-8, con/sin BOM) se detectan y se escriben sin cambios.
- Si el archivo cambia en el disco fuera de QvReader, se te avisa antes de sobrescribir.
- Cerrar o cambiar de modo con ediciones sin guardar te pregunta si deseas guardar, descartar o permanecer.

## Idioma

Cambia el idioma de la interfaz en Configuración → General → Idioma. Compatibles: English, 简体中文,
日本語, 한국어, Português (Brasil), Español.
