# 🦐 Claw Config

OpenClaw의 `openclaw.json` 파일을 시각적으로 구성하기 위한 데스크톱 애플리케이션.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![i18n](https://img.shields.io/badge/i18n-4%20languages-blue)](#국제화)

**[English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md)**

## ✨ 기능

### 제공자 관리
- 모델 제공자의 시각적 추가/편집/삭제
- 여러 주류 AI 서비스 제공자 지원
- 프리셋 구성을 통한 빠른 추가
- 실시간 모델 목록 동기화

### Agents 구성
- OpenClaw Agents 기본 동작 구성
- 모델 계층 구성(primary, fast, balanced, powerful)
- 동시성 최적화
- 성능 매개변수 조정

### 구성 관리
- `~/.openclaw/openclaw.json`에 실시간 저장
- 구성 백업 및 복원
- 안전한 API 키 관리

### 국제화 (i18n)
- 4개 언어 지원: 영어, 中文, 日本語, 한국어
- 언어 선택은 브라우저 저장소에 저장됨
- 브라우저 언어 자동 감지

## 🛠️ 기술 스택

- **데스크톱 프레임워크**: Tauri 2.8
- **백엔드**: Rust
- **프론트엔드**: React 18 + TypeScript
- **UI**: TailwindCSS + shadcn/ui 구성요소
- **상태 관리**: TanStack Query v5
- **국제화**: i18next, react-i18next

## 📦 개발

### 전제 조건

- Node.js 18+
- Rust 1.70+
- Tauri CLI 2.8+

### 빠른 시작

1. **종속성 설치**
   ```bash
   cd claw-config
   npm install
   ```

2. **개발 모드**
   ```bash
   npm run tauri dev
   ```
   또는 `../dev-switch.bat` 더블 클릭

3. **애플리케이션 빌드**
   ```bash
   npm run tauri build
   ```
   또는 `../build-switch.bat` 더블 클릭

## 📁 프로젝트 구조

```
claw-config/
├── src/                      # React 프론트엔드
│   ├── components/           # UI 구성요소
│   │   ├── providers/        # 제공자 관리
│   │   ├── agents/           # Agents 구성
│   │   └── ui/               # 기본 구성요소
│   ├── hooks/                # 사용자 정의 Hooks
│   ├── i18n/                 # 국제화
│   │   ├── config.ts         # i18n 구성
│   │   └── locales/          # 번역 파일
│   ├── lib/api.ts            # API 래퍼
│   └── types/                # 유형 정의
├── src-tauri/                # Rust 백엔드
│   ├── src/
│   │   ├── commands.rs       # Tauri 명령
│   │   ├── service.rs        # 구성 서비스
│   │   ├── models.rs         # 데이터 모델
│   │   └── error.rs          # 오류 유형
│   └── Cargo.toml
└── tauri.conf.json           # Tauri 구성
```

## 🔧 구성 파일

OpenClaw 구성 파일 위치: `~/.openclaw/openclaw.json`

### 주요 구성 옵션

#### models.providers
```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "crs": {
        "baseUrl": "https://api.example.com",
        "apiKey": "sk-...",
        "api": "anthropic-messages",
        "models": [...]
      }
    }
  }
}
```

#### agents.defaults
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "crs/claude-opus-4-6",
        "fast": "crs/claude-haiku-4-5-20251001",
        "balanced": "crs/claude-sonnet-4-5-20250929",
        "powerful": "crs/claude-opus-4-6"
      },
      "maxConcurrent": 6,
      "subagents": {
        "maxConcurrent": 12
      }
    }
  }
}
```

## 🎯 지원되는 제공자

- **Anthropic Claude**: 공식 Claude 모델
- **OpenAI**: GPT-4o, GPT-4o Mini, o1-preview
- **Ollama**: 로컬 모델(Llama, Qwen, DeepSeek Coder)
- **Zhipu GLM**: GLM-4 Plus/Air/Flash
- **Kimi (Moonshot)**: Moonshot v1 시리즈

## 🌍 국제화

Claw Config는 다음 언어를 지원합니다:

| 언어 | 코드 | 파일 |
|------|------|------|
| English | `en` | `src/i18n/locales/en.json` |
| 中文 | `zh` | `src/i18n/locales/zh.json` |
| 日本語 | `ja` | `src/i18n/locales/ja.json` |
| 한국어 | `ko` | `src/i18n/locales/ko.json` |

### 새 언어 추가

1. `src/i18n/locales/[code].json`에 새 번역 파일 생성
2. `src/i18n/config.ts`를 업데이트하여 새 언어 가져오기 및 등록
3. `src/components/LanguageSelector.tsx`에 언어 옵션 추가

## 📝 개발 참고 사항

### 새 제공자 추가

1. `src/types/index.ts`에 프리셋 구성 추가
2. UI가 자동으로 "제공자 추가" 드롭다운에 표시됩니다

### 새 기능 추가

1. **Rust 백엔드**: `src-tauri/src/commands.rs`에 명령 추가
2. **프론트엔드 API**: `src/lib/api.ts`에 API 함수 추가
3. **React Hooks**: `src/hooks/`에 사용자 정의 훅 생성
4. **UI 구성요소**: `src/components/`에 구성요소 생성
5. **번역**: 모든 locale 파일에 번역 키 추가

## 📄 라이선스

MIT License

---

Made with 🦐 by 大虾
