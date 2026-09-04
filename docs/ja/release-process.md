# リリースプロセス

インストーラーがどうビルドされ、このリポジトリの **GitHub Releases** に届くか。

## アーキテクチャ（2 リポジトリ）

| リポジトリ | 可視性 | 役割 |
|---|---|---|
| **プライベート開発リポジトリ**（`qvcloud/markdown-viewer`） | プライベート | 実際のソースコード、フロントエンド、Rust バックエンド、**CI ビルドワークフロー**（`build-desktop.yml`）を保持。バイナリをビルドできるのはここだけ——ソースがある場所だからです。 |
| **このリポジトリ**（`qvcloud/QvReader`） | 公開 | **コミュニティ + リリースのホーム。** README、ドキュメント、LICENSE、変更履歴、Releases で公開されるダウンロード可能なインストーラー。 |

なぜ 2 リポジトリか？デスクトップアプリのビルドにはソースとビルドツールチェーンが必要です。
公開リポジトリはコミュニティの顔を意図しています——しかしコードはまだオープンではありません。
そこでビルドはプライベートリポジトリで行われ、完成したインストーラーは公開リポジトリの Releases に
プッシュされます。

## リリースの仕組み

1. メンテナーが**プライベート開発リポジトリ**へバージョン tag `v*` をプッシュします。
2. `build-desktop.yml` が 3 つの並列 job（macOS universal / Windows / Linux）を実行し、インストーラーをビルドします。
3. 最後の `create-release` job が全成果物をダウンロードし、`softprops/action-gh-release` 経由で
   **`qvcloud/QvReader`** に GitHub Release として公開します。
   - プライベートリポジトリに GitHub Actions secret `QVREADER_RELEASE_TOKEN` が必要——`qvcloud/QvReader`
     に対する **Contents: read/write** 権限のファイングレイン PAT。
   - その secret がない場合、リリースはプライベートリポジトリにフォールバックします（ワークフローが
     ハードフェイルすることはありません）。

## このコミュニティコンテンツの公開

このリポジトリのファイルは直接 `qvcloud/QvReader` にプッシュされます：

```bash
./scripts/publish.sh
```

このスクリプトはこのディレクトリを独自の git リポジトリとして初期化し（remote =
`git@github.com:qvcloud/QvReader.git`）、コミットして `main` にプッシュします。

## バージョニング

- [SemVer](https://semver.org/) に従う。
- tag 名は `v<メジャー>.<マイナー>.<パッチ>`（例：`v1.0.1`）。
- tag を打つ前に `CHANGELOG.md` を更新する。

## リリースチェックリスト

- [ ] `CHANGELOG.md` を更新した。
- [ ] アプリマニフェストでバージョンを上げた。
- [ ] tag `v*` をプライベート開発リポジトリにプッシュした。
- [ ] `qvcloud/QvReader` の公開 Release に 3 プラットフォームのインストーラーがすべて含まれることを確認した。
- [ ] README のダウンロードリンクが新しい tag を指していることをスポットチェックした。
