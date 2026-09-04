# 릴리스 프로세스

설치 파일이 어떻게 빌드되어 이 리포지토리의 **GitHub Releases**에 올라오는지.

## 아키텍처 (2개 리포지토리)

| 리포지토리 | 공개 여부 | 역할 |
|---|---|---|
| **비공개 개발 리포지토리**(`qvcloud/markdown-viewer`) | 비공개 | 실제 소스 코드, 프런트엔드, Rust 백엔드, **CI 빌드 워크플로**(`build-desktop.yml`)를 보관. 바이너리를 빌드할 수 있는 곳은 여기뿐 — 소스가 있는 곳이기 때문. |
| **이 리포지토리**(`qvcloud/QvReader`) | 공개 | **커뮤니티 + 릴리스 홈.** README, 문서, LICENSE, 변경 로그, Releases에서 공개되는 다운로드 가능한 설치 파일. |

왜 2개 리포지토리인가? 데스크톱 앱 빌드에는 소스와 빌드 도구 체인이 필요합니다. 공개 리포지토리는
커뮤니티의 얼굴이 되기 위한 것 — 그러나 코드는 아직 오픈되지 않았습니다. 그래서 빌드는 비공개
리포지토리에서 이루어지고, 완성된 설치 파일은 공개 리포지토리의 Releases로 푸시됩니다.

## 릴리스가 이루어지는 방식

1. 관리자가 **비공개 개발 리포지토리**에 버전 tag `v*`를 푸시합니다.
2. `build-desktop.yml`이 3개의 병렬 job(macOS universal / Windows / Linux)을 실행하고 설치 파일을 빌드합니다.
3. 마지막 `create-release` job이 모든 산출물을 다운로드해 `softprops/action-gh-release`를 통해
   **`qvcloud/QvReader`**에 GitHub Release로 게시합니다.
   - 비공개 리포지토리에 GitHub Actions secret `QVREADER_RELEASE_TOKEN`이 필요합니다 —
     `qvcloud/QvReader`에 대한 **Contents: read/write** 권한의 fine-grained PAT.
   - 해당 secret이 없으면 릴리스는 비공개 리포지토리로 폴백합니다(워크플로가 하드 실패하지 않도록).

## 이 커뮤니티 콘텐츠 게시

이 리포지토리의 파일은 `qvcloud/QvReader`로 직접 푸시됩니다:

```bash
./scripts/publish.sh
```

이 스크립트는 이 디렉터리를 자체 git 리포지토리로 초기화하고(remote =
`git@github.com:qvcloud/QvReader.git`), 커밋한 뒤 `main`으로 푸시합니다.

## 버전 관리

- [SemVer](https://semver.org/)를 따릅니다.
- tag 이름은 `v<주>.<부>.<수정>`(예: `v1.0.1`).
- tag를 만들기 전에 `CHANGELOG.md`를 업데이트합니다.

## 릴리스 체크리스트

- [ ] `CHANGELOG.md`를 업데이트했다.
- [ ] 앱 매니페스트에서 버전을 올렸다.
- [ ] tag `v*`를 비공개 개발 리포지토리에 푸시했다.
- [ ] `qvcloud/QvReader`의 공개 Release에 3개 플랫폼 설치 파일이 모두 포함됐는지 확인했다.
- [ ] README의 다운로드 링크가 새 tag를 가리키는지 스팟 체크했다.
