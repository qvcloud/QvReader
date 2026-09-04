<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**macOS 및 Windows용 초경량, 즉시 Markdown 리더 & 에디터**

`.md` 파일을 열면 웹페이지처럼 밀리초 만에 읽기 시작합니다. 깔끔하고, 방해 요소 없는,
문서 중심의 경험. `F2`를 눌러 그 자리에서 편집하고, `F3`로 라이브 분할 보기를 사용하세요.
완료되면 `Esc`를 눌러 종료합니다.

</div>

**언어:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Português (Brasil)](README.pt-BR.md) · [Español](README.es.md)

---

## QvReader를 선택하는 이유

대부분의 Markdown 도구는 "많이 쓰기"를 해결합니다. QvReader는 **로컬 문서를 빠르게 읽고 가볍게
편집하기**를 해결합니다 — README, AI 생성 문서, 회의록, 릴리스 노트.

- **즉시 열림.** 파일을 더블클릭하면 읽을 수 있습니다. 프로젝트도, 볼트도, 워크벤치도 없습니다.
- **초경량.** 네이티브 Tauri 앱 — 브라우저 엔진을 내장하지 않습니다. 설치 파일이 수 MB에 불과합니다.
- **방해 없는 읽기.** 깔끔한 타이포그래피, 페이지를 가리는 도구 모음이 없습니다. 읽기가 기본 상태입니다.
- **로컬 우선.** 파일은 항상 디스크에 남습니다. 계정도, 클라우드도, 콘텐츠 원격 측정도 없습니다.
- **필요할 때만 편집.** 읽기 모드가 소스를 망치지 않습니다. 편집은 명시적이며 항상 원본 바이트를 존중합니다.

---

## 기능

### 읽기 (기본)

| 기능 | 설명 |
|---|---|
| 즉시 열기 | `.md` 더블클릭 → 읽기 보기 |
| GFM 렌더링 | 제목, 표, 작업 목록, 취소선, 인용 |
| 코드 구문 강조 | highlight.js, fence 언어 자동 감지 |
| 수식 (KaTeX) | 인라인 & 블록 LaTeX |
| 로컬 이미지 | 상대 경로는 문서 디렉터리 기준으로 해석 |
| TOC 개요 | 제목으로 긴 문서 탐색, 현재 섹션 강조 |
| 테마 | 라이트 / 다크 / 시스템 연동 + 프리셋 |
| 글자 크기 | 본문 크기 및 확대/축소 조절 가능 |
| 파일 감시 | 외부 수정 감지, 덮어쓰기 전 경고 |

### 편집

| 모드 | 단축키 | 동작 |
|---|---|---|
| **분할 보기** | `F3` | 왼쪽 Markdown 소스, 오른쪽 라이브 동기화 미리보기 |
| **인라인 편집** | `F2` | 읽기 캔버스에서 그 자리 편집 |
| **읽기 모드** | `Esc` | 깨끗한 읽기로 복귀, 또는 깨끗하면 종료 |

- `Cmd/Ctrl+S` 저장. **줄 바꿈(LF/CRLF) 및 인코딩(UTF-8/BOM) 충실도 유지**.
- 저장하지 않은 변경은 보호됩니다 — 닫기·종료·외부 변경 시 데이터를 조용히 잃지 않습니다.
- 분할 보기는 커서 줄을 미리보기 쪽에서 정렬하고 강조합니다.
- 모든 보기가 하나의 문서 상태와 실행 취소 기록을 공유합니다.

### 워크스페이스

- 터미널에서 `qvreader .`를 실행하면 **폴더를 워크스페이스**로 열고 파일 트리 사이드바를 표시합니다.
- CLI를 한 번 등록하면 어디서든 파일이나 프로젝트를 열 수 있습니다.

---

## 설치

**[GitHub Releases](https://github.com/qvcloud/QvReader/releases)** 페이지에서 플랫폼에 맞는
최신 설치 파일을 다운로드하세요.

| 플랫폼 | 파일 |
|---|---|
| macOS (Apple Silicon & Intel) | `QvReader_<ver>_universal.dmg` |
| Windows (x64) | `QvReader_<ver>_x64-setup.exe` / `.msi` |
| Linux (Debian / AppImage) | `QvReader_<ver>_amd64.deb` / `.AppImage` |

> 이 페이지가 있는 리포지토리는 **커뮤니티 및 릴리스 홈**입니다. 소스 코드는 비공개로 개발되며,
> **Releases**에서 공개되는 설치 파일로 미러링됩니다.

### `qvreader` CLI 등록 (선택)

```bash
# macOS: 래퍼를 설치된 앱에 연결
qvreader README.md        # 파일 열기
qvreader .                # 현재 폴더를 워크스페이스로 열기
```

---

## 빠른 시작

```bash
# 특정 파일 열기
qvreader path/to/file.md

# 폴더를 워크스페이스로 열기
qvreader .

# 아무 .md 파일 더블클릭
# 즉시 열립니다 — 바로 읽기
```

**읽기** → 스크롤, 링크 이동, 텍스트 선택.
**편집** → `F3`(분할) 또는 `F2`(인라인)를 누르고, 수정 후 `Cmd/Ctrl+S`로 저장, `Esc`로 복귀.
**탐색** → 개요 / 워크스페이스 사이드바 전환.

---

## 문서

- [사용법 및 단축키](docs/ko/usage.md)
- [기능](docs/ko/features.md)
- [개발 (소스에서 빌드)](docs/ko/development.md)
- [릴리스 프로세스](docs/ko/release-process.md)
- [변경 로그](CHANGELOG.md)

---

## 프로젝트 상태

QvReader는 활발히 개발 중입니다. macOS가 주요 1차 플랫폼이고, Windows는 CI를 통해 출시됩니다.
Linux는 핵심 안정성과 테스트 역량이 갖춰진 후 평가합니다.

계획 및 명시적으로 제외된 내용은 [docs/ko/roadmap.md](docs/ko/roadmap.md)를 참조하세요.

---

## 라이선스

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
