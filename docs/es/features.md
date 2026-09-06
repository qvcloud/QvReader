# Características y Funciones

Una descripción concisa y transparente de lo que QvReader ofrece hoy y lo que deliberadamente evita.

## Filosofía del Producto

QvReader es un **lector de Markdown ultraligero, de alta velocidad y centrado en el documento**, con la potencia de edición justa y necesaria.
Resuelve la necesidad frecuente de "abrir rápidamente un README, documentación generada por IA o notas locales" — abrirlo, leerlo como una página web limpia, realizar ajustes en el lugar y cerrar con `Esc`. **No** es un IDE pesado, un gráfico complejo de conocimiento, una base de datos en la nube ni un CMS.

Valores fundamentales (de la constitución del proyecto):

1. Inicio rápido y ejecutable compacto (~5MB nativo, inicio en frío <50 ms).
2. Lienzo de lectura limpio, sin anuncios ni distracciones.
3. La lectura es el estado predeterminado; la edición es explícita para evitar modificaciones accidentales.
4. Edición lo suficientemente potente para revisiones genuinas sin convertirse en una herramienta pesada.
5. Archivos locales y local-first: sin conexión requerida, 100% privado.

---

## Ediciones y Matriz de Capacidades

### Edición Comunitaria (Community Edition - Gratuita para Siempre)

- **Lectura instantánea de alto rendimiento**: Soporte completo de CommonMark / GFM, inicio <50 ms, uso mínimo de memoria. Maneja documentos de más de 50.000 líneas a 60 FPS con total fluidez.
- **Diseño fluido adaptativo a la pantalla**: Anchura dinámica (896px–1280px) con 3 modos seleccionables (`adaptativo`, `estándar`, `ancho completo`) en Ajustes.
- **Fidelidad de bytes del origen**: El archivo original es la única verdad. Los saltos de línea (LF/CRLF) y codificaciones (UTF-8/BOM) se preservan intactos.
- **Edición en el lugar con F2 (Función central, gratuita para siempre)**: Desarrollada con CodeMirror 6, edición directa sobre el lienzo de lectura sin límites ni pantallas de pago.
- **Vista previa dividida sincronizada con F3**: Editor y vista previa en tiempo real. Incluye 300 sesiones de prueba gratuitas; **nunca se bloquea al agotar la prueba** (solo aparece un aviso de Pro no intrusivo al cambiar de archivo), y **la edición y guardado de documentos nunca se bloquean**.
- **Diagramas de ingeniería y fórmulas**: Renderizado nativo de diagramas Mermaid y fórmulas KaTeX. Incluye un **modal interactivo de pantalla completa para diagramas Mermaid** con soporte para arrastrar, desplazarse y ampliar con doble clic.
- **Navegación de documentos**: Barra lateral de índice (TOC), menú contextual de clic derecho, temas integrados y ajuste de tamaño de letra.
- **Impresión nativa del sistema**: `Cmd/Ctrl+P` abre el cuadro de impresión optimizado para el ahorro de tinta.
- **CLI multiplataforma**: Apertura desde terminal (`qvreader <archivo>` / `qvreader .`).
- **Internacionalización completa**: 6 idiomas admitidos (Español, English, 简体中文, 日本語, 한국어, Português (Brasil)).

### Edición Pro (Pro Edition - $9.99 Compra Vitalicia)

- **Prueba gratuita completa**: La Edición Comunitaria incluye 300 usos de prueba sin requerir compra previa.
- **Gestión de espacio de trabajo**: Panel lateral y árbol de carpetas (`Cmd/Ctrl+Shift+W`) para navegar proyectos con múltiples archivos.
- **Canal de exportación completo**:
  - **Exportación a PDF vectorial** (`Cmd/Ctrl+Shift+P`): Salida directa de alta fidelidad.
  - **Exportación a imagen Retina** (`Cmd/Ctrl+Shift+E`): Captura 2x Retina copiada automáticamente al portapapeles.
  - **Exportación a HTML independiente** (`Cmd/Ctrl+Shift+H`): Archivo HTML autónomo para distribución offline.
- **Activación 100% local y sin conexión**: Licencia perpetua con actualizaciones de por vida, compatible con ≥3 dispositivos personales y eliminación total de avisos Pro.

---

## Soporte de Plataformas

| Plataforma / Arquitectura | Estado | Paquete de Entrega |
|---|---|---|
| macOS (Apple Silicon / arm64) | Principal | `QvReader-0.1.4-arm64.dmg` |
| macOS (Intel / x64) | Principal | `QvReader-0.1.4-x64.dmg` |
| Windows (x64) | Compatible vía CI | `QvReader-0.1.4-x64-setup.exe` / `.zip` |
| Linux (Debian / AppImage) | En evaluación tras estabilidad | `QvReader-0.1.4-amd64.AppImage` |

---

## Características Excluidas Deliberadamente

- Cuentas en la nube obligatorias o telemetría remota.
- Suscripciones mensuales recurrentes.
- Publicación de blogs o integración con CMS.
- Herramientas pesadas de IDE o gráficos de conocimiento complejos.
- Publicidad intrusiva o avisos que distraigan de la lectura.

Consulte [roadmap.md](roadmap.md) para ver los planes futuros y metas alcanzadas.
