# 🦐 Claw Config

A desktop application for visually configuring OpenClaw's `openclaw.json` file.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![i18n](https://img.shields.io/badge/i18n-4%20languages-blue)](#internationalization)

**[中文](README.zh.md) | [日本語](README.ja.md) | [한국어](README.ko.md)**

## ✨ Features

### Provider Management
- Visually add/edit/delete model providers
- Support for multiple mainstream AI service providers
- Quick addition with preset configurations
- Real-time model list synchronization

### Agents Configuration
- Configure OpenClaw Agents default behavior
- Model tier configuration (primary, fast, balanced, powerful)
- Concurrency optimization
- Performance parameter tuning

### Configuration Management
- Real-time save to `~/.openclaw/openclaw.json`
- Configuration backup and restore
- Secure API Key management

### Internationalization (i18n)
- Support for 4 languages: English, Chinese (中文), Japanese (日本語), Korean (한국어)
- Language selection persisted in browser storage
- Automatic browser language detection

## 🛠️ Tech Stack

- **Desktop Framework**: Tauri 2.8
- **Backend**: Rust
- **Frontend**: React 18 + TypeScript
- **UI**: TailwindCSS + shadcn/ui components
- **State Management**: TanStack Query v5
- **Internationalization**: i18next, react-i18next

## 📦 Development

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Tauri CLI 2.8+

### Quick Start

1. **Install dependencies**
   ```bash
   cd claw-config
   npm install
   ```

2. **Development mode**
   ```bash
   npm run tauri dev
   ```
   Or double-click `../dev-switch.bat`

3. **Build application**
   ```bash
   npm run tauri build
   ```
   Or double-click `../build-switch.bat`

## 📁 Project Structure

```
claw-config/
├── src/                      # React frontend
│   ├── components/           # UI components
│   │   ├── providers/        # Provider management
│   │   ├── agents/           # Agents configuration
│   │   └── ui/               # Base components
│   ├── hooks/                # Custom Hooks
│   ├── i18n/                 # Internationalization
│   │   ├── config.ts         # i18n configuration
│   │   └── locales/          # Translation files
│   ├── lib/api.ts            # API wrapper
│   └── types/                # Type definitions
├── src-tauri/                # Rust backend
│   ├── src/
│   │   ├── commands.rs       # Tauri commands
│   │   ├── service.rs        # Configuration service
│   │   ├── models.rs         # Data models
│   │   └── error.rs          # Error types
│   └── Cargo.toml
└── tauri.conf.json           # Tauri configuration
```

## 🔧 Configuration File

OpenClaw configuration file location: `~/.openclaw/openclaw.json`

### Main Configuration Options

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

## 🎯 Supported Providers

- **Anthropic Claude**: Official Claude models
- **OpenAI**: GPT-4o, GPT-4o Mini, o1-preview
- **Ollama**: Local models (Llama, Qwen, DeepSeek Coder)
- **Zhipu GLM**: GLM-4 Plus/Air/Flash
- **Kimi (Moonshot)**: Moonshot v1 series

## 🌍 Internationalization

Claw Config supports the following languages:

| Language | Code | File |
|----------|------|------|
| English | `en` | `src/i18n/locales/en.json` |
| 中文 | `zh` | `src/i18n/locales/zh.json` |
| 日本語 | `ja` | `src/i18n/locales/ja.json` |
| 한국어 | `ko` | `src/i18n/locales/ko.json` |

### Adding a New Language

1. Create a new translation file in `src/i18n/locales/[code].json`
2. Update `src/i18n/config.ts` to import and register the new language
3. Add the language option to `src/components/LanguageSelector.tsx`

## 📝 Development Notes

### Adding a New Provider

1. Add preset configuration in `src/types/index.ts`
2. The UI will automatically display it in the "Add Provider" dropdown

### Adding New Features

1. **Rust Backend**: Add commands in `src-tauri/src/commands.rs`
2. **Frontend API**: Add API functions in `src/lib/api.ts`
3. **React Hooks**: Create custom hooks in `src/hooks/`
4. **UI Components**: Create components in `src/components/`
5. **Translations**: Add translation keys to all locale files

## 📄 License

MIT License

---

Made with 🦐 by 大虾
