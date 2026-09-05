<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**Lector y editor de Markdown ultraligero e instantáneo para macOS y Windows**

Abre un archivo `.md` y léelo como una página web — en milisegundos. Limpio, sin distracciones,
centrado en el documento. Pulsa `F2` para editar en el lugar, `F3` para una vista dividida en vivo.
Cuando termines, pulsa `Esc` y sal.

</div>

**Idiomas:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Português (Brasil)](README.pt-BR.md) · [Español](README.es.md)

---

## ¿Por qué QvReader?

La mayoría de las herramientas de Markdown resuelven "escribir mucho". QvReader resuelve **leer y
editar ligeramente documentos locales con rapidez** — README, documentos generados por IA, notas de
reuniones, notas de versión.

- **Se abre al instante.** Haz doble clic en un archivo y estás leyendo. Sin proyecto, sin bóveda, sin mesa de trabajo.
- **Huella mínima.** Una app nativa Tauri — sin motor de navegador incluido. El instalador ocupa unos pocos MB.
- **Lectura sin distracciones.** Tipografía limpia, sin barras de herramientas que llenen la página. Leer es el estado predeterminado.
- **Local primero.** Tus archivos permanecen en tu disco. Sin cuenta, sin nube, sin telemetría de tu contenido.
- **Edita cuando lo necesites.** Leer nunca corrompe tu fuente. Editar es explícito y siempre respeta tus bytes originales.

---

## Características

### Lectura (predeterminado)

| Capacidad | Detalle |
|---|---|
| Apertura instantánea | Doble clic en `.md` → vista de lectura |
| Renderizado GFM | Encabezados, tablas, listas de tareas, tachado, citas |
| Código resaltado | highlight.js, detección automática de lenguaje |
| Matemáticas (KaTeX) | LaTeX en línea y en bloque |
| Imágenes locales | Las rutas relativas se resuelven contra el directorio del documento |
| Esquema (TOC) | Navega documentos largos por encabezados; sección actual resaltada |
| Temas | Claro / Oscuro / Seguir sistema + preajustes |
| Tamaño de texto | Tamaño del cuerpo y zoom ajustables |
| Observación de archivo | Detecta ediciones externas, avisa antes de sobrescribir |

### Edición y autoría

| Modo | Atajo | Reglas y funcionamiento |
|---|---|---|
| **Edición en línea** | `F2` | **Función básica, gratis para siempre**. Edita directamente en el lienzo vía CodeMirror 6 |
| **Vista dividida** | `F3` | Fuente a la izquierda, vista previa sincrónica en tiempo real. **20 usos diarios gratis**, aviso suave sin bloqueo al exceder |
| **Modo de lectura** | `Esc` | Vuelve a la lectura limpia; cierra la ventana rápidamente si no hay cambios |

- `Cmd/Ctrl+S` guarda con **fidelidad de saltos de línea (LF/CRLF) y codificación (UTF-8/BOM)**.
- Los cambios sin guardar están estrictamente protegidos — sin pérdida silenciosa de datos al cerrar o salir.
- La vista dividida mantiene tu línea de cursor alineada y resaltada en la vista previa.
- Todas las vistas comparten un único estado de documento e historial de deshacer.

### Exportación y compartir

- **Impresión estándar** (`Cmd/Ctrl+P`): Diálogo de impresión nativo del sistema con estilo optimizado para papel y tinta. Gratis para siempre.
- **Exportar a PDF** (`Cmd/Ctrl+Shift+P`): Proceso guiado de exportación directa a PDF.
- **Exportar a imagen PNG** (`Cmd/Ctrl+Shift+E`): Captura 2x Retina en alta resolución. Descarga automática y copia directa al portapapeles.
- **Exportar a HTML independiente** (`Cmd/Ctrl+Shift+H`): Archivo único portátil con estilos y motores fuera de línea integrados.
- *(Las exportaciones avanzadas y el espacio de trabajo incluyen una prueba de 300 sesiones. La edición Pro es ilimitada de por vida)*

### Espacio de trabajo y proyectos

- Presiona `Cmd/Ctrl+Shift+W` o haz clic en el cajón superior para desplegar la **barra lateral de árbol de archivos**.
- Ejecuta `qvreader .` desde la terminal para abrir la carpeta actual como espacio de trabajo de inmediato.

---

## Instalación

Descarga el instalador más reciente para tu plataforma desde la página de
**[GitHub Releases](https://github.com/qvcloud/QvReader/releases)**.

| Plataforma | Artefacto |
|---|---|
| macOS (Apple Silicon e Intel) | `QvReader_<ver>_universal.dmg` |
| Windows (x64) | `QvReader_<ver>_x64-setup.exe` / `.msi` |
| Linux (Debian / AppImage) | `QvReader_<ver>_amd64.deb` / `.AppImage` |

> El repositorio donde vive esta página es el **hogar de la comunidad y las versiones**. El código fuente
> se desarrolla en privado y se refleja en instaladores publicados bajo **Releases**.

### Registrar el CLI `qvreader` (opcional)

```bash
# macOS: apunta el envoltorio a la app instalada
qvreader README.md        # abrir un archivo
qvreader .                # abrir la carpeta actual como espacio de trabajo
```

---

## Inicio rápido

```bash
# abrir un archivo concreto
qvreader path/to/file.md

# abrir una carpeta como espacio de trabajo
qvreader .

# doble clic en cualquier archivo .md
# simplemente se abre — lectura, de inmediato
```

**Lectura** → desplazarte, seguir enlaces, seleccionar texto.
**Edición** → pulsa `F3` (dividida) o `F2` (en línea), haz cambios, `Cmd/Ctrl+S` para guardar, `Esc` para volver.
**Navegación** → alterna la barra lateral de esquema / espacio de trabajo.

---

## Documentación

- [Uso y atajos](docs/es/usage.md)
- [Características](docs/es/features.md)
- [Desarrollo (compilar desde el código fuente)](docs/es/development.md)
- [Proceso de versión](docs/es/release-process.md)
- [Registro de cambios](CHANGELOG.md)

---

## Estado del proyecto

QvReader está en desarrollo activo. macOS es la plataforma principal de lanzamiento; Windows se
publica vía CI. Linux se evalúa cuando la estabilidad central y la capacidad de prueba estén listas.

Consulta [docs/es/roadmap.md](docs/es/roadmap.md) para lo planeado y lo explícitamente fuera de alcance.

---

## Licencia

[Apache License 2.0](LICENSE)

```
Copyright 2026 QvCloud (qvreader.com)
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
