<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**适用于 macOS 与 Windows 的超轻量、即时 Markdown 阅读器与编辑器**

打开一个 `.md` 文件，像浏览网页一样阅读——毫秒级冷启，极速响应。干净、无干扰、以文档为中心。  
按 `F2` 就地编辑，按 `F3` 进入实时分屏预览。阅读完毕按 `Esc` 即可秒速关闭。

[![Version](https://img.shields.io/badge/Desktop-v0.1.4-blue.svg)](https://github.com/qvcloud/QvReader/releases/tag/v0.1.4)
[![Website](https://img.shields.io/badge/Website-v1.0.8-emerald.svg)](https://qvreader.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](#下载与安装)

</div>

**语言切换：** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md)

---

## 为什么选择 QvReader？

大多数 Markdown 工具侧重于“重度内容写作”或“网状笔记库”。QvReader 专为**极速阅读、快速查阅与轻量编辑本地 Markdown 文档**而生——
无论是项目的 README、AI 生成的代码文档、技术规范，还是会议纪要与发布说明。

- ⚡ **原生极致性能**：基于 Rust 与 Tauri 构建，安装包仅约 5MB，JS 入口 614KB，冷启动低于 50ms。轻松支撑 50,000+ 行超长文档以 60 FPS 流畅滚动。
- 📐 **智能屏宽排版**：内置响应式流式布局（896px~1280px），告别宽屏两侧过宽留白，支持“自适应 / 标准 / 全宽”3 种排版模式。
- 📊 **Mermaid 图表全屏缩放**：原生渲染流程图、时序图与架构图，支持双击弹出全屏交互式缩放弹窗（拖拽、平移、放大）。
- 📤 **4 种全场景导出流水线**：墨水友好打印（`Cmd/Ctrl+P`）、高保真矢量 PDF（`Cmd/Ctrl+Shift+P`）、2x Retina 高清长图自动复制到剪贴板（`Cmd/Ctrl+Shift+E`）、独立离线单文件 HTML（`Cmd/Ctrl+Shift+H`）。
- 🔒 **本地优先与纯粹隐私**：文档完全留在本地磁盘，无需网络连接、不采集文档内容、无强制账户注册。
- ⌨️ **极简核心交互契约**：双击 `.md` 毫秒级进入阅读模式；按 `Esc` 退出；按 `F2` 就地原位编辑；按 `F3` 进入实时分屏协同。

---

## 下载与高速镜像

从官方 GitHub Releases 或经过验证的国内高速 CDN 加速镜像下载 v0.1.4 安装包：

| 平台架构 | 安装包文件 | 官方 GitHub 直连 | 国内高速镜像 1 (ghfast) | 国内高速镜像 2 (gh-proxy) |
|---|---|---|---|---|
| **macOS** (Apple Silicon) | `QvReader-0.1.4-arm64.dmg` | [下载](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [高速下载](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [备用下载](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) |
| **macOS** (Intel x64) | `QvReader-0.1.4-x64.dmg` | [下载](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [高速下载](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [备用下载](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) |
| **Windows** (x64 安装版) | `QvReader-0.1.4-x64-setup.exe` | [下载](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [高速下载](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [备用下载](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) |
| **Windows** (x64 便携版) | `QvReader-0.1.4-windows-x64.zip` | [下载](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [高速下载](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [备用下载](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) |
| **Linux** (x64 AppImage) | `QvReader-0.1.4-amd64.AppImage` | [下载](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [高速下载](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [备用下载](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) |

更多历史版本与校验码见 [GitHub Releases 页面](https://github.com/qvcloud/QvReader/releases)。

---

## 安装与系统安全信任指引

QvReader 社区发行包由 GitHub Actions 自动化透明构建并提供哈希校验。在正式申请商业代码签名证书前，部分系统会弹出默认拦截提示，请按下方指引一键信任运行：

### macOS 系统（Apple Gatekeeper）

若首次启动时出现系统提示：“无法打开‘QvReader’，因为无法验证开发者”或“App 已损坏，无法打开”：

1. **图形界面快速信任**：
   - 将 `QvReader.app` 拖入 `/Applications`（应用程序目录）。
   - **右键点击** `QvReader.app`，在弹出菜单中选择 **“打开”**。
   - 在系统确认对话框中再次点击 **“打开”** 即可正常进入，后续启动无需重复操作。
2. **终端一键解除隔离属性（推荐）**：
   ```bash
   xattr -cr /Applications/QvReader.app
   ```

### Windows 系统（Microsoft Defender SmartScreen）

若首次启动时出现蓝色提示窗口：“Windows 已保护你的电脑”：

1. 点击弹窗中的 **“更多信息”**（More info）链接。
2. 点击右下角出现的 **“仍要运行”**（Run anyway）按钮即可正常启动。

---

## 核心快捷键一览

| 模式 / 动作 | 快捷键（macOS） | 快捷键（Windows/Linux） | 说明 |
|---|---|---|---|
| **就地编辑** | `F2` | `F2` | 核心基础功能，原位即时编辑，**永久 100% 免费** |
| **分屏实时预览** | `F3` | `F3` | 左侧源码，右侧毫秒级同步预览，双向光标同步 |
| **退出 / 关闭** | `Esc` | `Esc` | 退出编辑模式；未修改时快速关闭窗口 |
| **保存文件** | `Cmd + S` | `Ctrl + S` | 严格保留原始编码与换行符（LF / CRLF） |
| **系统打印** | `Cmd + P` | `Ctrl + P` | 原生打印对话框与墨水优化样式 |
| **导出 PDF** | `Cmd + Shift + P` | `Ctrl + Shift + P` | 高保真矢量 PDF 输出 |
| **导出高清长图** | `Cmd + Shift + E` | `Ctrl + Shift + E` | 2x Retina 高清长图并自动复制到剪贴板 |
| **导出单文件 HTML**| `Cmd + Shift + H` | `Ctrl + Shift + H` | 离线便携式自包含独立 HTML 文件 |
| **设置中心** | `Cmd + ,` | `Ctrl + ,` | 主题、排版模式（自适应/标准/全宽）、字体大小调节 |

---

## 版本与商业化边界

QvReader 秉承透明、本地优先的商业化模式：

- **社区版（Community Edition，永久免费）**：
  - 核心阅读功能 100% 永久免费，无任何弹窗广告。
  - `F2` 就地编辑功能 100% 永久免费，无任何额度限制。
  - `F3` 分屏实时预览与高级功能内置 300 次开箱试用体验。
  - **额度用尽后绝不锁死**：用户切换至 F3 分屏模式仍可继续无障碍使用（仅在打开/切换新文件时弹出温和的 Pro 购买提示），**文件的保存与编辑能力永不拦截**。
- **专业版（Pro Edition，$9.99 永久买断制）**：
  - 一次性付费买断，终身免费升级，无任何循环订阅。
  - 单许可支持 **3+ 台个人设备**（支持 macOS 与 Windows 混合激活）。
  - **100% 本地离线激活**，彻底免除一切 Pro 功能购买提示。
  - 官方支持 14 天退款保障，详情可访问 [qvreader.com](https://qvreader.com)。

---

## 深入文档与社区治理

- [系统架构与模块设计](docs/architecture.md)
- [功能特性深入详解](docs/zh-CN/features.md)
- [日常使用与快捷键手册](docs/zh-CN/usage.md)
- [项目路线图与规划](docs/zh-CN/roadmap.md)
- [本地源码编译与开发指引](docs/zh-CN/development.md)
- [贡献者指南](CONTRIBUTING.md)
- [新手首次贡献指引](docs/contributing/first-contribution.md)
- [社区行为准则](CODE_OF_CONDUCT.md)
- [安全报告策略](SECURITY.md)
- [项目治理结构](GOVERNANCE.md)
- [支持与帮助策略](SUPPORT.md)
- [版本发布流程](docs/zh-CN/release-process.md)
- [版本更新日志](CHANGELOG.md)

---

## 许可证与商标政策

- **源码许可证**：本项目遵循 [Apache License 2.0](LICENSE) 许可协议分发。详见 [NOTICE](NOTICE) 与 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
- **商标与品牌**：“QvReader” 名称、品牌标识及官方签名发布包受独立商标政策保护，详见 [TRADEMARKS.md](TRADEMARKS.md)。
