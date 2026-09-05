<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**适用于 macOS 与 Windows 的超轻量、即时 Markdown 阅读器与编辑器**

打开一个 `.md` 文件，像浏览网页一样阅读——毫秒级响应。干净、无干扰、以文档为先。
按 `F2` 就地编辑，按 `F3` 进入实时分屏预览。完成后按 `Esc` 即可离开。

</div>

**语言：** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Português (Brasil)](README.pt-BR.md) · [Español](README.es.md)

---

## 为什么选择 QvReader？

多数 Markdown 工具解决的是"大量写作"。QvReader 解决的是**快速阅读与轻量编辑本地文档**——
README、AI 生成的文档、会议纪要、发布说明。

- **秒开。** 双击文件即可阅读。没有项目、没有资料库、没有工作台。
- **体积极小。** 原生 Tauri 应用——不打包浏览器引擎，安装包仅几 MB。
- **无干扰阅读。** 干净的排版，没有挤占页面的工具栏。阅读是默认状态。
- **本地优先。** 文件始终留在你的磁盘上。无需账号、无云端、不采集你的内容。
- **需要时才编辑。** 阅读永远不会破坏你的源文件。编辑是显式操作，始终尊重你的原始字节。

---

## 功能特性

### 阅读（默认）

| 能力 | 说明 |
|---|---|
| 即时打开 | 双击 `.md` → 阅读视图 |
| GFM 渲染 | 标题、表格、任务列表、删除线、引用 |
| 代码高亮 | highlight.js，自动识别围栏语言 |
| 数学公式（KaTeX） | 行内与块级 LaTeX |
| 本地图片 | 相对路径基于文档所在目录解析 |
| 目录大纲 | 按标题导航长文档；高亮当前章节 |
| 主题 | 浅色 / 深色 / 跟随系统 + 预设 |
| 智能屏宽适配 | 响应式流式布局（896px~1280px），告别两侧过宽留白，支持自适应/标准/全宽 3 种排版模式 |
| 字号 | 可调节正文字号与缩放 |
| 文件监听 | 检测外部修改，覆盖前提醒 |

### 编辑与创作

| 模式 | 快捷键 | 规则与作用 |
|---|---|---|
| **就地编辑** | `F2` | **基础核心功能，永久免费**。基于 CodeMirror 6 在阅读画布原位编辑，免除界面跳转 |
| **分屏视图** | `F3` | 左侧源码、右侧毫秒级实时预览。**每天 20 次免费**，超额后弹窗提醒不限制使用 |
| **阅读模式** | `Esc` | 无缝回到干净阅读模式；未修改时按 `Esc` 快速关闭窗口 |

- `Cmd/Ctrl+S` 保存，**保留换行（LF/CRLF）与编码（UTF-8/BOM）** 的一致性。
- 未保存的修改受到严格保护——关闭、退出或外部变更时不会静默丢失数据。
- 分屏视图保持光标行在预览端高亮对齐。
- 所有视图共享同一文档状态与撤销历史。

### 导出与分享

- **标准打印**（`Cmd/Ctrl+P`）：系统原生打印对话框，墨水友好的排版样式，永久免费。
- **导出为 PDF**（`Cmd/Ctrl+Shift+P`）：带格式引导的直接 PDF 输出。
- **导出为长图 PNG**（`Cmd/Ctrl+Shift+E`）：2x Retina 高清全文档渲染截图，自动下载并同步复制到剪贴板。
- **导出为独立 HTML**（`Cmd/Ctrl+Shift+H`）：单文件独立便携分发，离线嵌入样式与渲染引擎。
- *（高级导出与工作区管理内置 300 次免费试用配额，Pro 版永久无限制）*

### 工作区与多文档管理

- 快捷键 `Cmd/Ctrl+Shift+W` 或点击顶部抽屉按钮展开**文件夹工作区**，带直观文件树侧栏。
- 在终端执行 `qvreader .` 可一键将当前文件夹作为工作区载入。

---

## 安装

从 **[GitHub Releases](https://github.com/qvcloud/QvReader/releases)** 页面下载对应平台的安装包。

| 平台 | 文件 |
|---|---|
| macOS（Apple Silicon 与 Intel） | `QvReader_<ver>_universal.dmg` |
| Windows（x64） | `QvReader_<ver>_x64-setup.exe` / `.msi` |
| Linux（Debian / AppImage） | `QvReader_<ver>_amd64.deb` / `.AppImage` |

> 本页面所在的仓库是**社区与发布主页**。源代码在私有仓库开发，最终镜像为 **Releases** 下的安装包。

### 注册 `qvreader` CLI（可选）

```bash
# macOS：让包装脚本指向已安装的应用
qvreader README.md        # 打开文件
qvreader .                # 将当前文件夹作为工作区打开
```

---

## 快速上手

```bash
# 打开指定文件
qvreader path/to/file.md

# 将文件夹作为工作区打开
qvreader .

# 双击任意 .md 文件
# 立即进入阅读
```

**阅读** → 滚动、点击链接、选中文本。
**编辑** → 按 `F3`（分屏）或 `F2`（就地），修改后用 `Cmd/Ctrl+S` 保存，按 `Esc` 返回。
**导航** → 切换大纲 / 工作区侧栏。

---

## 文档

- [用法与快捷键](docs/zh-CN/usage.md)
- [功能特性](docs/zh-CN/features.md)
- [开发（从源码构建）](docs/zh-CN/development.md)
- [发布流程](docs/zh-CN/release-process.md)
- [更新日志](CHANGELOG.md)

---

## 项目状态

QvReader 正在积极开发。macOS 是主要、day-one 平台；Windows 经 CI 发布。
Linux 待核心稳定性与测试能力就绪后评估。

参见 [docs/zh-CN/roadmap.md](docs/zh-CN/roadmap.md) 了解规划中与明确排除的功能。

---

## 许可证

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
