# 개발 (소스에서 빌드)

> 참고: **애플리케이션 소스 코드는 비공개 리포지토리에 있습니다.** 이 `release` 리포지토리는
> **커뮤니티 + 릴리스 홈**입니다: 문서, 라이선스, 변경 로그를 보관하고 GitHub Releases에서 공개되는
> 설치 파일을 가리킵니다. 공개 소스 미러는 나중에 여기에 게시될 수 있습니다.

## 기술 스택

- **데스크톱 프레임워크:** Tauri v2 (Rust 코어 + 시스템 WebView)
- **프런트엔드:** React 18 + Vite + TypeScript
- **편집:** CodeMirror 6
- **렌더링:** markdown-it + highlight.js + KaTeX
- **지원 플랫폼:** macOS (주요), Windows, Linux (진행 중)

## 로컬 macOS 빌드 (DMG 패키징 전제)

```bash
# 1. Rust와 필요한 Apple 타깃 설치
#    예: rustup 통해
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add aarch64-apple-darwin x86_64-apple-darwin   # universal

# 2. JS 의존성 설치
cd client
npm install

# 3. 개발 모드로 실행 (샘플 문서 포함)
npm run tauri dev -- path/to/sample.md

# 4. 릴리스 앱 + DMG 빌드
npm run tauri build

# 5. 선택: `qvreader` CLI 등록
make install-cli
```

## 자동화 릴리스 빌드

CI 워크플로(`build-desktop.yml`)는 tag `v*` 푸시 시 빌드합니다:

- **macOS** — universal (Intel + Apple Silicon) `.dmg`
- **Windows** — `.msi` + NSIS `.exe`
- **Linux** — `.deb` + `.AppImage`

산출물은 GitHub Release에 첨부됩니다.[.github/workflows](../.github/workflows/) 참조.

## 프로젝트 구조

```
release/
├── README.md            # 커뮤니티 대상 랜딩 페이지
├── CHANGELOG.md
├── LICENSE              # Apache-2.0
├── docs/                # usage / features / roadmap / development
├── assets/              # 로고 및 앱 아이콘
└── scripts/             # 게시 도우미
```
