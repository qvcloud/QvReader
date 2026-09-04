# 发布流程

安装包如何构建，并落地到本仓库的 **GitHub Releases**。

## 架构（双仓库）

| 仓库 | 可见性 | 角色 |
|---|---|---|
| **私有开发仓库**（`qvcloud/markdown-viewer`） | 私有 | 存放实际源码、前端、Rust 后端，以及 **CI 构建工作流**（`build-desktop.yml`）。二进制只能在此构建——因为源码在此。 |
| **本仓库**（`qvcloud/QvReader`） | 公开 | **社区 + 发布主页。** README、文档、LICENSE、更新日志，以及发布在 Releases 下的可下载安装包。 |

为什么两个仓库？构建桌面应用需要源码与构建工具链。公开仓库作为社区门面——但代码尚未开源。
因此构建在私有仓库进行，完成的安装包被推送到公开仓库的 Releases。

## 一次发布如何发生

1. 维护者向**私有开发仓库**推送版本 tag `v*`。
2. `build-desktop.yml` 并行运行三个 job（macOS universal / Windows / Linux）并构建安装包。
3. 最后的 `create-release` job 下载所有产物，经 `softprops/action-gh-release`
   在 **`qvcloud/QvReader`** 上发布为 GitHub Release。
   - 需要私有仓库上的 GitHub Actions secret `QVREADER_RELEASE_TOKEN`——一个
     对 `qvcloud/QvReader` 具有 **Contents: read/write** 权限的细粒度 PAT。
   - 若该 secret 未配置，发布回退到私有仓库（因此工作流绝不会硬失败）。

## 发布本社区内容

本仓库的文件直接推送到 `qvcloud/QvReader`：

```bash
./scripts/publish.sh
```

该脚本将本目录初始化为独立的 git 仓库（remote =
`git@github.com:qvcloud/QvReader.git`），提交并推送到 `main`。

## 版本号

- 遵循 [SemVer](https://semver.org/)。
- tag 命名为 `v<主>.<次>.<修订>`（例如 `v1.0.1`）。
- 打 tag 前更新 `CHANGELOG.md`。

## 发布检查清单

- [ ] 已更新 `CHANGELOG.md`。
- [ ] 已在应用清单中升级版本号。
- [ ] 已将 tag `v*` 推送到私有开发仓库。
- [ ] 已确认 `qvcloud/QvReader` 上的公开 Release 携带全部三个平台安装包。
- [ ] 抽查 README 中的下载链接指向新 tag。
