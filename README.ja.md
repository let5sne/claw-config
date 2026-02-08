# 🦐 Claw Config

OpenClaw の `openclaw.json` ファイルを視覚的に設定するためのデスクトップアプリケーション。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![i18n](https://img.shields.io/badge/i18n-4%20languages-blue)](#国際化)

**[English](README.md) | [中文](README.zh.md) | [한국어](README.ko.md)**

## ✨ 機能

### プロバイダー管理
- モデルプロバイダーの視覚的な追加/編集/削除
- 複数の主要 AI サービスプロバイダーをサポート
- プリセット設定による迅速な追加
- リアルタイムモデルリスト同期

### Agents 設定
- OpenClaw Agents のデフォルト動作を設定
- モデル階層設定（primary、fast、balanced、powerful）
- 並行性の最適化
- パフォーマンスパラメータの調整

### 設定管理
- `~/.openclaw/openclaw.json` へのリアルタイム保存
- 設定のバックアップと復元
- 安全な API キー管理

### 国際化 (i18n)
- 4 つの言語をサポート：英語、中文、日本語、한국어
- 言語選択はブラウザストレージに保存されます
- ブラウザ言語の自動検出

## 🛠️ 技術スタック

- **デスクトップフレームワーク**: Tauri 2.8
- **バックエンド**: Rust
- **フロントエンド**: React 18 + TypeScript
- **UI**: TailwindCSS + shadcn/ui コンポーネント
- **状態管理**: TanStack Query v5
- **国際化**: i18next、react-i18next

## 📦 開発

### 前提条件

- Node.js 18+
- Rust 1.70+
- Tauri CLI 2.8+

### クイックスタート

1. **依存関係のインストール**
   ```bash
   cd claw-config
   npm install
   ```

2. **開発モード**
   ```bash
   npm run tauri dev
   ```
   または `../dev-switch.bat` をダブルクリック

3. **アプリケーションのビルド**
   ```bash
   npm run tauri build
   ```
   または `../build-switch.bat` をダブルクリック

## 📁 プロジェクト構造

```
claw-config/
├── src/                      # React フロントエンド
│   ├── components/           # UI コンポーネント
│   │   ├── providers/        # プロバイダー管理
│   │   ├── agents/           # Agents 設定
│   │   └── ui/               # 基本コンポーネント
│   ├── hooks/                # カスタム Hooks
│   ├── i18n/                 # 国際化
│   │   ├── config.ts         # i18n 設定
│   │   └── locales/          # 翻訳ファイル
│   ├── lib/api.ts            # API ラッパー
│   └── types/                # 型定義
├── src-tauri/                # Rust バックエンド
│   ├── src/
│   │   ├── commands.rs       # Tauri コマンド
│   │   ├── service.rs        # 設定サービス
│   │   ├── models.rs         # データモデル
│   │   └── error.rs          # エラー型
│   └── Cargo.toml
└── tauri.conf.json           # Tauri 設定
```

## 🔧 設定ファイル

OpenClaw 設定ファイルの場所：`~/.openclaw/openclaw.json`

### 主要な設定項目

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

## 🎯 サポートされているプロバイダー

- **Anthropic Claude**: 公式 Claude モデル
- **OpenAI**: GPT-4o、GPT-4o Mini、o1-preview
- **Ollama**: ローカルモデル（Llama、Qwen、DeepSeek Coder）
- **Zhipu GLM**: GLM-4 Plus/Air/Flash
- **Kimi (Moonshot)**: Moonshot v1 シリーズ

## 🌍 国際化

Claw Config は以下の言語をサポートしています：

| 言語 | コード | ファイル |
|------|--------|----------|
| English | `en` | `src/i18n/locales/en.json` |
| 中文 | `zh` | `src/i18n/locales/zh.json` |
| 日本語 | `ja` | `src/i18n/locales/ja.json` |
| 한국어 | `ko` | `src/i18n/locales/ko.json` |

### 新しい言語を追加する

1. `src/i18n/locales/[code].json` に新しい翻訳ファイルを作成
2. `src/i18n/config.ts` を更新して新しい言語をインポート・登録
3. `src/components/LanguageSelector.tsx` に言語オプションを追加

## 📝 開発メモ

### 新しいプロバイダーを追加する

1. `src/types/index.ts` にプリセット設定を追加
2. UI は自動的に「プロバイダーを追加」ドロップダウンに表示されます

### 新しい機能を追加する

1. **Rust バックエンド**: `src-tauri/src/commands.rs` にコマンドを追加
2. **フロントエンド API**: `src/lib/api.ts` に API 関数を追加
3. **React Hooks**: `src/hooks/` にカスタムフックを作成
4. **UI コンポーネント**: `src/components/` にコンポーネントを作成
5. **翻訳**: すべての locale ファイルに翻訳キーを追加

## 📄 ライセンス

MIT License

---

Made with 🦐 by 大虾
