/**
 * OpenClaw 配置文件类型定义
 * 基于 openclaw.json 的结构
 */

// Provider 类型
export interface Provider {
  baseUrl: string;
  apiKey: string;
  api: ApiType;
  models: ModelInfo[];
}

export type ApiType = 'anthropic-messages' | 'openai-chat' | 'ollama-chat';

export interface ModelInfo {
  id: string;
  name: string;
  reasoning: boolean;
  input: string[];
  cost: ModelCost;
  contextWindow: number;
  maxTokens: number;
  tier?: ModelTier;
}

export interface ModelCost {
  input: number;
  output: number;
  cacheRead?: number;
  cacheWrite?: number;
}

export type ModelTier = 'fast' | 'balanced' | 'powerful';

// Agents 配置类型
export interface AgentsDefaults {
  model: ModelConfig;
  models: Record<string, ModelAlias>;
  workspace?: string;
  compaction?: CompactionConfig;
  maxConcurrent?: number;
  subagents?: SubagentsConfig;
  caching?: CachingConfig;
  timeout?: TimeoutConfig;
  retry?: RetryConfig;
}

export interface ModelConfig {
  primary: string;
  fast?: string;
  balanced?: string;
  powerful?: string;
}

export interface ModelAlias {
  alias: string;
  description?: string;
}

export interface CompactionConfig {
  mode: string;
  threshold?: number;
}

export interface SubagentsConfig {
  maxConcurrent: number;
}

export interface CachingConfig {
  enabled: boolean;
  maxCacheSize: string;
}

export interface TimeoutConfig {
  request: number;
  idle: number;
}

export interface RetryConfig {
  maxAttempts: number;
  backoff: string;
}

// 完整的 OpenClaw 配置
export interface OpenClawConfig {
  meta?: ConfigMeta;
  wizard?: WizardConfig;
  auth?: AuthConfig;
  models?: ModelsConfig;
  agents?: AgentsConfig;
  messages?: MessagesConfig;
  commands?: CommandsConfig;
  gateway?: GatewayConfig;
  skills?: SkillsConfig;
}

export interface ConfigMeta {
  lastTouchedVersion?: string;
  lastTouchedAt?: string;
  comment?: string;
}

export interface WizardConfig {
  lastRunAt?: string;
  lastRunVersion?: string;
  lastRunCommand?: string;
  lastRunMode?: string;
}

export interface AuthConfig {
  profiles?: Record<string, AuthProfile>;
}

export interface AuthProfile {
  provider?: string;
  mode?: string;
}

export interface ModelsConfig {
  mode: 'merge' | 'replace';
  providers: Record<string, Provider>;
}

export interface AgentsConfig {
  defaults: AgentsDefaults;
}

export interface MessagesConfig {
  ackReactionScope?: string;
}

export interface CommandsConfig {
  native?: string;
  nativeSkills?: string;
}

export interface GatewayConfig {
  port?: number;
  mode?: string;
  bind?: string;
  auth?: {
    mode?: string;
    token?: string;
  };
  tailscale?: {
    mode?: string;
    resetOnExit?: boolean;
  };
}

export interface SkillsConfig {
  install?: {
    nodeManager?: string;
  };
}

// UI 状态类型
export interface ProviderPreset {
  id: string;
  name: string;
  apiType: ApiType;
  supportsEndpoint: boolean;
  defaultEndpoint?: string;
  models: Omit<ModelInfo, 'cost'>[];
}

// Provider 预设配置
export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    apiType: 'anthropic-messages',
    supportsEndpoint: false,
    models: [
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', reasoning: true, input: ['text', 'image'], contextWindow: 200000, maxTokens: 8192, tier: 'fast' },
      { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', reasoning: true, input: ['text', 'image'], contextWindow: 200000, maxTokens: 16000, tier: 'balanced' },
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', reasoning: true, input: ['text', 'image'], contextWindow: 200000, maxTokens: 16000, tier: 'powerful' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    apiType: 'openai-chat',
    supportsEndpoint: false,
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', reasoning: false, input: ['text', 'image'], contextWindow: 128000, maxTokens: 4096, tier: 'balanced' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', reasoning: false, input: ['text', 'image'], contextWindow: 128000, maxTokens: 16384, tier: 'fast' },
      { id: 'o1-preview', name: 'o1-preview', reasoning: true, input: ['text'], contextWindow: 128000, maxTokens: 32768, tier: 'powerful' },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    apiType: 'ollama-chat',
    supportsEndpoint: true,
    defaultEndpoint: 'http://localhost:11434',
    models: [
      { id: 'llama3.2', name: 'Llama 3.2', reasoning: false, input: ['text'], contextWindow: 128000, maxTokens: 4096, tier: 'fast' },
      { id: 'qwen2.5-coder', name: 'Qwen 2.5 Coder', reasoning: false, input: ['text'], contextWindow: 32768, maxTokens: 8192, tier: 'balanced' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', reasoning: false, input: ['text'], contextWindow: 16384, maxTokens: 4096, tier: 'fast' },
    ],
  },
  {
    id: 'glm',
    name: '智谱 GLM',
    apiType: 'openai-chat',
    supportsEndpoint: true,
    defaultEndpoint: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { id: 'glm-4-plus', name: 'GLM-4 Plus', reasoning: true, input: ['text', 'image'], contextWindow: 128000, maxTokens: 8192, tier: 'powerful' },
      { id: 'glm-4-air', name: 'GLM-4 Air', reasoning: false, input: ['text'], contextWindow: 128000, maxTokens: 4096, tier: 'fast' },
      { id: 'glm-4-flash', name: 'GLM-4 Flash', reasoning: false, input: ['text'], contextWindow: 128000, maxTokens: 4096, tier: 'fast' },
    ],
  },
  {
    id: 'kimi',
    name: 'Kimi (Moonshot)',
    apiType: 'openai-chat',
    supportsEndpoint: true,
    defaultEndpoint: 'https://api.moonshot.cn/v1',
    models: [
      { id: 'moonshot-v1-128k', name: 'Kimi Moonshot v1 128k', reasoning: false, input: ['text'], contextWindow: 128000, maxTokens: 4096, tier: 'balanced' },
      { id: 'moonshot-v1-32k', name: 'Kimi Moonshot v1 32k', reasoning: false, input: ['text'], contextWindow: 32000, maxTokens: 4096, tier: 'balanced' },
      { id: 'moonshot-v1-8k', name: 'Kimi Moonshot v1 8k', reasoning: false, input: ['text'], contextWindow: 8000, maxTokens: 4096, tier: 'fast' },
    ],
  },
];
