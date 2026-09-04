# 開発（ソースからのビルド）

> 注：**アプリケーションのソースコードはプライベートリポジトリにあります。** この `release`
> リポジトリは**コミュニティ + リリースのホーム**です。ドキュメント・ライセンス・変更履歴を保持し、
> GitHub Releases で公開されるインストーラーを指します。ソースの公開ミラーは後ほど公開されるかもしれません。

## 技術スタック

- **デスクトップフレームワーク：** Tauri v2（Rust コア + システム WebView）
- **フロントエンド：** React 18 + Vite + TypeScript
- **編集：** CodeMirror 6
- **レンダリング：** markdown-it + highlight.js + KaTeX
- **対応プラットフォーム：** macOS（主要）、Windows、Linux（進行中）

## ローカル macOS ビルド（DMG パッケージの前提）

```bash
# 1. Rust と必要な Apple ターゲットをインストール
#    e.g. rustup 経由
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add aarch64-apple-darwin x86_64-apple-darwin   # universal

# 2. JS 依存関係をインストール
cd client
npm install

# 3. 開発モードで実行（サンプルドキュメント付き）
npm run tauri dev -- path/to/sample.md

# 4. リリースアプリ + DMG をビルド
npm run tauri build

# 5. 任意：`qvreader` CLI を登録
make install-cli
```

## 自動化リリースビルド

CI ワークフロー（`build-desktop.yml`）は tag `v*` のプッシュでビルドします：

- **macOS** —— universal（Intel + Apple Silicon）`.dmg`
- **Windows** —— `.msi` + NSIS `.exe`
- **Linux** —— `.deb` + `.AppImage`

成果物は GitHub Release に添付されます。[.github/workflows](../.github/workflows/) を参照。

## プロジェクト構成

```
release/
├── README.md            # コミュニティ向けランディングページ
├── CHANGELOG.md
├── LICENSE              # Apache-2.0
├── docs/                # usage / features / roadmap / development
├── assets/              # ロゴとアプリアイコン
└── scripts/             # 公開ヘルパー
```
