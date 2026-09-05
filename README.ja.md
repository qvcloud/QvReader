<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**macOS と Windows 向けの超軽量・即時 Markdown リーダー & エディター**

`.md` ファイルを開けば、ウェブページのようにミリ秒で読み始められます。クリーンで、
邪魔のない、ドキュメント中心の体験。`F2` でその場編集、`F3` でライブな分割ビュー。完了したら `Esc` で終了。

</div>

**言語:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Português (Brasil)](README.pt-BR.md) · [Español](README.es.md)

---

## QvReader を選ぶ理由

多くの Markdown ツールは「大量に書くこと」を解決します。QvReader が解決するのは**ローカルの
ドキュメントを素早く読んで軽く編集すること**——README、AI 生成ドキュメント、会議メモ、リリースノート。

- **即座に開く。** ファイルをダブルクリックすれば読めます。プロジェクトも、ボールトも、ワークベンチも不要。
- **超軽量。** ネイティブな Tauri アプリ——ブラウザエンジンを同梱しません。インストーラーは数 MB。
- **邪魔のない読書。** すっきりしたタイポグラフィ。ページを覆うツールバーはありません。読書がデフォルト状態。
- **ローカル優先。** ファイルは常にディスク上に残ります。アカウントもクラウドも、コンテンツのテレメトリーも不要。
- **必要なときに編集。** 読書モードがソースを壊すことはありません。編集は明示的で、常に元のバイトを尊重します。

---

## 機能

### 読書（デフォルト）

| 機能 | 詳細 |
|---|---|
| 即時オープン | `.md` をダブルクリック → 読書ビュー |
| GFM レンダリング | 見出し、テーブル、タスクリスト、取り消し線、引用 |
| シンタックスハイライト | highlight.js、フェンス言語の自動検出 |
| 数式（KaTeX） | インライン & ブロック LaTeX |
| ローカル画像 | 相対パスはドキュメントのディレクトリ基準で解決 |
| TOC アウトライン | 見出しで長文をナビゲート、現在のセクションを強調 |
| テーマ | ライト / ダーク / システム連動 + プリセット |
| 文字サイズ | 本文サイズとズームを調整可能 |
| ファイル監視 | 外部編集を検出し、上書き前に警告 |

### 編集と作成

| モード | ショートカット | ルールと動作 |
|---|---|---|
| **インライン編集** | `F2` | **基本コア機能・永久無料**。CodeMirror 6 で読書キャンバス上から直接編集 |
| **分割ビュー** | `F3` | 左にソース、右にリアルタイム同期プレビュー。**毎日 20 回無料**、超過時ソフト案内で制限なし |
| **読書モード** | `Esc` | クリーンな読書に戻る；未変更時はウィンドウを高速で閉じます |

- `Cmd/Ctrl+S` で保存。**改行（LF/CRLF）とエンコーディング（UTF-8/BOM）を忠実に保持**。
- 未保存の変更は厳格に保護されます——閉じる・終了・外部変更で静かにデータを失うことはありません。
- 分割ビューはカーソル行をプレビュー側で揃えてハイライト。
- すべてのビューが 1 つのドキュメント状態とアンドゥ履歴を共有。

### エクスポートと共有

- **標準印刷**（`Cmd/Ctrl+P`）：システム標準の印刷ダイアログ。インクと用紙に最適化されたレイアウト。永久無料。
- **PDF エクスポート**（`Cmd/Ctrl+Shift+P`）：ガイド付きの直接 PDF 出力フロー。
- **長画像 PNG エクスポート**（`Cmd/Ctrl+Shift+E`）：2x Retina 高解像度スナップショット。自動保存＆クリップボードコピー。
- **スタンドアロン HTML エクスポート**（`Cmd/Ctrl+Shift+H`）：オフラインスタイルとレンダリングエンジンを内蔵した単一ファイル配布。
- *（高度なエクスポートとワークスペース管理には 300 回の無料体験が含まれます。Pro 版は永久無制限）*

### ワークスペースとプロジェクト管理

- `Cmd/Ctrl+Shift+W` または上部ドロワーボタンで**ワークスペースファイルツリー**を展開。
- ターミナルで `qvreader .` を実行すると、現在のフォルダをワークスペースとして即座に開きます。

---

## インストール

**[GitHub Releases](https://github.com/qvcloud/QvReader/releases)** ページから、お使いのプラットフォームの
最新インストーラーをダウンロードしてください。

| プラットフォーム | ファイル |
|---|---|
| macOS（Apple Silicon & Intel） | `QvReader_<ver>_universal.dmg` |
| Windows（x64） | `QvReader_<ver>_x64-setup.exe` / `.msi` |
| Linux（Debian / AppImage） | `QvReader_<ver>_amd64.deb` / `.AppImage` |

> このページが置かれているリポジトリは**コミュニティ & リリースのホーム**です。ソースコードは
> プライベートで開発され、**Releases** で公開されるインストーラーにミラーされます。

### `qvreader` CLI を登録（任意）

```bash
# macOS: ラッパーをインストール済みアプリに紐づける
qvreader README.md        # ファイルを開く
qvreader .                # 現在のフォルダをワークスペースとして開く
```

---

## クイックスタート

```bash
# 特定のファイルを開く
qvreader path/to/file.md

# フォルダをワークスペースとして開く
qvreader .

# .md ファイルをダブルクリック
# すぐに読める——即座に
```

**読書** → スクロール、リンクを辿る、テキストを選択。
**編集** → `F3`（分割）または `F2`（インライン）を押し、編集後に `Cmd/Ctrl+S` で保存、`Esc` で戻る。
**ナビゲーション** → アウトライン / ワークスペースサイドバーを切り替え。

---

## ドキュメント

- [使い方とショートカット](docs/ja/usage.md)
- [機能](docs/ja/features.md)
- [開発（ソースからのビルド）](docs/ja/development.md)
- [リリースプロセス](docs/ja/release-process.md)
- [変更履歴](CHANGELOG.md)

---

## プロジェクトの状態

QvReader は活発に開発中です。macOS が主要なデイワンプラットフォームで、Windows は CI 経由で
リリースされます。Linux はコアの安定性とテスト体制が整った後に評価します。

計画中および明示的にスコープ外の内容は [docs/ja/roadmap.md](docs/ja/roadmap.md) をご覧ください。

---

## ライセンス

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
