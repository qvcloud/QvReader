# 开发（从源码构建）

> 说明：**应用源代码存放在私有仓库**。本 `release` 仓库是**社区 + 发布主页**：保存文档、许可证、
> 更新日志，并指向 GitHub Releases 上发布的安装包。公开的源码镜像以后可能在此发布。

## 技术栈

- **桌面框架：** Tauri v2（Rust 核心 + 系统 WebView）
- **前端：** React 18 + Vite + TypeScript
- **编辑：** CodeMirror 6
- **渲染：** markdown-it + highlight.js + KaTeX
- **支持平台：** macOS（主要）、Windows、Linux（进行中）

## 本地 macOS 构建（打包 DMG 的前置条件）

```bash
# 1. 安装 Rust 及你需要的 Apple 目标
#    例如通过 rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add aarch64-apple-darwin x86_64-apple-darwin   # universal

# 2. 安装 JS 依赖
cd client
npm install

# 3. 以开发模式运行（可带示例文档）
npm run tauri dev -- path/to/sample.md

# 4. 构建 release 应用 + DMG
npm run tauri build

# 5. 可选：注册 `qvreader` CLI
make install-cli
```

## 自动化发布构建

CI 工作流（`build-desktop.yml`）在推送 tag `v*` 时构建：

- **macOS** —— universal（Intel + Apple Silicon）`.dmg`
- **Windows** —— `.msi` + NSIS `.exe`
- **Linux** —— `.deb` + `.AppImage`

产物会自动附加到 [GitHub Releases](https://github.com/qvcloud/QvReader/releases)。

## 项目结构

```
release/
├── README.md            # 面向社区的门户页
├── CHANGELOG.md
├── LICENSE              # Apache-2.0
├── docs/                # usage / features / roadmap / development
├── assets/              # logo 与应用图标
└── scripts/             # 发布辅助脚本
```
