<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**macOS 및 Windows를 위한 초경량 인스턴트 Markdown 뷰어 & 편집기**

`.md` 파일을 열고 웹 페이지처럼 편안하게 읽으세요 — 50ms 미만 콜드 스타트, 즉각적인 응답. 산만함 없는 깔끔한 문서 중심 환경.  
`F2`로 인라인 편집, `F3`로 실시간 분할 미리보기. 작성이 끝나면 `Esc`로 즉시 닫기.

[![Version](https://img.shields.io/badge/Desktop-v0.1.4-blue.svg)](https://github.com/qvcloud/QvReader/releases/tag/v0.1.4)
[![Website](https://img.shields.io/badge/Website-v1.0.8-emerald.svg)](https://qvreader.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](#다운로드-및-미러)

</div>

**언어 선택:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md)

---

## 왜 QvReader인가요?

대다수 마크다운 편집기는 무거운 글쓰기나 복잡한 지식 베이스 구축에 치중되어 있습니다. QvReader는 **로컬 Markdown 문서를 번개처럼 읽고 가볍게 수정**하기 위해 만들어졌습니다 — 프로젝트 README, AI가 생성한 코드 문서, 기술 명세서, 회의록 및 릴리스 노트.

- ⚡ **네이티브 극한의 성능**: Rust와 Tauri로 제작되어 설치 용량이 약 5MB, JS 진입 번들이 614KB, 콜드 시작이 50ms 미만입니다. 50,000행 이상의 긴 문서도 60 FPS 부드러운 스크롤로 가볍게 렌더링합니다.
- 📐 **화면 맞춤형 유동 레이아웃**: 와이드 모니터의 과도한 좌우 여백을 줄여주는 동적 폭 관리(896px~1280px). ‘적응형(adaptive) / 표준(standard) / 전체 폭(full)’ 3가지 레이아웃 모드 지원.
- 📊 **Mermaid 다이어그램 전체화면 확대 모달**: 플로우차트, 시퀀스 다이어그램, 아키텍처 다이어그램을 네이티브로 렌더링하며 더블 클릭 시 드래그 및 확대/축소가 가능한 인터랙티브 모달 지원.
- 📤 **4가지 전방위 내보내기 파이프라인**: 잉크 친화적인 인쇄(`Cmd/Ctrl+P`), 고품질 벡터 PDF(`Cmd/Ctrl+Shift+P`), 클립보드 자동 복사가 포함된 2x Retina PNG(`Cmd/Ctrl+Shift+E`), 완전 독립형 오프라인 단일 HTML(`Cmd/Ctrl+Shift+H`).
- 🔒 **로컬 우선 & 완벽한 프라이버시**: 문서는 사용자의 로컬 디스크에만 저장됩니다. 인터넷 연결 불필요, 원격 분석 데이터 수집 없음, 계정 가입 강제 없음.
- ⌨️ **미니멀 핵심 인터랙션 계약**: `.md` 더블 클릭 시 즉각 읽기 모드 진입, `Esc`로 닫기, `F2`로 인라인 편집, `F3`로 실시간 분할 미리보기.

---

## 다운로드 및 미러

공식 GitHub Releases 또는 검증된 고속 CDN 미러를 통해 v0.1.4 패키지를 다운로드할 수 있습니다:

| 플랫폼 | 패키지 파일 | 공식 GitHub 직통 | 고속 미러 1 (ghfast) | 고속 미러 2 (gh-proxy) |
|---|---|---|---|---|
| **macOS** (Apple Silicon) | `QvReader-0.1.4-arm64.dmg` | [다운로드](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [고속 다운로드](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [대체 다운로드](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) |
| **macOS** (Intel x64) | `QvReader-0.1.4-x64.dmg` | [다운로드](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [고속 다운로드](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [대체 다운로드](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) |
| **Windows** (x64 설치 프로그램) | `QvReader-0.1.4-x64-setup.exe` | [다운로드](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [고속 다운로드](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [대체 다운로드](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) |
| **Windows** (x64 포터블) | `QvReader-0.1.4-windows-x64.zip` | [다운로드](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [고속 다운로드](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [대체 다운로드](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) |
| **Linux** (x64 AppImage) | `QvReader-0.1.4-amd64.AppImage` | [다운로드](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [고속 다운로드](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [대체 다운로드](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) |

이전 버전 및 체크섬은 [GitHub Releases 페이지](https://github.com/qvcloud/QvReader/releases)에서 확인하실 수 있습니다.

---

## 설치 및 시스템 보안 신뢰 가이드

QvReader 커뮤니티 배포판은 GitHub Actions CI를 통해 투명하게 빌드되며 체크섬이 공개됩니다. 상용 코드 서명 인증서 발급 심사 기간 중에는 운영체제 보안 도구에 의해 경고창이 나타날 수 있습니다. 아래 안내에 따라 간단히 신뢰하고 실행할 수 있습니다:

### macOS (Apple Gatekeeper)

최초 실행 시 "개발자를 확인할 수 없기 때문에 열 수 없습니다" 또는 "손상되었기 때문에 열 수 없습니다" 경고가 나타나는 경우:

1. **GUI 빠른 실행**:
   - `QvReader.app`을 `/Applications` 폴더로 드래그합니다.
   - `QvReader.app`을 **마우스 우클릭**(또는 Control 키 누른 채 클릭)한 후 **'열기'**를 선택합니다.
   - 시스템 확인 대화상자에서 다시 **'열기'**를 클릭하면 즉시 실행되며, 이후에는 정상 실행됩니다.
2. **터미널 명령어 한 줄 해제 (권장)**:
   ```bash
   xattr -cr /Applications/QvReader.app
   ```

### Windows (Microsoft Defender SmartScreen)

최초 실행 시 파란색 창에 "Windows의 PC 보호" 안내가 나타나는 경우:

1. 대화상자 내의 **'추가 정보'**(More info) 링크를 클릭합니다.
2. 우측 하단에 나타나는 **'실행'**(Run anyway) 버튼을 클릭합니다.

---

## 핵심 단축키 안내

| 기능 / 모드 | 단축키 (macOS) | 단축키 (Windows/Linux) | 설명 |
|---|---|---|---|
| **인라인 편집** | `F2` | `F2` | 읽기 화면에서 제자리 즉시 편집, **영구 100% 무료** |
| **분할 미리보기** | `F3` | `F3` | 좌측 소스 코드, 우측 실시간 동기화 미리보기 |
| **종료 / 닫기** | `Esc` | `Esc` | 편집 모드 종료; 문서 변경사항이 없을 때 즉시 창 닫기 |
| **문서 저장** | `Cmd + S` | `Ctrl + S` | 원본 줄바꿈(LF/CRLF) 및 인코딩(UTF-8) 완전 보존 |
| **시스템 인쇄** | `Cmd + P` | `Ctrl + P` | 잉크 절약 스타일의 네이티브 인쇄 대화상자 |
| **PDF 내보내기** | `Cmd + Shift + P` | `Ctrl + Shift + P` | 고품질 벡터 PDF 생성 |
| **Retina 고화질 이미지** | `Cmd + Shift + E` | `Ctrl + Shift + E` | 2x Retina 고해상도 PNG 생성 및 클립보드 자동 복사 |
| **독립 HTML 내보내기** | `Cmd + Shift + H` | `Ctrl + Shift + H` | 자급형 완전 독립 오프라인 HTML 파일 생성 |
| **설정 센터** | `Cmd + ,` | `Ctrl + ,` | 테마, 레이아웃 모드(적응형/표준/전체), 글꼴 크기 조절 |

---

## 에디션 및 상용화 정책

QvReader는 투명하고 로컬 우선의 정책을 준수합니다:

- **커뮤니티 에디션 (Community Edition, 평생 무료)**:
  - 핵심 문서 읽기 기능은 광고나 시간제한 없이 영구 무료입니다.
  - `F2` 인라인 편집은 사용 제한 없이 영구 무료입니다.
  - `F3` 분할 실시간 미리보기 및 고급 기능은 300회의 체험 사용 횟수가 제공됩니다.
  - **체험 횟수 소진 후에도 절대 잠기지 않음**: 사용자는 F3 모드를 계속 사용할 수 있으며(새 파일을 열 때 완만한 Pro 안내만 표시됨), **문서 편집 및 저장은 절대로 차단되지 않습니다**.
- **프로 에디션 (Pro Edition, $9.99 영구 라이선스)**:
  - 단 한 번의 결제로 평생 무료 업데이트, 정기 구독료 없음.
  - 1개 라이선스로 **3대 이상의 개인 디바이스**(macOS 및 Windows 혼합 지원) 인증.
  - **100% 로컬 오프라인 인증**, 모든 Pro 알림 완전 제거.
  - [qvreader.com](https://qvreader.com)에서 14일 환불 보장 지원.

---

## 상세 문서

- [상세 기능 가이드](docs/ko/features.md)
- [사용 가이드 및 단축키](docs/ko/usage.md)
- [로드맵 및 개발 계획](docs/ko/roadmap.md)
- [소스 빌드 및 개발 가이드](docs/ko/development.md)
- [릴리스 프로세스](docs/ko/release-process.md)
- [변경 내역](CHANGELOG.md)

---

## 라이선스

본 프로젝트는 [Apache License 2.0](LICENSE)에 따라 배포됩니다.
