<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**macOS・Windows 向けの超軽量・即時起動 Markdown リーダー＆エディター**

`.md` ファイルを開けば、Web ページのように快適に読める——ミリ秒単位のコールド起動、超高速レスポンス。クリーンで邪魔のない、文書に集中できる設計。  
`F2` でその場でインライン編集、`F3` でリアルタイム分割プレビュー。読み終わったら `Esc` ですぐに終了。

[![Version](https://img.shields.io/badge/Desktop-v0.1.4-blue.svg)](https://github.com/qvcloud/QvReader/releases/tag/v0.1.4)
[![Website](https://img.shields.io/badge/Website-v1.0.8-emerald.svg)](https://qvreader.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](#ダウンロードとミラー)

</div>

**言語切り替え：** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md)

---

## なぜ QvReader なのか？

多くの Markdown ツールは「重厚な執筆」や「複雑なナレッジベース構築」を目的としています。QvReader は**ローカル Markdown ドキュメントの高速閲覧と軽快な編集**のために設計されています——README、AI 生成ドキュメント、技術仕様書、議事録、リリースノートなど。

- ⚡ **圧倒的なネイティブ性能**：Rust と Tauri で構築され、バイナリサイズは約 5MB、JS エントリバンドルは 614KB、コールド起動は 50ms 未満。50,000 行以上の長大なドキュメントも 60 FPS で滑らかにスクロール。
- 📐 **画面適応型フルードレイアウト**：ワイド画面での過剰な余白を排除する動的幅制御（896px〜1280px）。「適応（adaptive）/ 標準（standard）/ 全幅（full）」の 3 つの表示モードをサポート。
- 📊 **Mermaid 図表の全画面拡大モーダル**：フローチャート、シーケンス図、アーキテクチャ図をネイティブ描画。ダブルクリックでドラッグ・パン・拡大が可能なインタラクティブ全画面モーダルを表示。
- 📤 **4 つの全シーン出力パイプライン**：インクに優しい印刷（`Cmd/Ctrl+P`）、ベクター PDF 出力（`Cmd/Ctrl+Shift+P`）、2x Retina 高解像度 PNG（自動クリップボードコピー、`Cmd/Ctrl+Shift+E`）、完全独立オフライン HTML 出力（`Cmd/Ctrl+Shift+H`）。
- 🔒 **ローカルファースト＆プライバシー**：ファイルは常にユーザーのディスク上に保持されます。インターネット接続不要、テレメトリ収集なし、アカウント登録不要。
- ⌨️ **最小限の直感的インタラクション**：`.md` ダブルクリックで瞬時に閲覧、`Esc` で終了、`F2` でインライン編集、`F3` でリアルタイム分割プレビュー。

---

## ダウンロードと高速ミラー

公式 GitHub Releases または検証済みの高速 CDN ミラーから v0.1.4 をダウンロードできます：

| プラットフォーム | パッケージ | 公式 GitHub 直通 | 高速ミラー 1 (ghfast) | 高速ミラー 2 (gh-proxy) |
|---|---|---|---|---|
| **macOS** (Apple Silicon) | `QvReader-0.1.4-arm64.dmg` | [ダウンロード](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [高速ダウンロード](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [代替ダウンロード](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) |
| **macOS** (Intel x64) | `QvReader-0.1.4-x64.dmg` | [ダウンロード](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [高速ダウンロード](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [代替ダウンロード](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) |
| **Windows** (x64 インストーラー) | `QvReader-0.1.4-x64-setup.exe` | [ダウンロード](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [高速ダウンロード](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [代替ダウンロード](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) |
| **Windows** (x64 ポータブル) | `QvReader-0.1.4-windows-x64.zip` | [ダウンロード](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [高速ダウンロード](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [代替ダウンロード](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) |
| **Linux** (x64 AppImage) | `QvReader-0.1.4-amd64.AppImage` | [ダウンロード](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [高速ダウンロード](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [代替ダウンロード](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) |

過去のバージョンやチェックサムは [GitHub Releases ページ](https://github.com/qvcloud/QvReader/releases) をご確認ください。

---

## インストールとセキュリティ信頼手順

QvReader のコミュニティリリースパッケージは GitHub Actions CI 上で透過的にビルドされ、ハッシュ値が公開されています。商用コード署名証明書の申請期間中、各 OS のセキュリティ機能により警告が表示される場合があります。下記の手順で信頼して実行してください：

### macOS（Apple Gatekeeper）

初回起動時に「開発元を検証できないため開けません」または「壊れているため開けません」と表示された場合：

1. **GUI でのクイック許可**：
   - `QvReader.app` を `/Applications`（アプリケーションフォルダ）にドラッグします。
   - `QvReader.app` を**右クリック**（または Control キーを押しながらクリック）し、**「開く」** を選択します。
   - 確認ダイアログで再度 **「開く」** をクリックすると起動します（次回以降は通常起動できます）。
2. **ターミナルでの一括属性解除（推奨）**：
   ```bash
   xattr -cr /Applications/QvReader.app
   ```

### Windows（Microsoft Defender SmartScreen）

初回起動時に青い警告画面（「Windows によって PC が保護されました」）が表示された場合：

1. 画面内の **「詳細情報」**（More info）をクリックします。
2. 右下に表示される **「実行」**（Run anyway）をクリックします。

---

## 主なショートカット一覧

| 機能 / モード | ショートカット（macOS） | ショートカット（Windows/Linux） | 説明 |
|---|---|---|---|
| **インライン編集** | `F2` | `F2` | 原位置での編集、**永久 100% 無料** |
| **分割プレビュー** | `F3` | `F3` | ソースコードと同期プレビューを左右に並行表示 |
| **終了 / 閉じる** | `Esc` | `Esc` | 編集モード終了；未変更時はウィンドウを閉じる |
| **ドキュメント保存** | `Cmd + S` | `Ctrl + S` | 改行コード（LF/CRLF）と文字コード（UTF-8）を完全保持 |
| **印刷** | `Cmd + P` | `Ctrl + P` | インクに配慮したスタイルのネイティブ印刷 |
| **PDF 出力** | `Cmd + Shift + P` | `Ctrl + Shift + P` | 高品位ベクター PDF 出力 |
| **Retina 長図出力** | `Cmd + Shift + E` | `Ctrl + Shift + E` | 2x Retina 高解像度 PNG（クリップボードに自動同期） |
| **独立 HTML 出力** | `Cmd + Shift + H` | `Ctrl + Shift + H` | 完全自己完結型のオフライン HTML ファイル |
| **設定センター** | `Cmd + ,` | `Ctrl + ,` | テーマ、排版モード（適応/標準/全幅）、フォントサイズ調整 |

---

## エディションと商用モデル

QvReader は透明でローカルファーストなビジネスモデルを採用しています：

- **コミュニティ版（Community Edition、永久無料）**：
  - 中核のドキュメント閲覧機能は完全無料で広告なし。
  - `F2` インライン編集は制限なく永久無料。
  - `F3` 分割リアルタイムプレビュー等の高度機能は 300 回の試用が可能。
  - **試用上限到達後もロックされず継続使用可能**（新規ファイルを開く際に緩やかな Pro 案内が表示されるのみ）、**ファイルの編集および保存は絶対にブロックされません**。
- **Pro 版（$9.99 永久買い切り制）**：
  - 一度の支払いで生涯アップデート付き、サブスクリプション不要。
  - 1 ライセンスで **3 台以上の個人デバイス**（macOS と Windows 混在可能）をサポート。
  - **100% ローカルオフライン認証**、Pro 案内ポップアップを完全非表示。
  - [qvreader.com](https://qvreader.com) にて 14 日間返金保証付き。

---

## ドキュメントとコミュニティ

- [詳細機能ガイド](docs/ja/features.md)
- [使用方法とショートカット](docs/ja/usage.md)
- [ロードマップ](docs/ja/roadmap.md)
- [ソースからのビルド](docs/ja/development.md)
- [貢献者ガイド (英語)](CONTRIBUTING.md)
- [行動規範 (英語)](CODE_OF_CONDUCT.md)
- [セキュリティポリシー (英語)](SECURITY.md)
- [ガバナンス (英語)](GOVERNANCE.md)
- [サポートポリシー (英語)](SUPPORT.md)
- [リリースプロセス](docs/ja/release-process.md)
- [更新履歴](CHANGELOG.md)

---

## ライセンスと商標

- **ソースコード**: [Apache License 2.0](LICENSE) に基づいて配布されています。詳細は [NOTICE](NOTICE) および [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) をご覧ください。
- **商標**: 「QvReader」の名称および公式ロゴ・配布物は [TRADEMARKS.md](TRADEMARKS.md) に規定されています。非公式ビルドは「Community Build」と表示する必要があります。
