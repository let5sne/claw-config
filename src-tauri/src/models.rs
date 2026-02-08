use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// OpenClaw 配置结构
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpenClawConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub meta: Option<ConfigMeta>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub wizard: Option<WizardConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub models: Option<ModelsConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub agents: Option<AgentsConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub auth: Option<AuthConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub messages: Option<MessagesConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub commands: Option<CommandsConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gateway: Option<GatewayConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub skills: Option<SkillsConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct ConfigMeta {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lastTouchedVersion: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lastTouchedAt: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub comment: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelsConfig {
    pub mode: String,
    pub providers: HashMap<String, Provider>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct Provider {
    pub baseUrl: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub apiKey: Option<String>,
    pub api: String,
    pub models: Vec<ModelInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct ModelInfo {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub reasoning: bool,
    pub input: Vec<String>,
    pub cost: ModelCost,
    pub contextWindow: usize,
    pub maxTokens: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tier: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct ModelCost {
    #[serde(rename = "input")]
    pub cost_input: f64,
    #[serde(rename = "output")]
    pub cost_output: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cacheRead: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cacheWrite: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentsConfig {
    pub defaults: AgentsDefaults,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct AgentsDefaults {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model: Option<ModelConfig>,
    #[serde(default)]
    pub models: HashMap<String, ModelAlias>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workspace: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub maxConcurrent: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subagents: Option<SubagentsConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub caching: Option<CachingConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timeout: Option<TimeoutConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub retry: Option<RetryConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub compaction: Option<CompactionConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelConfig {
    pub primary: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub fast: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub balanced: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub powerful: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelAlias {
    pub alias: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubagentsConfig {
    #[serde(rename = "maxConcurrent")]
    pub max_concurrent: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CachingConfig {
    pub enabled: bool,
    #[serde(rename = "maxCacheSize")]
    pub max_cache_size: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimeoutConfig {
    pub request: u64,
    pub idle: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetryConfig {
    #[serde(rename = "maxAttempts")]
    pub max_attempts: u32,
    pub backoff: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompactionConfig {
    pub mode: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub threshold: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub profiles: Option<HashMap<String, AuthProfile>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthProfile {
    pub provider: String,
    pub mode: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GatewayConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub port: Option<u16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mode: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bind: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub auth: Option<GatewayAuthConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tailscale: Option<TailscaleConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GatewayAuthConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mode: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub token: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct TailscaleConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mode: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub resetOnExit: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct WizardConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lastRunAt: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lastRunVersion: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lastRunCommand: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lastRunMode: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct MessagesConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ackReactionScope: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct CommandsConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub native: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub nativeSkills: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillsConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub install: Option<SkillsInstallConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct SkillsInstallConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub nodeManager: Option<String>,
}

// 创建默认配置
impl Default for OpenClawConfig {
    fn default() -> Self {
        Self {
            meta: None,
            wizard: None,
            models: None,
            agents: None,
            auth: None,
            messages: None,
            commands: None,
            gateway: None,
            skills: None,
        }
    }
}
