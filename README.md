# 🦐 OpenClaw Switch

OpenClaw 配置管理工具 - 一个桌面应用，用于可视化配置 OpenClaw 的 `openclaw.json` 文件。

## ✨ 功能

- **Provider 管理**: 可视化添加/编辑/删除模型提供商
  - 支持多个主流 AI 服务商
  - 预设配置快速添加
  - 实时模型列表同步

- **Agents 配置**: 配置 OpenClaw Agents 默认行为
  - 模型分层配置
  - 并发数调优
  - 性能参数设置

- **配置管理**
  - 实时保存到 `~/.openclaw/openclaw.json`
  - 配置备份与恢复
  - 安全的 API Key 管理

## 🛠️ 技术栈

- **桌面框架**: Tauri 2.8
- **后端**: Rust
- **前端**: React 18 + TypeScript
- **UI**: TailwindCSS + 自定义组件
- **状态管理**: TanStack Query v5

## 📦 开发

### 前提条件

- Node.js 18+
- Rust 1.70+
- Tauri CLI 2.8+

### 快速开始

1. **安装依赖**
   ```bash
   cd openclaw-switch
   npm install
   ```

2. **开发模式**
   ```bash
   npm run tauri dev
   ```
   或双击运行 `../dev-switch.bat`

3. **构建应用**
   ```bash
   npm run tauri build
   ```
   或双击运行 `../build-switch.bat`

## 📁 项目结构

```
openclaw-switch/
├── src/                      # React 前端
│   ├── components/           # UI 组件
│   │   ├── providers/        # Provider 管理
│   │   ├── agents/           # Agents 配置
│   │   └── ui/               # 基础组件
│   ├── hooks/                # 自定义 Hooks
│   ├── lib/api.ts            # API 封装
│   └── types/               # 类型定义
├── src-tauri/                # Rust 后端
│   ├── src/
│   │   ├── commands/         # Tauri 命令
│   │   ├── service.rs        # 配置服务
│   │   ├── models.rs         # 数据模型
│   │   └── error.rs          # 错误类型
│   └── Cargo.toml
└── tauri.conf.json          # Tauri 配置
```

## 🔧 配置文件

OpenClaw 配置文件位置：`~/.openclaw/openclaw.json`

### 主要配置项

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

## 🎯 支持的 Provider

- **Anthropic Claude**: 官方 Claude 模型
- **OpenAI**: GPT-4o、GPT-4o Mini、o1-preview
- **Ollama**: 本地模型（Llama、Qwen、DeepSeek Coder）
- **智谱 GLM**: GLM-4 Plus/Air/Flash
- **Kimi (Moonshot)**: Moonshot v1 系列

## 📝 开发说明

### 添加新 Provider

1. 在 `src/types/index.ts` 中添加预设配置
2. UI 会自动显示在添加 Provider 下拉列表中

### 添加新功能

1. **Rust 后端**: 在 `src-tauri/src/commands.rs` 添加命令
2. **前端 API**: 在 `src/lib/api.ts` 添加 API 函数
3. **React Hooks**: 在 `src/hooks/` 创建自定义 Hook
4. **UI 组件**: 在 `src/components/` 创建组件

## 📄 许可证

MIT License

---

Made with 🦐 by 大虾
