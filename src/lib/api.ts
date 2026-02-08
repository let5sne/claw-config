import { invoke } from '@tauri-apps/api/core';
import type {
  OpenClawConfig,
  Provider,
  AgentsDefaults,
  ModelInfo
} from '../types';

// 配置 API
export const configApi = {
  getConfig: (): Promise<OpenClawConfig> => invoke('get_config'),
  saveConfig: (config: OpenClawConfig): Promise<void> => invoke('save_config', { config }),
  getConfigPath: (): Promise<string> => invoke('get_config_path'),
  configExists: (): Promise<boolean> => invoke('config_exists'),
  backupConfig: (): Promise<string> => invoke('backup_config'),
  restoreConfig: (backupPath: string): Promise<void> => invoke('restore_config', { backupPath }),
};

// Provider API
export const providerApi = {
  getProviders: (): Promise<Record<string, Provider>> => invoke('get_providers'),
  addProvider: (id: string, provider: Provider): Promise<void> => invoke('add_provider', { id, provider }),
  updateProvider: (id: string, provider: Provider): Promise<void> => invoke('update_provider', { id, provider }),
  deleteProvider: (id: string): Promise<void> => invoke('delete_provider', { id }),
};

// Agents API
export const agentsApi = {
  getAgentsDefaults: (): Promise<AgentsDefaults | null> => invoke('get_agents_defaults'),
  saveAgentsDefaults: (defaults: AgentsDefaults): Promise<void> => invoke('save_agents_defaults', { defaults }),
};

// 工具函数
export const configUtils = {
  // 从 Provider ID 和模型 ID 生成完整的模型 ID
  getModelId: (providerId: string, modelId: string): string => `${providerId}/${modelId}`,

  // 解析模型 ID
  parseModelId: (fullModelId: string): { providerId: string; modelId: string } => {
    const parts = fullModelId.split('/');
    if (parts.length >= 2) {
      return {
        providerId: parts[0],
        modelId: parts.slice(1).join('/'),
      };
    }
    return {
      providerId: 'unknown',
      modelId: fullModelId,
    };
  },

  // 检查 Provider 是否有 API Key
  hasApiKey: (provider: Provider): boolean => {
    return provider.apiKey !== '' && provider.apiKey !== 'YOUR_API_KEY_HERE';
  },

  // 获取 Provider 的显示名称
  getProviderDisplayName: (id: string, provider: Provider): string => {
    if (provider.models.length > 0 && provider.models[0].name) {
      // 从第一个模型名称中提取 Provider 名称
      const modelName = provider.models[0].name;
      const match = modelName.match(/^(.+?)\s*\(/);
      if (match) return match[1].trim();
    }
    return id.charAt(0).toUpperCase() + id.slice(1);
  },

  // 按层级分组模型
  groupModelsByTier: (models: ModelInfo[]): Record<string, ModelInfo[]> => {
    const groups: Record<string, ModelInfo[]> = {
      fast: [],
      balanced: [],
      powerful: [],
      other: [],
    };

    models.forEach(model => {
      const tier = model.tier || 'other';
      if (!groups[tier]) {
        groups[tier] = [];
      }
      groups[tier].push(model);
    });

    return groups;
  },

  // 获取所有可用的模型（从所有 Provider）
  getAllAvailableModels: (providers: Record<string, Provider>): Array<{
    fullId: string;
    providerId: string;
    model: ModelInfo;
  }> => {
    const models: Array<{ fullId: string; providerId: string; model: ModelInfo }> = [];

    Object.entries(providers).forEach(([providerId, provider]) => {
      provider.models.forEach(model => {
        models.push({
          fullId: `${providerId}/${model.id}`,
          providerId,
          model,
        });
      });
    });

    return models;
  },

  // 验证 Provider 配置
  validateProvider: (provider: Provider): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!provider.baseUrl || provider.baseUrl.trim() === '') {
      errors.push('Base URL 不能为空');
    }

    if (!provider.apiKey || provider.apiKey.trim() === '') {
      errors.push('API Key 不能为空');
    }

    if (!provider.api || provider.api.trim() === '') {
      errors.push('API 类型不能为空');
    }

    if (provider.models.length === 0) {
      errors.push('至少需要配置一个模型');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // 验证 Agents Defaults 配置
  validateAgentsDefaults: (defaults: AgentsDefaults): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!defaults.model?.primary || defaults.model.primary.trim() === '') {
      errors.push('主模型不能为空');
    }

    if (defaults.maxConcurrent !== undefined && defaults.maxConcurrent < 1) {
      errors.push('最大并发数必须大于 0');
    }

    if (defaults.subagents?.maxConcurrent !== undefined && defaults.subagents.maxConcurrent < 1) {
      errors.push('子代理最大并发数必须大于 0');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};
