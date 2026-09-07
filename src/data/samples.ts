import { SupportedLocale } from '../i18n';

export const SAMPLE_DOCUMENTS: Record<SupportedLocale, string> = {
  zh: `# 欢迎使用 QvReader 极简 Markdown 阅读与编辑器

欢迎体验 **QvReader** —— 专为极速阅读、无感查看与沉浸式写作打造的原生级轻量 Markdown 工具。启动时间 \`<50ms\`，内存占用极低，真正做到 **双击即开、读完即走、纯粹本地、零隐私追踪**。

> [!TIP]
> **快捷技巧**：在阅读区域任意位置点击鼠标右键，可呼出全功能快捷上下文菜单；双击页面中的 Mermaid 架构图表可开启全屏无损放大缩放检查。

---

## 常用快捷键一览

| 功能操作 | macOS 快捷键 | Windows / Linux | 说明 |
| :--- | :--- | :--- | :--- |
| **纯粹阅读模式** | \`Cmd + 1\` | \`Ctrl + 1\` | 隐藏所有边栏与工具栏，沉浸式阅读 |
| **就地实时编辑** | \`F2\` | \`F2\` | 在当前阅读位置直接原地修改文字 |
| **双栏同步分屏** | \`F3\` | \`F3\` | 左侧源码编辑，右侧同步高亮联动预览 |
| **保存当前文档** | \`Cmd + S\` | \`Ctrl + S\` | 原格式保存，严格保留换行符与文件编码 |
| **展开文档大纲** | \`Cmd + Shift + O\` | \`Ctrl + Shift + O\` | 快速查看文档目录树并平滑跳转各级标题 |
| **基础系统打印** | \`Cmd + P\` | \`Ctrl + P\` | 调起系统打印，分页排版自动优化（永久免费） |
| **导出为 PDF** | \`Cmd + Shift + P\` | \`Ctrl + Shift + P\` | 专业 PDF 导出，完整保留矢量图表与公式排版 |
| **导出高清长图** | \`Cmd + Shift + E\` | \`Ctrl + Shift + E\` | 渲染为 2x Retina PNG 并自动复制到剪贴板 |
| **导出独立 HTML** | \`Cmd + Shift + H\` | \`Ctrl + Shift + H\` | 生成内嵌排版样式的单文件离线网页 |
| **偏好设置中心** | \`Cmd + ,\` | \`Ctrl + ,\` | 主题外观切换、字体缩放、快捷键速查 |
| **极速退出窗口** | \`Esc\` | \`Esc\` | 快速关闭，无未保存变动时无感秒退 |

---

## GFM 任务清单与状态

- [x] **极速冷启动**：<50ms 闪电打开，告别大型重型编辑器漫长加载
- [x] **Markdown 保真性**：绝不篡改源文件的换行符（CRLF/LF）与字符编码（UTF-8/GBK/Shift-JIS）
- [x] **工程级图表支持**：原生集成 Mermaid.js，支持流程图、时序图、类图与状态机
- [x] **LaTeX 数学公式**：KaTeX 引擎亚毫秒级排版，支持复杂行内与块级公式
- [x] **纯本地离线优先**：100% 本地运算，绝无云端上传与后台遥测
- [ ] **试试按 \`F2\` 或 \`F3\`**：开始就地编辑或分屏体验

---

## 架构与工程图表 (Mermaid)

QvReader 原生支持 Mermaid 图表语法。**双击下方任意图表**即可弹出独立的缩放模态框，支持 \`+\` / \`-\` 缩放、重置 100% 与高清检查：

\`\`\`mermaid
flowchart LR
    A[📄 本地 .md 文件] --> B{QvReader 原生内核}
    B -->|极速加载| C[📖 沉浸阅读]
    B -->|F2 就地编辑| D[✏️ 原地快速修正]
    B -->|F3 同步分屏| E[🪟 双栏联动预览]
    C --> F[📤 导出 PDF / 长图 / HTML / 打印]
    D --> G[💾 原文无损保存]
    E --> G
\`\`\`

时序交互流程图示例：

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as 用户
    participant Client as QvReader 客户端
    participant Disk as 本地文件系统

    User->>Client: 双击 markdown 文件
    Client->>Disk: 纯本地读取（零网络请求）
    Disk-->>Client: 返回原始字节流并自适应编码
    Client-->>User: <50ms 极速呈现精美排版
    User->>Client: 按 F2 就地快速修改文案
    User->>Client: Cmd+S 保存
    Client->>Disk: 原子写入，保持编码原貌
\`\`\`

---

## 数学公式排版 (KaTeX)

支持优雅的 LaTeX 数学表达式。

行内公式示例：质能方程 $E = mc^2$，欧拉恒等式 $e^{i\\pi} + 1 = 0$，样本标准差 $\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2}$。

高斯积分与傅里叶变换块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
X_k = \\sum_{n=0}^{N-1} x_n \\cdot e^{-i 2\\pi k n / N}, \\quad k = 0, \\dots, N-1
$$

多元正态分布概率密度函数：

$$
f(\\mathbf{x}) = \\frac{1}{(2\\pi)^{k/2}|\\boldsymbol{\\Sigma}|^{1/2}} \\exp\\left( -\\frac{1}{2}(\\mathbf{x}-\\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x}-\\boldsymbol{\\mu}) \\right)
$$

---

## 代码高亮与多语言展示

代码块支持语法高亮与行号辅助展示：

\`\`\`rust
// Rust 原生极速文件加载核心示例
use std::fs;
use std::path::Path;

pub fn read_markdown_fast(path: &Path) -> Result<String, std::io::Error> {
    // 零冗余开销，保留原生字节流保真性
    fs::read_to_string(path)
}
\`\`\`

\`\`\`typescript
// TypeScript 类型定义
export interface DocumentSession {
  filePath: string;
  isDirty: boolean;
  encoding: 'UTF-8' | 'GBK' | 'Shift-JIS';
  lineEnding: 'LF' | 'CRLF';
}
\`\`\`

---

## 引用与警示框 (Callout Alerts)

> [!NOTE]
> **本地优先原则**：您的所有文档均完整保存在本地设备上。QvReader 绝不会扫描、上传或同步您的文档内容。

> [!IMPORTANT]
> **未保存安全防护**：编辑过程中若存在未保存内容，按 \`Esc\` 或关闭窗口时会弹出保存确认提示，绝不会丢失您的工作成果。

> 纸上得来终觉浅，绝知此事要躬行。  
> 祝您在 **QvReader** 享受流畅而宁静的阅读与写作时光！
`,

  en: `# Welcome to QvReader - Instant Markdown Reader & Editor

Welcome to **QvReader** — the native, distraction-free desktop Markdown viewer & lightweight editor. Launches in \`<50ms\` with minimal memory footprint: **double-click to open, read and dismiss instantly, 100% local-first, zero privacy tracking**.

> [!TIP]
> **Quick Tip**: Right-click anywhere in the reading area to open the full context menu; double-click any Mermaid diagram to inspect it in the full-screen zoom modal.

---

## Essential Shortcuts

| Action | macOS Shortcut | Windows / Linux | Description |
| :--- | :--- | :--- | :--- |
| **Pure Reading Mode** | \`Cmd + 1\` | \`Ctrl + 1\` | Hide all sidebars and chrome for distraction-free reading |
| **In-place Inline Edit** | \`F2\` | \`F2\` | Edit text right where you are reading without losing context |
| **Synchronized Split View** | \`F3\` | \`F3\` | Source code on left, synchronized live preview on right |
| **Save Document** | \`Cmd + S\` | \`Ctrl + S\` | Save file preserving original line endings & encoding |
| **Toggle Document Outline** | \`Cmd + Shift + O\` | \`Ctrl + Shift + O\` | Open table-of-contents drawer and smoothly jump to sections |
| **Standard Print** | \`Cmd + P\` | \`Ctrl + P\` | Open system print dialog with optimized pagination (Free) |
| **Export as PDF** | \`Cmd + Shift + P\` | \`Ctrl + Shift + P\` | Export document to PDF retaining vector diagrams & math |
| **Export as Image** | \`Cmd + Shift + E\` | \`Ctrl + Shift + E\` | Render full document to 2x Retina PNG and copy to clipboard |
| **Export as HTML** | \`Cmd + Shift + H\` | \`Ctrl + Shift + H\` | Export self-contained HTML file with embedded styles |
| **Settings Center** | \`Cmd + ,\` | \`Ctrl + ,\` | Theme switching, font size zoom, and shortcuts cheat sheet |
| **Fast Exit Window** | \`Esc\` | \`Esc\` | Close immediately when there are no unsaved changes |

---

## GFM Checklist & Features

- [x] **Sub-50ms Cold Launch**: Instant start without heavy IDE loading delays
- [x] **Source Fidelity**: Never alters file line endings (CRLF/LF) or encodings (UTF-8/GBK)
- [x] **Engineering Diagrams**: Native Mermaid.js rendering for flowcharts, sequences, and state diagrams
- [x] **LaTeX Math Typesetting**: Sub-millisecond KaTeX engine for inline and block equations
- [x] **100% Local-First**: Offline operation with zero telemetry tracking
- [ ] **Try pressing \`F2\` or \`F3\`**: Experience in-place editing or split view right now

---

## Architecture & Diagrams (Mermaid)

QvReader natively parses and renders Mermaid diagrams. **Double-click any diagram** to open the inspection modal with zoom controls (\`+\`, \`-\`, 100% reset):

\`\`\`mermaid
flowchart LR
    A[📄 Local .md File] --> B{QvReader Native Core}
    B -->|Instant Load| C[📖 Immersive Reading]
    B -->|F2 Inline Edit| D[✏️ Quick In-place Edit]
    B -->|F3 Split View| E[🪟 Synchronized Dual Pane]
    C --> F[📤 Export PDF / PNG / HTML / Print]
    D --> G[💾 Lossless Disk Save]
    E --> G
\`\`\`

Sequence Diagram Example:

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Client as QvReader Client
    participant Disk as Local File System

    User->>Client: Double-click markdown file
    Client->>Disk: Pure local disk read (0 network requests)
    Disk-->>Client: Return raw byte stream & auto-detect encoding
    Client-->>User: <50ms render beautiful reading layout
    User->>Client: Press F2 to quickly edit text
    User->>Client: Cmd+S to save
    Client->>Disk: Atomic write preserving original encoding & line breaks
\`\`\`

---

## Mathematical Equations (KaTeX)

Render beautiful LaTeX mathematical notation with KaTeX.

Inline equation examples: Mass-energy equivalence $E = mc^2$, Euler's identity $e^{i\\pi} + 1 = 0$, and standard deviation $\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2}$.

Gaussian Integral and Discrete Fourier Transform (DFT):

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
X_k = \\sum_{n=0}^{N-1} x_n \\cdot e^{-i 2\\pi k n / N}, \\quad k = 0, \\dots, N-1
$$

Multivariate Normal Distribution:

$$
f(\\mathbf{x}) = \\frac{1}{(2\\pi)^{k/2}|\\boldsymbol{\\Sigma}|^{1/2}} \\exp\\left( -\\frac{1}{2}(\\mathbf{x}-\\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x}-\\boldsymbol{\\mu}) \\right)
$$

---

## Syntax Highlighting & Code Blocks

Fenced code blocks render with syntax coloring and clean typography:

\`\`\`rust
// Rust native instant file reading example
use std::fs;
use std::path::Path;

pub fn read_markdown_fast(path: &Path) -> Result<String, std::io::Error> {
    // Pure native zero-overhead byte reading
    fs::read_to_string(path)
}
\`\`\`

\`\`\`typescript
// TypeScript session model
export interface DocumentSession {
  filePath: string;
  isDirty: boolean;
  encoding: 'UTF-8' | 'GBK' | 'Shift-JIS';
  lineEnding: 'LF' | 'CRLF';
}
\`\`\`

---

## Callout Alerts & Quotes

> [!NOTE]
> **Local-First Principle**: All your documents remain strictly on your local computer. QvReader never uploads, scans, or synchronizes your notes.

> [!IMPORTANT]
> **Unsaved Changes Guard**: If you close the window with unsaved edits, a safe exit dialog will always confirm saving so your work is never lost.

> "Simplicity is prerequisite for reliability."  
> Enjoy distraction-free reading and writing with **QvReader**!
`,

  ja: `# QvReader へようこそ - 超軽量 Markdown リーダー＆エディタ

**QvReader** へようこそ —— 瞬時の閲覧、集中できる読書、そして軽快な編集のために作られたネイティブデスクトップ Markdown ツールです。起動時間 \`<50ms\`、超低メモリ消費、**ダブルクリックですぐ開き、読み終えたら即座に終了、100% ローカル完結、プライバシー追跡ゼロ**を実現します。

> [!TIP]
> **便利な機能**：閲覧領域の任意の場所で右クリックすると、フル機能のコンテキストメニューが表示されます。Mermaid 図をダブルクリックすると拡大縮小モーダルで詳しく確認できます。

---

## 主なショートカット一覧

| 操作 | macOS | Windows / Linux | 説明 |
| :--- | :--- | :--- | :--- |
| **純粋閲覧モード** | \`Cmd + 1\` | \`Ctrl + 1\` | サイドバーを非表示にし、読書に集中 |
| **その場で編集** | \`F2\` | \`F2\` | 読んでいる位置でそのままテキストを修正 |
| **分割同期ビュー** | \`F3\` | \`F3\` | 左側にソース、右側にリアルタイム同期プレビュー |
| **ドキュメント保存** | \`Cmd + S\` | \`Ctrl + S\` | 元の改行コードと文字コードを厳格に保持して保存 |
| **目次アウトライン** | \`Cmd + Shift + O\` | \`Ctrl + Shift + O\` | 見出し一覧を表示し、目的の場所へスムーズにジャンプ |
| **標準印刷** | \`Cmd + P\` | \`Ctrl + P\` | システム印刷ダイアログを開く（永久無料） |
| **PDF として書き出し** | \`Cmd + Shift + P\` | \`Ctrl + Shift + P\` | ベクター図や数式を保持して高品質 PDF 出力 |
| **高解像度画像出力** | \`Cmd + Shift + E\` | \`Ctrl + Shift + E\` | 2x Retina PNG 画像として保存しクリップボードにコピー |
| **HTML として書き出し** | \`Cmd + Shift + H\` | \`Ctrl + Shift + H\` | スタイル内蔵の単一 HTML ファイルを生成 |
| **環境設定センター** | \`Cmd + ,\` | \`Ctrl + ,\` | テーマ切替、フォントサイズ変更、ショートカット一覧 |
| **高速終了** | \`Esc\` | \`Esc\` | 未保存の変更がない場合、即座にウィンドウを閉じる |

---

## GFM タスクリストと特徴

- [x] **50ms 未満の高速起動**：重いローディング画面なしで瞬時に起動
- [x] **Markdown 忠実性**：改行コード（LF/CRLF）や文字コード（UTF-8/Shift-JIS）を破壊しません
- [x] **Mermaid ダイアグラム**：フローチャート、シーケンス図、状態図をネイティブ描画
- [x] **KaTeX 数式表示**：美しく正確なインライン・ブロック数式レンダリング
- [x] **100% ローカルファースト**：外部通信なし、プライバシー追跡ゼロ
- [ ] **\`F2\` または \`F3\` を押してみる**：その場編集や分割プレビューを体験

---

## アーキテクチャと図表 (Mermaid)

QvReader は Mermaid 構文を標準サポートしています。**図をダブルクリック**すると拡大・縮小が可能な専用モーダルが開きます：

\`\`\`mermaid
flowchart LR
    A[📄 ローカル .md ファイル] --> B{QvReader ネイティブコア}
    B -->|瞬時解析| C[📖 快適な閲覧]
    B -->|F2 その場編集| D[✏️ クイック修正]
    B -->|F3 分割ビュー| E[🪟 リアルタイム同期プレビュー]
    C --> F[📤 PDF / 画像 / HTML / 印刷]
    D --> G[💾 ロスレス保存]
    E --> G
\`\`\`

---

## 数式レンダリング (KaTeX)

質量とエネルギーの等価性 $E = mc^2$、オイラーの等式 $e^{i\\pi} + 1 = 0$。

ガウス積分と離散フーリエ変換 (DFT)：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
X_k = \\sum_{n=0}^{N-1} x_n \\cdot e^{-i 2\\pi k n / N}, \\quad k = 0, \\dots, N-1
$$

---

## コードハイライト

\`\`\`rust
// Rust ネイティブファイル読み込み
use std::fs;
use std::path::Path;

pub fn read_markdown_fast(path: &Path) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}
\`\`\`

---

## コールアウトアラート

> [!NOTE]
> **ローカルファーストの原則**：すべてのドキュメントは端末内に安全に保持されます。クラウドへの自動アップロードは一切行われません。

> [!IMPORTANT]
> **未保存変更の保護**：保存されていない変更がある場合、終了時に確認ダイアログが表示され、作業内容の紛失を防ぎます。

**QvReader** で快適な Markdown 読書と執筆の時間をお楽しみください！
`,

  ko: `# QvReader에 오신 것을 환영합니다 - 초경량 마크다운 뷰어 & 편집기

**QvReader**에 오신 것을 환영합니다 —— 빠른 문서 열람과 몰입형 읽기, 가벼운 편집을 위해 설계된 네이티브 데스크톱 마크다운 도구입니다. 실행 시간 \`<50ms\`, 극히 낮은 메모리 사용량으로 **더블 클릭 즉시 열기, 읽고 바로 닫기, 100% 로컬 작동, 개인정보 추적 제로**를 실현합니다.

> [!TIP]
> **빠른 팁**: 본문 영역 아무 곳이나 마우스 우클릭하면 전체 컨텍스트 메뉴가 열립니다. Mermaid 다이어그램을 더블 클릭하면 전체 화면 확대 모달로 자세히 볼 수 있습니다.

---

## 주요 단축키 안내

| 기능 | macOS 단축키 | Windows / Linux | 설명 |
| :--- | :--- | :--- | :--- |
| **순수 읽기 모드** | \`Cmd + 1\` | \`Ctrl + 1\` | 모든 사이드바를 숨기고 방해 없이 읽기에 집중 |
| **제자리 바로 편집** | \`F2\` | \`F2\` | 읽던 위치 그대로 본문 인라인 수정 |
| **동기화 분할 뷰** | \`F3\` | \`F3\` | 좌측 원본 코드, 우측 실시간 동기화 미리보기 |
| **문서 저장** | \`Cmd + S\` | \`Ctrl + S\` | 줄바꿈(CRLF/LF)과 문자 인코딩을 그대로 보존하여 저장 |
| **목차 아웃라인** | \`Cmd + Shift + O\` | \`Ctrl + Shift + O\` | 문서 목차 서랍을 열고 원하는 제목으로 빠르게 이동 |
| **기본 인쇄** | \`Cmd + P\` | \`Ctrl + P\` | 시스템 인쇄 대화상자 실행 (평생 무료) |
| **PDF로 내보내기** | \`Cmd + Shift + P\` | \`Ctrl + Shift + P\` | 벡터 다이어그램과 수식을 완벽히 보존한 고품질 PDF 출력 |
| **고화질 이미지 내보내기** | \`Cmd + Shift + E\` | \`Ctrl + Shift + E\` | 전체 문서를 2x Retina PNG로 캡처하여 클립보드에 복사 |
| **독립 HTML 내보내기** | \`Cmd + Shift + H\` | \`Ctrl + Shift + H\` | 스타일이 내장된 독립 실행형 오프라인 HTML 파일 생성 |
| **환경설정 센터** | \`Cmd + ,\` | \`Ctrl + ,\` | 테마 전환, 폰트 크기 확대/축소, 단축키 가이드 |
| **빠른 창 닫기** | \`Esc\` | \`Esc\` | 저장되지 않은 변경사항이 없으면 즉시 종료 |

---

## GFM 체크리스트 및 주요 기능

- [x] **50ms 미만 초고속 실행**: 무거운 로딩 없이 클릭 즉시 시작
- [x] **마크다운 원본 보존**: 원본 파일의 줄바꿈과 인코딩(UTF-8/EUC-KR)을 훼손하지 않음
- [x] **엔지니어링 다이어그램**: Mermaid.js 기본 내장 (순서도, 시퀀스 다이어그램, 상태 다이어그램)
- [x] **LaTeX 수학 수식**: KaTeX 엔진 기반 고성능 수식 렌더링
- [x] **100% 로컬 우선**: 외부 네트워크 전송 및 개인정보 추적 제로
- [ ] **\`F2\` 또는 \`F3\` 누르기**: 제자리 편집이나 분할 뷰를 지금 바로 체험해 보세요

---

## 아키텍처 및 다이어그램 (Mermaid)

QvReader는 Mermaid 문법을 기본 지원합니다. **다이어그램을 더블 클릭**하면 줌 컨트롤(\`+\`, \`-\`, 100% 리셋)이 제공되는 확대 모달이 열립니다:

\`\`\`mermaid
flowchart LR
    A[📄 로컬 .md 파일] --> B{QvReader 네이티브 코어}
    B -->|초고속 로딩| C[📖 몰입형 읽기]
    B -->|F2 제자리 편집| D[✏️ 빠른 인라인 수정]
    B -->|F3 분할 뷰| E[🪟 실시간 동기화 미리보기]
    C --> F[📤 PDF / 이미지 / HTML / 인쇄]
    D --> G[💾 원본 무손실 저장]
    E --> G
\`\`\`

---

## 수학 수식 (KaTeX)

인라인 수식 예시: 질량-에너지 등가원리 $E = mc^2$, 오일러 공식 $e^{i\\pi} + 1 = 0$.

가우스 적분 및 이산 푸리에 변환 (DFT):

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
X_k = \\sum_{n=0}^{N-1} x_n \\cdot e^{-i 2\\pi k n / N}, \\quad k = 0, \\dots, N-1
$$

---

## 코드 하이라이팅

\`\`\`rust
// Rust 고속 파일 읽기 예제
use std::fs;
use std::path::Path;

pub fn read_markdown_fast(path: &Path) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}
\`\`\`

---

## 알림 상자 (Callout Alerts)

> [!NOTE]
> **로컬 우선 원칙**: 사용자의 모든 문서는 사용자의 기기에만 안전하게 저장됩니다. 외부 클라우드로 업로드되거나 동기화되지 않습니다.

> [!IMPORTANT]
> **미저장 작업 보호**: 저장되지 않은 내용이 있을 때 창을 닫으면 안전 확인창이 열려 작업 손실을 철저히 방지합니다.

**QvReader**와 함께 쾌적하고 조용한 마크다운 읽기와 글쓰기를 즐겨보세요!
`,

  es: `# Bienvenido a QvReader - Lector y Editor Markdown Ultraligero

Bienvenido a **QvReader** —— el visor y editor de Markdown de escritorio nativo, ligero y sin distracciones. Se inicia en \`<50ms\` con un consumo mínimo de memoria: **doble clic para abrir, leer y salir al instante, 100% local, cero rastreo de privacidad**.

> [!TIP]
> **Consejo rápido**: Haz clic derecho en cualquier parte del texto para abrir el menú contextual; haz doble clic en cualquier diagrama Mermaid para inspeccionarlo en pantalla completa con zoom.

---

## Atajos de teclado principales

| Acción | Atajo macOS | Windows / Linux | Descripción |
| :--- | :--- | :--- | :--- |
| **Modo Lectura Pura** | \`Cmd + 1\` | \`Ctrl + 1\` | Oculta barras laterales para leer sin distracciones |
| **Edición en el lugar** | \`F2\` | \`F2\` | Modifica el texto en el mismo lugar sin perder el contexto |
| **Vista dividida sincrónica** | \`F3\` | \`F3\` | Código fuente a la izquierda, vista previa en vivo a la derecha |
| **Guardar documento** | \`Cmd + S\` | \`Ctrl + S\` | Guarda preservando saltos de línea y codificación original |
| **Esquema de contenido** | \`Cmd + Shift + O\` | \`Ctrl + Shift + O\` | Abre el panel de índice para saltar rápidamente a secciones |
| **Imprimir documento** | \`Cmd + P\` | \`Ctrl + P\` | Imprime con paginación optimizada (Gratis para siempre) |
| **Exportar como PDF** | \`Cmd + Shift + P\` | \`Ctrl + Shift + P\` | Exportación profesional conservando diagramas y fórmulas |
| **Exportar como Imagen** | \`Cmd + Shift + E\` | \`Ctrl + Shift + E\` | Renderiza a 2x Retina PNG y copia al portapapeles |
| **Exportar como HTML** | \`Cmd + Shift + H\` | \`Ctrl + Shift + H\` | Genera un archivo HTML independiente con estilos integrados |
| **Preferencias y Ajustes** | \`Cmd + ,\` | \`Ctrl + ,\` | Cambia temas, tamaño de letra y consulta atajos |
| **Cierre instantáneo** | \`Esc\` | \`Esc\` | Cierra la ventana al instante si no hay cambios pendientes |

---

## Lista de tareas GFM y características

- [x] **Inicio rápido en <50ms**: Apertura instantánea sin tiempos de carga pesados
- [x] **Fidelidad Markdown**: Respeta saltos de línea (CRLF/LF) y codificaciones (UTF-8/ISO)
- [x] **Diagramas Mermaid**: Diagramas de flujo, secuencias y estados integrados
- [x] **Fórmulas matemáticas LaTeX**: Motor KaTeX para fórmulas elegantes
- [x] **100% Local y Privado**: Sin servidores remotos ni telemetría oculta
- [ ] **Prueba pulsar \`F2\` o \`F3\`**: Comienza a editar o ver en pantalla dividida

---

## Arquitectura y Diagramas (Mermaid)

QvReader soporta diagramas Mermaid. **Haz doble clic en cualquier diagrama** para abrir el modal de inspección con zoom:

\`\`\`mermaid
flowchart LR
    A[📄 Archivo .md Local] --> B{Núcleo QvReader}
    B -->|Carga Rápida| C[📖 Lectura Inmersiva]
    B -->|F2 Editar| D[✏️ Corrección Rápida]
    B -->|F3 Dividir| E[🪟 Vista Previa Sincrónica]
    C --> F[📤 Exportar PDF / Imagen / HTML / Imprimir]
    D --> G[💾 Guardado sin pérdidas]
    E --> G
\`\`\`

---

## Fórmulas matemáticas (KaTeX)

Equivalencia masa-energía $E = mc^2$, identidad de Euler $e^{i\\pi} + 1 = 0$.

Integral gaussiana y transformada de Fourier (DFT):

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
X_k = \\sum_{n=0}^{N-1} x_n \\cdot e^{-i 2\\pi k n / N}, \\quad k = 0, \\dots, N-1
$$

---

## Resaltado de sintaxis

\`\`\`rust
// Lectura de archivo rápida en Rust
use std::fs;
use std::path::Path;

pub fn read_markdown_fast(path: &Path) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}
\`\`\`

---

## Avisos y citas

> [!NOTE]
> **Privacidad total**: Todos tus documentos permanecen únicamente en tu dispositivo. QvReader jamás sube tus archivos a la nube.

> [!IMPORTANT]
> **Seguridad de edición**: Si cierras la ventana con cambios sin guardar, aparecerá un diálogo de confirmación para proteger tu trabajo.

¡Disfruta de una lectura y escritura fluida con **QvReader**!
`,

  'pt-BR': `# Bem-vindo ao QvReader - Leitor e Editor Markdown Ultraleve

Bem-vindo ao **QvReader** —— o visualizador e editor de Markdown desktop nativo, leve e livre de distrações. Inicialização em \`<50ms\` com consumo mínimo de memória: **clique duplo para abrir, ler e fechar instantaneamente, 100% local, zero rastreamento de privacidade**.

> [!TIP]
> **Dica Rápida**: Clique com o botão direito em qualquer área de leitura para abrir o menu de contexto completo; dê um clique duplo em qualquer diagrama Mermaid para inspecioná-lo em tela cheia com zoom.

---

## Principais Atalhos de Teclado

| Ação | Atalho macOS | Windows / Linux | Descrição |
| :--- | :--- | :--- | :--- |
| **Modo Leitura Pura** | \`Cmd + 1\` | \`Ctrl + 1\` | Oculta barras laterais para leitura sem distrações |
| **Edição no Local** | \`F2\` | \`F2\` | Edita o texto diretamente onde você está lendo |
| **Divisão Sincronizada** | \`F3\` | \`F3\` | Código-fonte à esquerda, pré-visualização ao vivo à direita |
| **Salvar Documento** | \`Cmd + S\` | \`Ctrl + S\` | Salva preservando quebras de linha e codificação original |
| **Sumário / Índice** | \`Cmd + Shift + O\` | \`Ctrl + Shift + O\` | Abre a gaveta de tópicos para navegar rapidamente |
| **Imprimir Documento** | \`Cmd + P\` | \`Ctrl + P\` | Abre diálogo de impressão do sistema (Grátis para sempre) |
| **Exportar como PDF** | \`Cmd + Shift + P\` | \`Ctrl + Shift + P\` | Exportação profissional mantendo diagramas e fórmulas |
| **Exportar como Imagem** | \`Cmd + Shift + E\` | \`Ctrl + Shift + E\` | Renderiza em 2x Retina PNG e copia para a área de transferência |
| **Exportar como HTML** | \`Cmd + Shift + H\` | \`Ctrl + Shift + H\` | Gera arquivo HTML autônomo com estilos embutidos |
| **Centro de Preferências** | \`Cmd + ,\` | \`Ctrl + ,\` | Troca de temas, tamanho de fonte e guia de atalhos |
| **Saída Instantânea** | \`Esc\` | \`Esc\` | Fecha a janela rapidamente se não houver alterações pendentes |

---

## Lista de Verificação GFM e Recursos

- [x] **Inicialização em <50ms**: Abertura instantânea sem telas pesadas de carregamento
- [x] **Fidelidade Markdown**: Preserva quebras de linha (CRLF/LF) e codificações (UTF-8/ISO)
- [x] **Diagramas de Engenharia**: Suporte nativo a Mermaid.js (fluxogramas, sequências e estados)
- [x] **Fórmulas Matemáticas LaTeX**: Motor KaTeX para equações elegantes
- [x] **100% Local e Privado**: Sem servidores externos nem rastreamento oculto
- [ ] **Experimente pressionar \`F2\` ou \`F3\`**: Comece a editar ou ver em tela dividida agora mesmo

---

## Arquitetura e Diagramas (Mermaid)

O QvReader suporta nativamente a sintaxe Mermaid. **Dê um clique duplo em qualquer diagrama** para abrir o modal de inspeção com zoom:

\`\`\`mermaid
flowchart LR
    A[📄 Arquivo .md Local] --> B{Núcleo QvReader}
    B -->|Carga Rápida| C[📖 Leitura Imersiva]
    B -->|F2 Editar| D[✏️ Correção Rápida]
    B -->|F3 Dividir| E[🪟 Prévia Sincronizada]
    C --> F[📤 Exportar PDF / Imagem / HTML / Imprimir]
    D --> G[💾 Salvamento sem perdas]
    E --> G
\`\`\`

---

## Fórmulas Matemáticas (KaTeX)

Equivalência massa-energia $E = mc^2$, identidade de Euler $e^{i\\pi} + 1 = 0$.

Integral gaussiana e transformada discreta de Fourier (DFT):

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
X_k = \\sum_{n=0}^{N-1} x_n \\cdot e^{-i 2\\pi k n / N}, \\quad k = 0, \\dots, N-1
$$

---

## Destaque de Sintaxe

\`\`\`rust
// Leitura rápida nativa em Rust
use std::fs;
use std::path::Path;

pub fn read_markdown_fast(path: &Path) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}
\`\`\`

---

## Avisos e Citações

> [!NOTE]
> **Privacidade Total**: Todos os seus documentos ficam exclusivamente no seu dispositivo. O QvReader nunca envia seus arquivos para a nuvem.

> [!IMPORTANT]
> **Proteção de Edição**: Se você fechar a janela com alterações não salvas, um diálogo de confirmação protegerá seu trabalho.

Aproveite uma leitura e escrita fluida com o **QvReader**!
`
};

export function getSampleDocument(locale: SupportedLocale): string {
  return SAMPLE_DOCUMENTS[locale] || SAMPLE_DOCUMENTS.en;
}
