# Desenvolvimento (compilar do código-fonte)

> Nota: o **código-fonte do aplicativo vive em um repositório privado**. Este repositório `release` é a
> **casa de comunidade + release**: contém docs, licença, changelog e aponta para os instaladores
> publicados no GitHub Releases. Espelhos públicos do código podem ser publicados aqui mais tarde.

## Pilha tecnológica

- **Framework desktop:** Tauri v2 (núcleo Rust + webview do sistema)
- **Frontend:** React 18 + Vite + TypeScript
- **Edição:** CodeMirror 6
- **Renderização:** markdown-it + highlight.js + KaTeX
- **Plataformas suportadas:** macOS (principal), Windows, Linux (em andamento)

## Compilação local macOS (pré-requisito para empacotar um DMG)

```bash
# 1. Instale Rust + os alvos Apple de que precisa
#    por exemplo, via rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add aarch64-apple-darwin x86_64-apple-darwin   # universal

# 2. Instale as dependências JS
cd client
npm install

# 3. Execute em modo de desenvolvimento (com um doc de exemplo)
npm run tauri dev -- path/to/sample.md

# 4. Compile um app de release + DMG
npm run tauri build

# 5. Opcional: registre o CLI `qvreader`
make install-cli
```

## Compilações de release automatizadas

Um workflow de CI (`build-desktop.yml`) compila no push de tag `v*`:

- **macOS** — universal (Intel + Apple Silicon) `.dmg`
- **Windows** — `.msi` + NSIS `.exe`
- **Linux** — `.deb` + `.AppImage`

Os artefatos são anexados automaticamente ao [GitHub Releases](https://github.com/qvcloud/QvReader/releases).

## Estrutura do projeto

```
release/
├── README.md            # página de entrada voltada à comunidade
├── CHANGELOG.md
├── LICENSE              # Apache-2.0
├── docs/                # usage / features / roadmap / development
├── assets/              # logo e ícone do app
└── scripts/             # auxiliares de publicação
```
