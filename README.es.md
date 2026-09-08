<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**Lector y editor de Markdown ultraligero e instantáneo para macOS y Windows**

Abra un archivo `.md` y léalo como una página web limpia — inicio en frío en menos de 50 ms, respuesta instantánea. Limpio, sin distracciones y centrado en el documento.  
Presione `F2` para editar en el lugar, presione `F3` para una vista previa dividida sincronizada en tiempo real. Presione `Esc` al terminar para cerrar al instante.

[![Version](https://img.shields.io/badge/Desktop-v0.1.4-blue.svg)](https://github.com/qvcloud/QvReader/releases/tag/v0.1.4)
[![Website](https://img.shields.io/badge/Website-v1.0.8-emerald.svg)](https://qvreader.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](#descargas-y-espejos)

</div>

**Idiomas:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md)

---

## ¿Por qué QvReader?

La mayoría de los editores de Markdown están diseñados para la redacción pesada o para complejas bases de conocimiento. QvReader fue creado específicamente para la **lectura instantánea y la edición ligera de archivos Markdown locales**: archivos README, documentación generada por IA, especificaciones técnicas, actas de reuniones y notas de versiones.

- ⚡ **Rendimiento nativo extremo**: Creado con Rust y Tauri, con un instalador de ~5MB, un bundle JS de entrada de 614KB y un inicio en frío inferior a 50 ms. Maneja con fluidez documentos de más de 50.000 líneas a 60 FPS.
- 📐 **Diseño fluido adaptativo a la pantalla**: Control dinámico de anchura (896px–1280px) que elimina espacios blancos excesivos en pantallas anchas, con 3 modos: `adaptativo`, `estándar` y `ancho completo`.
- 📊 **Modal de zoom para diagramas Mermaid**: Renderizado nativo de diagramas de flujo, secuencia y arquitectura, con un modal interactivo de pantalla completa activable con doble clic (arrastrar, desplazar y ampliar).
- 📤 **Canal de exportación en 4 vías**: Impresión amigable con la tinta (`Cmd/Ctrl+P`), PDF vectorial de alta fidelidad (`Cmd/Ctrl+Shift+P`), PNG 2x Retina con copia automática al portapapeles (`Cmd/Ctrl+Shift+E`), y HTML independiente sin conexión (`Cmd/Ctrl+Shift+H`).
- 🔒 **Local-first y privacidad absoluta**: Sus archivos permanecen en su disco local. Sin necesidad de internet, sin telemetría de contenido y sin registros de cuenta obligatorios.
- ⌨️ **Contrato de interacción mínimo**: Doble clic en `.md` para abrir en modo lectura; presione `Esc` para cerrar; presione `F2` para edición en el lugar; presione `F3` para vista previa dividida.

---

## Descargas y Espejos

Descargue el paquete v0.1.4 desde GitHub Releases oficial o a través de espejos CDN acelerados:

| Plataforma / Arquitectura | Archivo | GitHub Releases Oficial | Espejo Rápido 1 (ghfast) | Espejo Rápido 2 (gh-proxy) |
|---|---|---|---|---|
| **macOS** (Apple Silicon) | `QvReader-0.1.4-arm64.dmg` | [Descargar](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [Descarga Rápida](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [Alternativa](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) |
| **macOS** (Intel x64) | `QvReader-0.1.4-x64.dmg` | [Descargar](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [Descarga Rápida](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [Alternativa](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) |
| **Windows** (Instalador x64) | `QvReader-0.1.4-x64-setup.exe` | [Descargar](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [Descarga Rápida](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [Alternativa](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) |
| **Windows** (Portable x64) | `QvReader-0.1.4-windows-x64.zip` | [Descargar](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [Descarga Rápida](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [Alternativa](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) |
| **Linux** (AppImage x64) | `QvReader-0.1.4-amd64.AppImage` | [Descargar](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [Descarga Rápida](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [Alternativa](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) |

Versiones anteriores y sumas de verificación están en la [página de GitHub Releases](https://github.com/qvcloud/QvReader/releases).

---

## Guía de Instalación y Confianza de Seguridad

Los paquetes de la comunidad de QvReader se compilan de forma transparente mediante GitHub Actions CI con sumas SHA256 públicas. Mientras se tramitan los certificados comerciales de firma de código, el sistema operativo puede mostrar una advertencia de seguridad. Siga estas instrucciones para confiar y ejecutar la aplicación:

### macOS (Apple Gatekeeper)

Si aparece el aviso: *"No se puede abrir 'QvReader' porque no se puede verificar el desarrollador"* o *"La aplicación está dañada y no se puede abrir"*:

1. **Autorización rápida en la interfaz gráfica**:
   - Arrastre `QvReader.app` a `/Applications`.
   - Haga **clic derecho** (o Control + clic) sobre `QvReader.app` y seleccione **"Abrir"**.
   - En el cuadro de diálogo de confirmación, haga clic nuevamente en **"Abrir"**. La aplicación se ejecutará normalmente.
2. **Comando de terminal (Recomendado)**:
   ```bash
   xattr -cr /Applications/QvReader.app
   ```

### Windows (Microsoft Defender SmartScreen)

Si aparece una ventana azul indicando: *"Windows protegió su PC"*:

1. Haga clic en el enlace **"Más información"** (More info).
2. Haga clic en el botón **"Ejecutar de todas formas"** (Run anyway) que aparece abajo a la derecha.

---

## Atajos de Teclado Principales

| Acción / Modo | Atajo (macOS) | Atajo (Windows/Linux) | Descripción |
|---|---|---|---|
| **Edición en el lugar** | `F2` | `F2` | Edición inmediata sobre el lienzo de lectura, **100% gratuita para siempre** |
| **Vista previa dividida** | `F3` | `F3` | Código fuente a la izquierda y vista previa sincronizada a la derecha |
| **Salir / Cerrar** | `Esc` | `Esc` | Sale del modo edición; cierra la ventana inmediatamente si no hay cambios |
| **Guardar archivo** | `Cmd + S` | `Ctrl + S` | Conserva saltos de línea (LF/CRLF) y codificación (UTF-8) |
| **Imprimir documento** | `Cmd + P` | `Ctrl + P` | Diálogo nativo de impresión con estilos económicos de tinta |
| **Exportar a PDF** | `Cmd + Shift + P` | `Ctrl + Shift + P` | Salida vectorial en PDF de alta fidelidad |
| **Exportar a imagen Retina** | `Cmd + Shift + E` | `Ctrl + Shift + E` | Captura 2x Retina copiada automáticamente al portapapeles |
| **Exportar a HTML independiente**| `Cmd + Shift + H` | `Ctrl + Shift + H` | Archivo HTML completamente autónomo y sin conexión |
| **Centro de Ajustes** | `Cmd + ,` | `Ctrl + ,` | Temas, modo de diseño (adaptativo/estándar/ancho completo) y tamaño de fuente |

---

## Ediciones y Modelo Comercial

QvReader mantiene un modelo comercial transparente y local-first:

- **Edición Comunitaria (Community Edition, gratuita para siempre)**:
  - Experiencia de lectura completa y sin anuncios.
  - Edición en el lugar con `F2` 100% gratuita y sin límites.
  - La vista previa dividida `F3` y funciones avanzadas incluyen 300 sesiones de prueba.
  - **No se bloquea al agotar la prueba**: Puede seguir usando el modo F3 libremente (solo aparece un aviso no intrusivo al cambiar de archivo), y **la edición y guardado de documentos nunca se bloquean**.
- **Edición Pro (Pro Edition, $9.99 compra única vitalicia)**:
  - Pago único con actualizaciones de por vida, sin suscripciones periódicas.
  - Soporta **más de 3 dispositivos personales** (macOS y Windows combinados).
  - **Activación 100% local sin conexión**, eliminando cualquier mensaje o aviso Pro.
  - Garantía de reembolso de 14 días a través de [qvreader.com](https://qvreader.com).

---

## Documentación y Comunidad

- [Guía Detallada de Funciones](docs/es/features.md)
- [Manual de Uso y Atajos](docs/es/usage.md)
- [Hoja de Ruta y Planes Futuros](docs/es/roadmap.md)
- [Compilación desde el Código Fuente](docs/es/development.md)
- [Guía de Contribución (en inglés)](CONTRIBUTING.md)
- [Código de Conducta (en inglés)](CODE_OF_CONDUCT.md)
- [Política de Seguridad (en inglés)](SECURITY.md)
- [Gobernanza (en inglés)](GOVERNANCE.md)
- [Política de Soporte (en inglés)](SUPPORT.md)
- [Proceso de Lanzamiento](docs/es/release-process.md)
- [Registro de Cambios](CHANGELOG.md)

---

## Licencia y Marcas Registradas

- **Código Fuente**: Distribuido bajo la [Licencia Apache 2.0](LICENSE). Consulte [NOTICE](NOTICE) y [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- **Marcas Registradas**: El nombre "QvReader" y los logotipos oficiales se rigen por [TRADEMARKS.md](TRADEMARKS.md). Las compilaciones de terceros deben identificarse como "Community Build".
