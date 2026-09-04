# Características

Una descripción concisa y honesta de lo que QvReader hace hoy y de lo que deliberadamente no hace.

## Posición del producto

QvReader es un **lector de Markdown ligero, rápido y centrado en el documento**, con edición solo lo
suficiente. Ataca el momento de "leer rápido un README / documento generado por IA / nota local" —
ábrelo, léelo como una página web, edítalo allí mismo si lo necesitas, ciérralo con `Esc`. **No** es un
IDE, una base de conocimiento, una bóveda sincronizada en la nube ni un CMS completo.

Valores centrales (de la carta del proyecto):

1. Rápido de abrir, pequeño de instalar.
2. Superficie de lectura limpia, sin desorden.
3. Leer es lo predeterminado; editar es explícito para que no alteres la fuente accidentalmente.
4. Editar es suficiente para arreglos reales, nunca un editor pesado.
5. Archivos locales, local primero, sin cuenta ni nube obligatorias.

## Capacidades actuales (v0.1.0)

- **Lectura instantánea** de documentos CommonMark / GFM.
- **Fidelidad** — el archivo fuente es la única fuente de verdad. La sintaxis desconocida, los saltos de
  línea y las codificaciones se preservan intactos.
- **Edición en línea F2** y **edición dividida F3** con vista previa en vivo.
- **Resaltado de código** (highlight.js), **matemáticas** (KaTeX).
- **Esquema (TOC)**, **espacio de trabajo de carpeta** con árbol de archivos.
- **Temas**, tamaño de texto ajustable, **6 idiomas de interfaz**.
- **CLI** (`qvreader <archivo>` / `qvreader .`).

## Multiplataforma

| Plataforma | Estado |
|---|---|
| macOS (Apple Silicon + Intel, universal) | Principal, compatible |
| Windows (x64) | Compatible vía CI |
| Linux (Debian / AppImage) | Evaluada tras la estabilidad central |

## Explícitamente fuera de alcance

La carta del proyecto excluye lo siguiente para proteger la identidad de "rápido, pequeño, enfocado":

- Sincronización en la nube, sincronización con hosting Git o unidades integradas.
- Publicación de blogs, maquetación de artículos de WeChat o CMS genérico.
- Convertirse en base de conocimiento / IDE para igualar a Typora, Obsidian o VS Code.
- Cuentas, pagos, códigos de activación, suscripciones o licencias multidispositivo.
- Forzar o establecer silenciosamente asociaciones de archivo predeterminadas.
- Ecosistemas grandes y no verificados de plugins y temas.

Consulta también [roadmap.md](roadmap.md) para el trabajo futuro candidato.
