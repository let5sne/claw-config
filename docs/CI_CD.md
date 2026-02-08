# CI/CD 配置说明

## 概述

本项目配置了 GitHub Actions 用于持续集成（CI）和自动化发布。

## 工作流

### 1. CI 工作流 (.github/workflows/ci.yml)

**触发条件：**
- 推送到 `main` 分支
- 创建针对 `main` 分支的 Pull Request

**执行内容：**
- 前端代码检查（TypeScript 类型检查）
- Rust 代码检查（格式化、Clippy）
- 多平台测试（Ubuntu、Windows、macOS）
- 构建验证

### 2. Release 工作流 (.github/workflows/release.yml)

**触发条件：**
- 推送版本标签（如 `v1.0.0`）

**执行内容：**
- 构建多平台二进制文件
  - Windows (x64): MSI 安装程序
  - macOS Intel: DMG 安装程序
  - macOS Apple Silicon: DMG 安装程序
  - macOS Universal: DMG 安装程序
  - Linux: AppImage、DEB 包
- 创建 GitHub Release
- 上传构建产物

## 首次设置

### 1. 生成 Tauri 密钥对

Tauri 需要密钥对来签名和验证更新包。

```bash
# 安装 Tauri CLI（如果尚未安装）
cargo install tauri-cli --version "^2.0.0"

# 生成密钥对
cargo tauri signer generate

# 输出示例：
# Private key: dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHNlY3JldCBrZXk6IE...
# Public key: dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IDQw...
# Key password: <生成的密码>
```

**重要：** 安全保存这些信息！

### 2. 配置 GitHub Secrets

在 GitHub 仓库中设置以下 Secrets（Settings → Secrets and variables → Actions → New repository secret）：

| Secret 名称 | 值 | 说明 |
|------------|---|------|
| `TAURI_PRIVATE_KEY` | 上一步生成的私钥 | 用于签名更新包 |
| `TAURI_KEY_PASSWORD` | 上一步生成的密码 | 私钥密码 |

### 3. 更新 tauri.conf.json

确保 `src-tauri/tauri.conf.json` 中的 `plugins.updater.pubkey` 与生成的公钥匹配。

## 发布新版本

### 方式一：通过 Git 标签（推荐）

```bash
# 创建版本标签
git tag v1.0.0

# 推送标签到 GitHub
git push origin v1.0.0
```

标签格式：`vX.Y.Z`
- `X` = 主版本号（重大变更）
- `Y` = 次版本号（新功能）
- `Z` = 修订号（Bug 修复）

### 预发布版本

对于测试版本，可以使用：

```bash
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1
```

包含 `-alpha`、`-beta`、`-rc` 等后缀的版本将被标记为 Pre-release。

### 方式二：通过 GitHub 界面

1. 进入 GitHub 仓库
2. 点击 "Releases" → "Draft a new release"
3. 选择标签或创建新标签
4. 填写发布说明
5. 点击 "Publish release"

## 版本号同步

确保以下文件中的版本号一致：

1. `package.json` - `"version": "0.1.0"`
2. `src-tauri/Cargo.toml` - `version = "0.1.0"`
3. `src-tauri/tauri.conf.json` - `"version": "0.1.0"`

## 查看构建状态

- CI 检查：Actions 标签 → CI 工作流
- 发布状态：Actions 标签 → Release 工作流
- 下载构建物：Releases 页面

## 故障排查

### 构建失败

1. **检查日志**：在 Actions 页面查看详细错误信息
2. **本地测试**：在推送前先运行 `npm run tauri:build`
3. **版本号不一致**：确保所有配置文件版本号匹配

### 签名错误

1. 确认 `TAURI_PRIVATE_KEY` 和 `TAURI_KEY_PASSWORD` 正确设置
2. 检查 `tauri.conf.json` 中的公钥是否匹配

### 多平台构建问题

- Linux 构建需要特定的系统库
- macOS 构建需要在 macOS 运行器上进行
- Windows 构建通常最稳定

## 工作流自定义

### 修改触发条件

编辑 `.github/workflows/ci.yml` 或 `.github/workflows/release.yml` 中的 `on` 部分。

### 添加更多平台

在 `matrix.include` 中添加新的目标平台配置。

### 添加额外步骤

在工作流的 `steps` 部分添加自定义操作。

## 相关链接

- [Tauri 发布指南](https://v2.tauri.app/distribute/create-updater/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
