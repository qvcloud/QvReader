# Desarrollo (compilar desde el código fuente)

> Nota: el **código fuente de la aplicación vive en un repositorio privado**. Este repositorio `release` es
> el **hogar de la comunidad + versiones**: contiene docs, licencia, changelog y apunta a los instaladores
> publicados en GitHub Releases. Espejos públicos del código pueden publicarse aquí más adelante.

## Pila tecnológica

- **Framework de escritorio:** Tauri v2 (núcleo Rust + webview del sistema)
- **Frontend:** React 18 + Vite + TypeScript
- **Edición:** CodeMirror 6
- **Renderizado:** markdown-it + highlight.js + KaTeX
- **Plataformas compatibles:** macOS (principal), Windows, Linux (en curso)

## Compilación local en macOS (requisito para empaquetar un DMG)

```bash
# 1. Instala Rust + los destinos de Apple que necesitas
#    por ejemplo, vía rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add aarch64-apple-darwin x86_64-apple-darwin   # universal

# 2. Instala las dependencias JS
cd client
npm install

# 3. Ejecuta en modo de desarrollo (con un documento de ejemplo)
npm run tauri dev -- path/to/sample.md

# 4. Compila una app de release + DMG
npm run tauri build

# 5. Opcional: registra el CLI `qvreader`
make install-cli
```

## Compilaciones de release automatizadas

Un workflow de CI (`build-desktop.yml`) compila al enviar una tag `v*`:

- **macOS** — universal (Intel + Apple Silicon) `.dmg`
- **Windows** — `.msi` + NSIS `.exe`
- **Linux** — `.deb` + `.AppImage`

Los artefactos se adjuntan automáticamente a [GitHub Releases](https://github.com/qvcloud/QvReader/releases).

## Estructura del proyecto

```
release/
├── README.md            # página de entrada orientada a la comunidad
├── CHANGELOG.md
├── LICENSE              # Apache-2.0
├── docs/                # usage / features / roadmap / development
├── assets/              # logo e icono de la app
└── scripts/             # ayudantes de publicación
```
